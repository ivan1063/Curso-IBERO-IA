---
name: sap-integration-suite
description: Comprehensive playbook for designing, developing, deploying, and troubleshooting SAP Integration Suite (Cloud Integration / CPI) solutions, SAP BTP integrations, S/4HANA OData/RFC/BAPI connectors, Groovy scripts, and enterprise iFlow patterns.
---

# SAP Integration Suite Playbook

Use this skill when developing enterprise integration flows (iFlows), connecting SAP and non-SAP systems, or configuring SAP Business Technology Platform (BTP) integration assets.

## Core Integration Patterns
1. **Request-Reply & Asynchronous Messaging**:
   - Idempotency with Message Deduplication (Message ID / Database table / JMS queues).
   - Reliable messaging with SAP BTP JMS Broker for at-least-once delivery.
2. **Data Transformation & Mapping**:
   - Graphical Message Mapping (XSLT 3.0 / XML / JSON).
   - Groovy scripting for custom business logic, dynamic header routing, and payload manipulation:
     ```groovy
     import com.sap.gateway.ip.core.customdev.util.Message
     import groovy.json.JsonSlurper
     import groovy.json.JsonOutput

     def Message processData(Message message) {
         def body = message.getBody(String)
         def json = new JsonSlurper().parseText(body)
         // Transformation logic
         message.setHeader("CamelHttpUri", "/api/v1/orders")
         message.setBody(JsonOutput.toJson(json))
         return message
     }
     ```
3. **Connectivity Adapters**:
   - **OData v2 / v4**: Best practice for SAP S/4HANA, SAP SuccessFactors, SAP C/4HANA.
   - **SOAP / IDoc**: Legacy SAP ERP (ECC 6.0) integration.
   - **REST / HTTP**: Integration with modern microservices, SaaS, and webhook consumers.
   - **Open Connectors**: Pre-built connectivity to 160+ third-party CRM, ERP, and payment gateways.

## Security & Governance Checklist
- Store all credentials, tokens, and OAuth keys in SAP BTP Keystore / Security Materials.
- Enforce OAuth 2.0 with mTLS (Mutual TLS) for inbound endpoints.
- Avoid logging sensitive payload data (PII, credit cards) in MPL (Message Processing Logs).
