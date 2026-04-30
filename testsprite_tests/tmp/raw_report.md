
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** chatbot-kampus v3
- **Date:** 2026-05-01
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Send a typed question and receive a bot response
- **Test Code:** [TC001_Send_a_typed_question_and_receive_a_bot_response.py](./TC001_Send_a_typed_question_and_receive_a_bot_response.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/bc5b5f85-549f-41f6-8fa0-476044d3c65f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Discover campus info and reach chat with theme preserved
- **Test Code:** [TC002_Discover_campus_info_and_reach_chat_with_theme_preserved.py](./TC002_Discover_campus_info_and_reach_chat_with_theme_preserved.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/95ef6f18-2487-4702-845e-52393f1a5411
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Reset conversation to welcome state after clearing chat
- **Test Code:** [TC003_Reset_conversation_to_welcome_state_after_clearing_chat.py](./TC003_Reset_conversation_to_welcome_state_after_clearing_chat.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/2b92ac49-6151-4d07-8ce0-d70f144d24f2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Chat shows welcome state and reaches connected status when available
- **Test Code:** [TC004_Chat_shows_welcome_state_and_reaches_connected_status_when_available.py](./TC004_Chat_shows_welcome_state_and_reaches_connected_status_when_available.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/58288965-c879-469a-88f5-53b81c61239a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Theme persists from landing page to chat page
- **Test Code:** [TC005_Theme_persists_from_landing_page_to_chat_page.py](./TC005_Theme_persists_from_landing_page_to_chat_page.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/dc0427d8-07a3-41f4-bd0c-a47ebc35ada2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Empty message cannot be submitted
- **Test Code:** [TC006_Empty_message_cannot_be_submitted.py](./TC006_Empty_message_cannot_be_submitted.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/258e3335-495a-494a-b0b5-e82c758a93ca
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Chat displays offline status when backend is unreachable
- **Test Code:** [TC007_Chat_displays_offline_status_when_backend_is_unreachable.py](./TC007_Chat_displays_offline_status_when_backend_is_unreachable.py)
- **Test Error:** TEST FAILURE

The chat did not enter offline mode when attempting to establish a backend session.

Observations:
- The chat header displays 'Online' with a green status indicator.
- Sending a message produced a typing indicator / active response state rather than an offline error.
- A previous navigation attempt briefly showed a network error (ERR_EMPTY_RESPONSE) but the app recovered and no offline indicator was visible.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/8cbd5e62-0d6b-43b4-9371-ab8b29adca9b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Quick-action chip submits as message and triggers response
- **Test Code:** [TC008_Quick_action_chip_submits_as_message_and_triggers_response.py](./TC008_Quick_action_chip_submits_as_message_and_triggers_response.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/22325bb8-c2eb-4f23-aee3-4aaa44a9ed2f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Clearing chat works after multiple messages
- **Test Code:** [TC009_Clearing_chat_works_after_multiple_messages.py](./TC009_Clearing_chat_works_after_multiple_messages.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/427b3764-51d5-4198-b7b2-959990263f0a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Landing page provides a working path to chat via floating entry point
- **Test Code:** [TC010_Landing_page_provides_a_working_path_to_chat_via_floating_entry_point.py](./TC010_Landing_page_provides_a_working_path_to_chat_via_floating_entry_point.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/055f6438-4e20-4832-9bdb-314a24ce733e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Send button enablement follows input content
- **Test Code:** [TC011_Send_button_enablement_follows_input_content.py](./TC011_Send_button_enablement_follows_input_content.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/96ad5b86-6655-4ccf-aa92-2355bc8ab593
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 User can start a new conversation after clearing chat
- **Test Code:** [TC012_User_can_start_a_new_conversation_after_clearing_chat.py](./TC012_User_can_start_a_new_conversation_after_clearing_chat.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/bc47434a-d656-40e2-abcf-f748b65ea00b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Use mobile menu to navigate to a section
- **Test Code:** [TC013_Use_mobile_menu_to_navigate_to_a_section.py](./TC013_Use_mobile_menu_to_navigate_to_a_section.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/f3b54325-873c-4a40-a18d-ae2f72610270
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Typing indicator appears while waiting for a response
- **Test Code:** [TC014_Typing_indicator_appears_while_waiting_for_a_response.py](./TC014_Typing_indicator_appears_while_waiting_for_a_response.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/50e5da6c-264c-44e2-8819-5e9b90bbeb19
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Send stays disabled after clearing until user types again
- **Test Code:** [TC015_Send_stays_disabled_after_clearing_until_user_types_again.py](./TC015_Send_stays_disabled_after_clearing_until_user_types_again.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e30a16ec-e232-4e6c-8bc5-80cd68a8566b/ed51979c-46d0-4ce0-8011-02fdee784a3b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **93.33** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---