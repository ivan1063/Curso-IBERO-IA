---
name: enterprise-chatbot-builder
description: Guide for developing omnichannel conversational AI chatbots for enterprises and SMBs across WhatsApp Business Cloud API, Telegram, web chat widgets, CRM integrations (HubSpot, Salesforce, Zoho), LLM RAG pipelines, and fallback routing to human agents.
---

# Enterprise & SMB Chatbot Builder Playbook

Use this skill when designing conversational agents, lead generation chatbots, customer service automations, and FAQ knowledge-retrieval bots.

## Channels & Connectors
1. **WhatsApp Business Cloud API (Meta)**:
   - Official Cloud API webhooks with HMAC-SHA256 signature verification.
   - Interactive messages (List Messages, Quick Reply Buttons, CTA URL buttons).
   - WhatsApp message templates for outbound notifications (Opt-in compliant).
2. **Web Chat Widgets**:
   - Lightweight, responsive floating chat components with instant streaming responses.
   - Session persistence via LocalStorage / SessionStorage.
   - Pre-chat lead capture form (Name, Email, Company, Pain Point).
3. **Conversational Architecture & RAG**:
   - **Intent Classifier**: Categorizes queries (Sales Inquiry, Technical Support, Order Status, Human Agent Request).
   - **Knowledge Base RAG**: Semantic search over company PDFs, catalog, FAQs using vector embeddings.
   - **Human Handover Protocol**: Seamless routing to Zendesk / LiveChat / WhatsApp agent if sentiment is negative or user requests human intervention.
4. **Integration with Backend Systems**:
   - Webhooks to n8n / Make / SAP Integration Suite / CRM to update lead scores, create support tickets, or check inventory in real time.
