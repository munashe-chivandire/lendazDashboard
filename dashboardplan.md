# Lendaz Owner Dashboard Plan

## Objectives
- Give property owners one place to manage listings, communications, documents, and operations.
- Surface actionable insights that help improve occupancy, retention, and revenue.
- Reduce manual handoffs by centralizing messaging, maintenance, and compliance workflows.

## Core Modules

### Messaging Center
- Unified inbox for enquiries, follow-ups, and tenant conversations with per-listing filters.
- Conversation timeline showing message history, attachments, status tags, and reminders.
- Quick-reply templates and read receipts to speed responses and track engagement.
- Integration points: email/SMS connectors, CRM-style prospect records, notification service.

### Document Hub
- Per-listing folders for leases, compliance documents, receipts, and media assets.
- Upload with version history, tagging, and e-signature triggers where needed.
- Expiring-document alerts and audit log to maintain compliance and transparency.
- Integration points: storage service, e-sign provider, compliance rules engine.

### Maintenance Hub
- Ticket board with priority, status, SLA timers, and escalation rules for open issues.
- Assign owners, tenants, or vendors; capture costs, parts, photos, and work notes.
- Calendar sync for scheduled repairs and post-completion feedback capture.
- Integration points: vendor directory, notification service, accounting ledger.

### Analytics Overview
- Configurable dashboard cards for listing performance, lead sources, and conversion funnels.
- Trend charts for views, enquiries, bookings, and revenue compared to market benchmarks.
- Drill-down filters by property, time range, campaign, and portfolio segment.
- Integration points: data warehouse/BI layer, tracking pixels, marketing attribution.

### Profile & Settings
- KYC/compliance checklist with progress meter and document submission steps.
- Payout method management, tax info, and notification preferences.
- Team roles, permissions, and activity audit trail for multi-user owner accounts.
- Integration points: identity verification, payments/payout rails, auth service.

## Cross-Cutting Considerations
- **Navigation & Layout:** Surface key metrics on landing page; quick links into each module.
- **State Management:** Decide on architecture (e.g., React + state store) to coordinate modules.
- **Security:** Role-based access, granular permissions, encryption at rest/in transit for documents.
- **Performance:** Async loading for heavy analytics queries and lazy-loaded conversation threads.
- **Mobile Responsiveness:** Ensure critical owner workflows are usable on tablets/phones.
- **Notifications:** Central service powering in-app, email, and SMS for messaging, maintenance, and compliance alerts.

## Delivery Approach
1. **Discovery & Mapping**
   - Validate owner personas, data sources, and compliance requirements.
   - Document end-to-end user journeys for messaging, maintenance, docs, and analytics.
2. **Experience Design**
   - Produce information architecture, dashboard wireframes, and interaction prototypes.
   - Confirm layout of analytics cards and module-level navigation.
3. **Technical Blueprint**
   - Define API contracts, data models, and integration adapters for each module.
   - Plan event tracking schema and reporting pipelines for analytics.
4. **Iterative Build**
   - Sprint 1: Foundation (auth, profile scaffold, notifications, shared components).
   - Sprint 2: Messaging Center + Document Hub MVP.
   - Sprint 3: Maintenance Hub workflows + integrations.
   - Sprint 4: Analytics widgets, drill-downs, and data visualizations.
   - Sprint 5: Polish, role-based permissions, responsive tuning.
5. **Testing & Launch**
   - Module-level QA, integration tests, and owner UAT.
   - Monitoring setup, release checklist, and rollout communication plan.

## Next Steps
- Confirm success metrics (e.g., enquiry response time, maintenance resolution SLA, document compliance rate).
- Prioritize data integrations and identify any gaps in current backend services.
- Align stakeholders on phasing, resource needs, and go-live timeline.
