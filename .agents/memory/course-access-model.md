---
name: Course access model
description: The course's durable no-authentication access requirement.
---

The course must remain fully public. Do not add login, account creation, auth gates, session requirements, sign-in/sign-out controls, or login-based administrative access.

**Why:** The user explicitly removed all login after authentication repeatedly blocked access in development and deployment.

**How to apply:** New course pages and API features must work without an authenticated identity. Keep the existing client-side Admin Mode separate from user accounts; it is a convenience switch, not authentication.