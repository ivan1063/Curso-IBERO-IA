---
name: bpm-workflow-automation
description: Standard operating procedures and architecture guidelines for Business Process Management (BPMN 2.0), SAP Build Process Automation, Camunda 7/8, n8n, Make, human-in-the-loop task routing, SLA tracking, and exception handling.
---

# Business Process Management (BPM) & Workflow Automation Playbook

Use this skill when designing enterprise workflows, BPMN 2.0 diagrams, approval matrices, and event-driven automation for corporate and SMB operations.

## Architecture Workflow Rules
1. **BPMN 2.0 Standards**:
   - Explicit Start Events, Boundary Error Events, and End Terminating Events.
   - User Tasks with clear form schemas, deadline timers, and escalation triggers.
   - Exclusive Gateways (XOR) for binary decision trees; Parallel Gateways (AND) for multi-department sync.
2. **Human-in-the-Loop & Approval Matrix**:
   - Tiered approval limits (e.g., Level 1 < $5,000, Level 2 < $50,000, Level 3 Executive).
   - Delegation and substitution policies for out-of-office approvers.
   - Digital signature integration (DocuSign / Adobe Sign / Internal PKI).
3. **Resilience & Compensation**:
   - Every external system interaction (ERP update, CRM call, Notification) must have a compensation event or retry queue.
   - Dead Letter Queue (DLQ) pattern for manual operator triage.
4. **Metrics & KPI Tracking**:
   - Process cycle time (Start to Completion).
   - Bottleneck detection per User Task.
   - Automation rate (% of straight-through processing without manual intervention).
