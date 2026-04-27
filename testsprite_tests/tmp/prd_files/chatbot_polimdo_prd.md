# Chatbot Polimdo PRD

## Product
Chatbot Polimdo is a public web assistant for Politeknik Negeri Manado. It helps prospective students quickly find campus information about study programs, tuition, registration paths, scholarships, location, facilities, academic schedule, accreditation, and contacts.

## Users
Primary users are prospective students and visitors who need fast campus information without logging in. The app has no public login requirement for the landing page or chatbot.

## Core Flows
1. A visitor opens the landing page, reads campus and FAQ content, toggles theme if desired, and clicks a chat CTA.
2. The visitor opens the chat page, sees the welcome state, and the app initializes a chat session through `POST /api/chat/session`.
3. The visitor submits a question by typing or clicking a quick action. The app sends the question through `POST /api/chat/message` when online or uses the local fallback engine when offline.
4. The visitor sees a bot answer as text, an info card, or a contact fallback card.
5. The visitor clears the chat, which removes visible messages and resets the session state.

## Acceptance Criteria
- The landing page loads without authentication and presents clear navigation to chat.
- Theme toggle works on both landing and chat pages and persists across navigation.
- Accordions open and close in the landing page content areas.
- Chat input enables only when text is present.
- Clicking a quick action sends a relevant prefilled topic query.
- A submitted chat question creates a user bubble, shows a typing indicator, and renders a bot response.
- The clear button removes chat messages and restores the welcome state.
- The backend health endpoint responds at `/api/health` when the Node server is used.

## Test Target
Use `http://localhost:3010/` when available because the Node backend serves the static frontend and the `/api` routes from the same origin.
