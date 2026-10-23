---
name: automation-qa-auditor
description: Verification, automated inspection, code quality auditing, security checks, and autonomous remediation procedures across SAP iFlow configurations, BPM diagrams, Chatbot workflows, and Web applications.
---

# Automation Quality Auditor & Remediation Playbook

Use this skill to inspect, validate, and automatically fix errors, vulnerabilities, and inconsistencies across all deliverables produced by agency agents.

## Audit Dimensions & Checklists

### 1. SAP Integration Suite Auditing
- [ ] No hardcoded passwords or API keys in Groovy scripts or XML mappings.
- [ ] Error handling sub-processes (`Exception Subprocess`) present in every iFlow.
- [ ] Alerting and notification configured (Email / Slack / webhook) on failed message processing.
- [ ] Payloads validated against target XML/JSON schema before sending.

### 2. BPM & Workflow Auditing
- [ ] No orphan nodes or infinite loops without condition termination.
- [ ] All User Tasks have assigned timeout escalations or SLA timer events.
- [ ] Database transactions and compensation events properly isolated.

### 3. Chatbot System Auditing
- [ ] Fallback intent defined for out-of-scope inputs.
- [ ] Rate limiting and sanitization on incoming webhook payloads (prevent prompt injection & DDoS).
- [ ] Human handover mechanism is always reachable within 2 user turns.

### 4. Web Application Auditing
- [ ] Semantic HTML5 with accessible ARIA landmarks and WCAG 2.1 AA compliance.
- [ ] Zero broken links or unhandled JavaScript exceptions in console.
- [ ] Responsive design across desktop, tablet, and mobile breakpoints.

## Autonomous Remediation Protocol (Auto-Fix)
1. **Detect**: Identify the specific violation (Line number, file path, missing block).
2. **Isolate**: Determine if the fix is non-breaking.
3. **Remediate**: Apply code/configuration fix immediately using safe replacement tools.
4. **Verify**: Re-run validation checks to confirm problem resolution.
5. **Issue Compliance Report**: Provide an audit summary report with timestamp and diffs.
