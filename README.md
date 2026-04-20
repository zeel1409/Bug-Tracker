# BugTracker — Issue & Bug Tracking App (MERN Stack)

A Jira-inspired bug/issue tracker built with MongoDB, Express, React, and Node.js.

## Features

- **User Authentication** – Register/Login with JWT
- **Project Management** – Create projects, add teammates by email
- **Ticket System** – Create bugs, features, tasks with priority levels
- **Kanban Board** – Drag & drop tickets between To Do / In Progress / Done
- **Filter & Search** – Filter by status, priority; search by keyword
- **Comments** – Threaded comments on each ticket
- **Role-based** – Only reporters can delete their own tickets

## Tech Stack

| Layer    | Technology                        |
|----------|------------------------------------|
| Frontend | React 19, Tailwind CSS, @hello-pangea/dnd |
| Backend  | Node.js, Express.js               |
| Database | MongoDB + Mongoose                |
| Auth     | JWT + bcryptjs                    |
| Hosting  | Render (backend), Vercel (frontend) |

## Project Structure

```
web-project/
├── server/              # Express API
│   ├── models/          # Mongoose schemas (User, Project, Ticket, Comment)
│   ├── routes/          # REST API routes
│   ├── middleware/       # JWT auth middleware
│   └── index.js         # Server entry
└── client/              # React frontend
    └── src/
        ├── context/     # AuthContext, ProjectContext
        ├── pages/       # Login, Register, Dashboard, Board, Tickets
        ├── components/  # Sidebar, KanbanBoard, Modals
        └── utils/       # API helper, badge helpers
```

## Setup & Run

### Backend
```bash
cd server
# Edit .env with your MongoDB Atlas URI
npm install
npm run dev       # runs on port 5000
```

### Frontend
```bash
cd client
npm install
npm run dev       # runs on port 5173
```

### Environment Variables (server/.env)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/bugtracker
JWT_SECRET=your_secret_key
```

## API Endpoints

| Method | Route                    | Description                |
|--------|--------------------------|----------------------------|
| POST   | /api/auth/register       | Register user              |
| POST   | /api/auth/login          | Login, returns JWT         |
| GET    | /api/projects            | List user's projects       |
| POST   | /api/projects            | Create project             |
| POST   | /api/projects/:id/members| Add member by email        |
| GET    | /api/tickets?projectId=  | List tickets with filters  |
| POST   | /api/tickets             | Create ticket              |
| PUT    | /api/tickets/:id         | Update/move ticket         |
| DELETE | /api/tickets/:id         | Delete ticket              |
| GET    | /api/comments?ticketId=  | Get ticket comments        |
| POST   | /api/comments            | Add comment                |

## Deployment

- **Backend → Render**: Deploy `server/` folder, set env vars in Render dashboard
- **Frontend → Vercel**: Deploy `client/` folder, set `VITE_API_URL` if needed
- **MongoDB → Atlas**: Free tier cluster, whitelist `0.0.0.0/0` in network access




