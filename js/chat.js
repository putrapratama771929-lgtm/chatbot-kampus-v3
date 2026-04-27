/* ============================================
   CHAT.JS — Chat UI Controller
   Connects to backend API with fallback
   to local chatEngine for offline mode.
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // DOM Elements
  var chatMessages = document.getElementById('chat-messages');
  var chatInput = document.getElementById('chat-input');
  var sendBtn = document.getElementById('send-btn');
  var clearBtn = document.getElementById('clear-btn');
  var welcomeEl = document.getElementById('chat-welcome');
  var statusDot = document.querySelector('.status-dot');
  var statusTextEl = document.querySelector('.chat-header-status');

  var isProcessing = false;

  // API Configuration
  var API_BASE = window.location.origin + '/api';
  var sessionId = null;
  var useAPI = true;
  var retryCount = 0;
  var MAX_RETRIES = 2;

  // === Connection Status UI ===
  function setConnectionStatus(status) {
    if (!statusDot || !statusTextEl) return;

    statusDot.className = 'status-dot';
    var label = '';

    switch (status) {
      case 'online':
        statusDot.classList.add('status-online');
        label = 'Online';
        break;
      case 'connecting':
        statusDot.classList.add('status-connecting');
        label = 'Menghubungkan...';
        break;
      case 'offline':
        statusDot.classList.add('status-offline');
        label = 'Offline Mode';
        break;
    }

    statusTextEl.innerHTML = '<span class="status-dot ' + statusDot.className.replace('status-dot ', '') + '"></span>' + label;
  }

  // === Initialize: Create session ===
  function initSession() {
    setConnectionStatus('connecting');

    fetch(API_BASE + '/chat/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success && data.session_id) {
          sessionId = data.session_id;
          useAPI = true;
          retryCount = 0;
          setConnectionStatus('online');
          console.log('✅ Chat session created:', sessionId);
        } else {
          throw new Error('Invalid session response');
        }
      })
      .catch(function (err) {
        console.warn('⚠️ API unavailable, using offline mode:', err.message);
        useAPI = false;
        setConnectionStatus('offline');

        // Auto-retry after delay
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log('🔄 Retrying connection (' + retryCount + '/' + MAX_RETRIES + ')...');
          setTimeout(initSession, 5000 * retryCount);
        }
      });
  }

  initSession();

  // === Send Message ===
  function sendMessage(text) {
    if (!text || !text.trim() || isProcessing) return;
    text = text.trim();

    if (welcomeEl) {
      welcomeEl.style.display = 'none';
    }

    appendMessage('user', text);
    chatInput.value = '';
    chatInput.focus();
    updateSendButton();

    isProcessing = true;
    var typingEl = showTypingIndicator();

    if (useAPI && sessionId) {
      // === Online mode: call backend API ===
      fetch(API_BASE + '/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: text })
      })
        .then(function (res) { 
          // Check if response is not ok (e.g. 404, 500)
          // We still parse JSON to get the error message
          return res.json().then(function(data) {
            return { status: res.status, data: data };
          }); 
        })
        .then(function (result) {
          removeTyping(typingEl);
          var data = result.data;
          
          if (data.success && data.response) {
            renderBotResponse(data.response);
          } else {
            // Handle specific errors
            if (result.status === 404 || (data.error && data.error.toLowerCase().includes('session'))) {
              appendMessage('bot', 'Sesi chat Anda telah berakhir. Membuat sesi baru...');
              initSession(); // Re-initialize session
              setTimeout(function() {
                appendMessage('bot', 'Sesi baru telah dibuat. Silakan kirim ulang pertanyaan Anda.');
              }, 1500);
            } else {
              var errorMsg = data.error || 'Maaf, terjadi kesalahan. Silakan coba lagi.';
              appendMessage('bot', typeof errorMsg === 'string' ? errorMsg : 'Maaf, terjadi kesalahan. Silakan coba lagi.');
            }
          }
          isProcessing = false;
        })
        .catch(function (err) {
          console.error('API error:', err);
          removeTyping(typingEl);
          // Fallback to local engine
          useAPI = false;
          setConnectionStatus('offline');
          if (typeof ChatEngine !== 'undefined') {
            var response = ChatEngine.processMessage(text);
            renderBotResponse(response);
          } else {
            appendMessage('bot', 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.');
          }
          isProcessing = false;
          // Try to reconnect in background
          setTimeout(initSession, 5000);
        });
    } else {
      // === Offline mode: use local chatEngine ===
      var delay = 600 + Math.random() * 500;
      setTimeout(function () {
        removeTyping(typingEl);
        if (typeof ChatEngine !== 'undefined') {
          var response = ChatEngine.processMessage(text);
          renderBotResponse(response);
        } else {
          appendMessage('bot', 'Maaf, chatbot sedang offline.');
        }
        isProcessing = false;
      }, delay);
    }
  }

  function removeTyping(typingEl) {
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
  }

  // === Append a simple message bubble ===
  function appendMessage(sender, text) {
    var messageDiv = document.createElement('div');
    messageDiv.className = 'message message-' + sender + ' message-enter';

    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = sender === 'bot' ? '🤖' : '👤';

    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    var bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.innerHTML = formatText(text);

    var timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getTimeString();

    contentDiv.appendChild(bubbleDiv);
    contentDiv.appendChild(timeDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    // Trigger animation
    requestAnimationFrame(function () {
      messageDiv.classList.add('message-visible');
    });
  }

  // === Render bot response (text, info-card, fallback) ===
  function renderBotResponse(response) {
    var messageDiv = document.createElement('div');
    messageDiv.className = 'message message-bot message-enter';

    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = '🤖';

    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    var bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.innerHTML = formatText(response.text);
    contentDiv.appendChild(bubbleDiv);

    if (response.type === 'info-card' && response.card) {
      contentDiv.appendChild(buildInfoCard(response.card));
    }

    if (response.type === 'fallback' && response.contacts) {
      contentDiv.appendChild(buildFallbackCard(response.contacts));
    }

    var timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getTimeString();
    contentDiv.appendChild(timeDiv);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    // Trigger animation
    requestAnimationFrame(function () {
      messageDiv.classList.add('message-visible');
    });
  }

  // === Build Info Card ===
  function buildInfoCard(card) {
    var cardDiv = document.createElement('div');
    cardDiv.className = 'info-card';

    var titleDiv = document.createElement('div');
    titleDiv.className = 'info-card-title';
    titleDiv.textContent = card.title;
    cardDiv.appendChild(titleDiv);

    var listDiv = document.createElement('div');
    listDiv.className = 'info-card-list';

    card.items.forEach(function (item, index) {
      var itemDiv = document.createElement('div');
      itemDiv.className = 'info-card-item';
      itemDiv.style.animationDelay = (index * 0.05) + 's';

      var iconSpan = document.createElement('span');
      iconSpan.className = 'item-icon';
      iconSpan.textContent = item.icon;

      var textDiv = document.createElement('div');

      var nameDiv = document.createElement('div');
      nameDiv.className = 'item-name';
      nameDiv.textContent = item.name;

      var detailDiv = document.createElement('div');
      detailDiv.className = 'item-detail';
      detailDiv.textContent = item.detail;

      textDiv.appendChild(nameDiv);
      textDiv.appendChild(detailDiv);
      itemDiv.appendChild(iconSpan);
      itemDiv.appendChild(textDiv);
      listDiv.appendChild(itemDiv);
    });

    cardDiv.appendChild(listDiv);
    return cardDiv;
  }

  // === Build Fallback Card ===
  function buildFallbackCard(contacts) {
    var cardDiv = document.createElement('div');
    cardDiv.className = 'fallback-card';

    var titleDiv = document.createElement('div');
    titleDiv.className = 'fallback-card-title';
    titleDiv.textContent = '📞 Hubungi Admin';
    cardDiv.appendChild(titleDiv);

    var linksDiv = document.createElement('div');
    linksDiv.className = 'fallback-card-links';

    var keys = Object.keys(contacts);
    keys.forEach(function (key) {
      var c = contacts[key];
      var linkEl = document.createElement('a');
      linkEl.className = 'fallback-link';
      linkEl.href = c.url;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      linkEl.innerHTML = '<span>' + c.icon + '</span><span>' + c.label + ': ' + c.value + '</span>';
      linksDiv.appendChild(linkEl);
    });

    cardDiv.appendChild(linksDiv);
    return cardDiv;
  }

  // === Typing Indicator ===
  function showTypingIndicator() {
    var typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';

    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = '🤖';

    var dotsDiv = document.createElement('div');
    dotsDiv.className = 'typing-dots';
    dotsDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';

    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(dotsDiv);
    chatMessages.appendChild(typingDiv);
    scrollToBottom();

    return typingDiv;
  }

  // === Format text (bold, newlines, links) ===
  function formatText(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
  }

  // === Time string ===
  function getTimeString() {
    var now = new Date();
    var h = now.getHours().toString().padStart(2, '0');
    var m = now.getMinutes().toString().padStart(2, '0');
    return h + ':' + m;
  }

  // === Scroll to bottom ===
  function scrollToBottom() {
    setTimeout(function () {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 50);
  }

  // === Update send button state ===
  function updateSendButton() {
    if (sendBtn) {
      sendBtn.disabled = !chatInput.value.trim();
    }
  }

  // === Clear Chat ===
  function clearChat() {
    var messages = chatMessages.querySelectorAll('.message, .typing-indicator');
    messages.forEach(function (m) { m.remove(); });

    if (welcomeEl) {
      welcomeEl.style.display = '';
    }

    isProcessing = false;
    chatInput.value = '';
    updateSendButton();

    // Delete session on server and create a new one
    if (useAPI && sessionId) {
      fetch(API_BASE + '/chat/session/' + sessionId, { method: 'DELETE' })
        .catch(function () { /* ignore */ });
    }
    initSession();
  }

  // === Event Listeners ===

  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      sendMessage(chatInput.value);
    });
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(chatInput.value);
      }
    });

    chatInput.addEventListener('input', updateSendButton);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearChat);
  }

  document.querySelectorAll('.quick-action-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var query = this.getAttribute('data-query');
      if (query) {
        sendMessage(query);
      }
    });
  });

  updateSendButton();

});
