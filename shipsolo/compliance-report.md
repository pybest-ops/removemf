# Compliance Report Draft

## Project

- Site: Remove Matcha Filter
- Market: US / English by default
- Product type: AI photo recovery tool
- Status: MVP draft, not legal advice

## Data Inventory

| Data type | Purpose | Status |
| --- | --- | --- |
| Uploaded images | Create an AI color correction job and show before / after previews | Required for core service |
| Job metadata | Track status, progress, created time, and result availability | Required for upload/result flow |
| Google login data | Bind paid credits and recent jobs to the signed-in user | Implemented through Auth.js Google login |
| Payment/order data | Support paid credit packs | Planned; checkout is not production-ready |
| Technical logs | Debug failed uploads, failed model calls, and abuse | Expected for operations |

## Third-party Services

| Service | Role | Disclosure requirement |
| --- | --- | --- |
| Replicate or AI provider | Processes uploaded images to generate a more natural result | Disclose AI processing and no exact-original guarantee |
| Cloudflare R2 / storage | Stores uploaded and generated images for access and download | Disclose storage and retention policy |
| Cloudflare Pages / Workers | Hosts the site and API routes | Disclose operational processing where relevant |
| Payment provider | Handles paid credits when enabled | Mark as planned until production payment is configured |

## Risk Assessment

- P0: Do not claim recreating the untouched source file or pixel-level source reconstruction.
- P0: Do not launch with 占位文案 Privacy, Terms, or Refund pages.
- P1: Clarify uploaded images may be processed by third-party AI infrastructure.
- P1: Clarify trial/paid credit rules before charging users.
- P2: Add a domain support email before launch.

## Forbidden / Risky Copy

- "Restore the exact original photo"
- "Source-file reconstruction promise"
- "Perfect color restoration"
- "Unlimited free processing"
- "Official Matcha Filter remover" unless there is a real brand/legal basis

## Legal Page Route Contract

| Route | Required content | Current decision |
| --- | --- | --- |
| `/privacy` | Data collected, image processing, AI/storage providers, retention, user rights, contact | Draft page required before launch |
| `/terms` | Service scope, user responsibilities, credits, AI result limits, prohibited use, disclaimers | Draft page required before launch |
| `/refund` | Paid credit packs, 7-day unused-pack review, non-refundable used credits, failed-job credit return | Draft page required before launch |

## QA Compliance Points

- Search app and docs for `占位文案`, `法律待办标记`, and `即将上线占位` before launch.
- Verify legal footer links resolve to non-占位文案 pages.
- Verify legal pages mention uploaded images, AI processing, storage, credits, refund boundaries, and output limitations.
- Verify marketing copy says "natural result" or "more balanced image", not recreating the untouched source file.

## Current Conclusion

The compliance phase can proceed with MVP draft legal pages, but production launch remains blocked until payment policy, retention window, and support contact are confirmed.
