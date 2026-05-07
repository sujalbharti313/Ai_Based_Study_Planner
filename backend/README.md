# Midnight AI — Backend

Production-grade Node.js + Express + Prisma + PostgreSQL backend for the Midnight AI Study Planner.

## Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js v18+                      |
| Framework   | Express.js                        |
| ORM         | Prisma                            |
| Database    | PostgreSQL                        |
| Auth        | JWT (access + refresh) + bcryptjs |
| Validation  | express-validator                 |
| Security    | helmet, cors, express-rate-limit  |
| Email       | nodemailer                        |
| Uploads     | multer                            |

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env .env.local
# Edit .env — set DATABASE_URL, JWT secrets, SMTP credentials
```

### 3. Set up the database
```bash
# Push schema (dev)
npm run db:push

# Or run migrations (production)
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 4. Start the server
```bash
npm run dev      # development (nodemon)
npm start        # production
```

Server runs at **http://localhost:5000**

---

## API Reference

All protected routes require: `Authorization: Bearer <accessToken>`

### Auth
| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| POST   | /api/auth/register          | Create account        |
| POST   | /api/auth/login             | Login → tokens        |
| POST   | /api/auth/refresh           | Rotate tokens         |
| POST   | /api/auth/logout            | Revoke refresh token  |
| GET    | /api/auth/verify-email      | Verify email          |
| POST   | /api/auth/forgot-password   | Send reset email      |
| POST   | /api/auth/reset-password    | Set new password      |
| GET    | /api/auth/me                | Current user          |

### Dashboard
| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | /api/dashboard     | Aggregated stats + feed  |

### Subjects
| Method | Endpoint                              | Description         |
|--------|---------------------------------------|---------------------|
| GET    | /api/subjects                         | List (filter/sort)  |
| POST   | /api/subjects                         | Create              |
| GET    | /api/subjects/:id                     | Get one             |
| PATCH  | /api/subjects/:id                     | Update              |
| DELETE | /api/subjects/:id                     | Delete              |
| PATCH  | /api/subjects/:id/archive             | Archive             |
| GET    | /api/subjects/:id/modules             | List modules        |
| POST   | /api/subjects/:id/modules             | Add module          |
| PATCH  | /api/subjects/:id/modules/:mid/toggle | Toggle complete     |

### Tasks
| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| GET    | /api/tasks     | List (filter/sort) |
| POST   | /api/tasks     | Create             |
| GET    | /api/tasks/:id | Get one            |
| PATCH  | /api/tasks/:id | Update / complete  |
| DELETE | /api/tasks/:id | Delete             |

### Timetable
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| GET    | /api/timetable?weekStart=   | Get week events      |
| POST   | /api/timetable              | Create event         |
| PATCH  | /api/timetable/:id          | Update event         |
| DELETE | /api/timetable/:id          | Delete event         |
| GET    | /api/timetable/ai-optimize  | AI schedule suggest  |

### Progress
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| GET    | /api/progress          | Overview + streak    |
| POST   | /api/progress/session  | Record study session |

### AI Lab
| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| GET    | /api/ai                       | List conversations   |
| POST   | /api/ai                       | New conversation     |
| GET    | /api/ai/:id                   | Get conversation     |
| DELETE | /api/ai/:id                   | Delete conversation  |
| POST   | /api/ai/:id/messages          | Send message         |

### Notifications
| Method | Endpoint                        | Description     |
|--------|---------------------------------|-----------------|
| GET    | /api/notifications              | List            |
| PATCH  | /api/notifications/read-all     | Mark all read   |
| PATCH  | /api/notifications/:id/read     | Mark one read   |

### User / Settings
| Method | Endpoint                | Description        |
|--------|-------------------------|--------------------|
| GET    | /api/users/me           | Get profile        |
| PATCH  | /api/users/me           | Update profile     |
| POST   | /api/users/me/avatar    | Upload avatar      |
| PATCH  | /api/users/me/password  | Change password    |
| GET    | /api/users/me/settings  | Get settings       |
| PATCH  | /api/users/me/settings  | Update settings    |

---

## Response Envelope

All responses follow this structure:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Valid email required" }]
}
```

---

## Demo Credentials
After seeding:
- **Email:** demo@midnight-ai.app
- **Password:** Demo1234!

---

## Deployment

1. Set `NODE_ENV=production` in environment
2. Use a managed PostgreSQL (Supabase, Railway, Neon, RDS)
3. Set strong JWT secrets (32+ chars)
4. Configure SMTP (SendGrid, Resend, SES)
5. Run `npm run db:migrate` before starting
6. Use PM2 or a container for process management
