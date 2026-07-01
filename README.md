# AI-Solutions Web Application
### CET333 Product Development — University of Sunderland
### Student: Suraj Kumar Sah | BSc (Hons) Computer Systems Engineering

---

## Project Overview

AI-Solutions is a full-stack web application developed for a fictitious technology start-up company based in Sunderland, UK. The company leverages artificial intelligence to assist various industries with software solutions, with a primary focus on improving the digital employee experience.

The application consists of a public-facing multi-page website and a password-protected admin content management system, built using Node.js, Express.js, EJS templating, and a PostgreSQL database.

---

## Features

### Public Website
- Home page with hero section, services, statistics, testimonials and CTA
- Solutions page detailing all three core AI services
- Events and gallery page — fully database-driven with real images
- Articles page — featured article and article grid, database-driven
- Customer feedback page with interactive star rating system
- Contact Us form capturing seven mandatory fields — no account required
- AI-powered virtual assistant chatbot on the contact page
- Fully responsive design across desktop, tablet and mobile
- Custom 404 page

### Admin Panel
- Secure login with bcrypt password hashing and session authentication
- Dashboard with stats — total, new, read inquiries and feedback count
- Full CRUD for customer inquiries — view, edit, delete, live search
- Full CRUD for articles — add, edit, delete, mark as featured
- Gallery management — add via URL, delete
- Full CRUD for events — add, edit, delete, mark as featured
- Feedback management — view with star ratings, delete

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Templating | EJS (Embedded JavaScript) |
| Database | PostgreSQL |
| Authentication | bcrypt + express-session |
| Flash messages | connect-flash |
| Environment | dotenv |
| Icons | Font Awesome 6 |
| Dev tool | Nodemon |

---

## Project Structure
ai-solutions/
├── server.js                  # Main entry point
├── package.json               # Dependencies
├── .env                       # Environment variables (not committed)
├── setup.sql                  # Database setup and seed data
├── config/
│   └── db.js                  # PostgreSQL connection pool
├── routes/
│   ├── publicRoutes.js        # Public page routes
│   ├── contactRoutes.js       # Contact form routes
│   └── adminRoutes.js         # Admin panel routes
├── controllers/
│   ├── publicController.js    # Public page logic
│   ├── contactController.js   # Contact form logic
│   └── adminController.js     # Admin panel logic
├── middleware/
│   └── auth.js                # Session authentication middleware
├── views/
│   ├── index.ejs              # Home page
│   ├── solutions.ejs          # Solutions page
│   ├── events.ejs             # Events and gallery page
│   ├── articles.ejs           # Articles page
│   ├── feedback.ejs           # Feedback page
│   ├── contact.ejs            # Contact Us page
│   ├── 404.ejs                # 404 page
│   ├── partials/
│   │   ├── header.ejs         # Navbar and head
│   │   ├── footer.ejs         # Footer
│   │   ├── flash.ejs          # Flash messages
│   │   └── admin-sidebar.ejs  # Admin sidebar
│   └── admin/
│       ├── login.ejs          # Admin login page
│       ├── dashboard.ejs      # Admin dashboard
│       ├── inquiry.ejs        # Inquiry detail page
│       ├── edit.ejs           # Edit inquiry page
│       ├── articles.ejs       # Articles management
│       ├── article-form.ejs   # Add/edit article form
│       ├── gallery.ejs        # Gallery management
│       ├── events.ejs         # Events management
│       ├── event-form.ejs     # Add/edit event form
│       └── feedback-list.ejs  # Feedback management
├── public/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       └── main.js            # Client-side JS and chatbot
└── scripts/
└── createAdmin.js         # One-time admin account setup script

---
## Database Schema

Six tables in PostgreSQL:

| Table | Purpose |
|---|---|
| admins | Admin login credentials |
| inquiries | Customer Contact Us form submissions |
| feedback | Customer feedback with star ratings |
| articles | Company articles and blog posts |
| gallery | Gallery image URLs and captions |
| events | Upcoming company events |

---

## Installation and Setup

### Prerequisites
- Node.js v18 or above
- PostgreSQL v14 or above
- npm v9 or above

### Step 1 — Clone or extract the project
```bash
cd ai-solutions
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Configure environment variables
Open the `.env` file and update with your PostgreSQL credentials:
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=ai_solutions
DB_PORT=5432
SESSION_SECRET=your_secret_key

### Step 4 — Set up the database
Open pgAdmin or psql and run:
```sql
CREATE DATABASE ai_solutions;
```
Then connect to the database and run all SQL from `setup.sql`.
This creates all six tables and inserts seed data for articles, gallery images and events.

### Step 5 — Create admin account
```bash
node scripts/createAdmin.js
```
Default credentials:
Username: admin
Password: Admin@123

### Step 6 — Start the server
```bash
npm run dev
```

You should see:
✅ AI-Solutions running at http://localhost:3000
✅ Connected to PostgreSQL database

---

## Usage

| URL | Description |
|---|---|
| http://localhost:3000 | Public home page |
| http://localhost:3000/solutions | Solutions page |
| http://localhost:3000/events | Events and gallery |
| http://localhost:3000/articles | Articles page |
| http://localhost:3000/feedback | Feedback page |
| http://localhost:3000/contact | Contact Us page |
| http://localhost:3000/admin/login | Admin login |
| http://localhost:3000/admin/dashboard | Admin dashboard |

---

## Admin Panel URLs

| URL | Description |
|---|---|
| /admin/dashboard | Dashboard with inquiry stats and table |
| /admin/articles | Articles management |
| /admin/gallery | Gallery management |
| /admin/events | Events management |
| /admin/feedback-list | Feedback management |
| /admin/logout | Logout and destroy session |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (auto-restart) |
| `npm start` | Start server with node |
| `node scripts/createAdmin.js` | Create or reset admin account |

---

## Dependencies

```json
{
  "bcrypt": "^5.1.1",
  "connect-flash": "^0.1.1",
  "dotenv": "^16.4.5",
  "ejs": "^3.1.10",
  "express": "^4.19.2",
  "express-session": "^1.18.0",
  "pg": "^8.11.5"
}
```

---

## Security

- Admin passwords hashed with bcrypt (salt rounds: 10)
- Session-based authentication protects all admin routes
- Parameterised SQL queries prevent SQL injection
- Server-side validation on all form submissions
- Environment variables used for all sensitive configuration

---

## Module Information

| Field | Detail |
|---|---|
| Module | CET333 Product Development |
| Assessor | Dr Barnali Das |
| Institution | University of Sunderland / ISMT College |
| Submission | 10 July 2026 |

---

## License

This project was developed for academic purposes as part of the CET333 Product Development module at the University of Sunderland. All third-party packages are open-source and used under their respective licences (MIT, Apache 2.0, PostgreSQL Licence).
