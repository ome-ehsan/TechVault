# TechVault

## What is it?

TechVault is a **web application** built with modern JavaScript technologies. It's a starter project that combines a **frontend** (what users see and interact with) and a **backend** (the server that processes data).

Think of it as a template to build web apps quickly—you get the basic structure and tools already set up.

## What does it do?

Right now, TechVault is a **blank canvas**. It doesn't have specific features yet, but it's ready for you to build on. It comes with:
- A **React-based interface** (frontend) that runs in your browser
- An **Express.js server** (backend) that can handle requests and serve data
- All the tools and configuration needed to start developing immediately

---

## Project Structure

```
TechVault/
├── client/           # React frontend (Vite)
│   ├── src/         # React components and logic
│   ├── public/      # Static assets
│   ├── index.html   # Entry HTML
│   ├── package.json # Client dependencies
│   └── vite.config.js
├── server/          # Express.js backend
│   ├── app.js       # Server entry point
│   ├── package.json # Server dependencies
│   └── .env         # Environment variables
└── package.json     # Root config (if applicable)
```

## Tech Stack

**Frontend:**
- React 19.0.0
- Vite 6.2.0 (build tool)
- ESLint 9.21.0 (linting)

**Backend:**
- Express.js 4.21.2
- Node.js (ES modules)
- dotenv 16.4.7 (environment config)
- Nodemon 3.1.9 (dev auto-reload)

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Client Setup
```bash
cd client
npm install
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run lint     # Run ESLint
```

### Server Setup
```bash
cd server
npm install
npm run dev      # Start with auto-reload (nodemon)
```

Configure environment variables in `server/.env` as needed.

## Scripts

**Client:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

**Server:**
- `npm run dev` - Start server with nodemon (auto-reload on file changes)

## Current Status

- Basic project scaffold with client/server separation
- Frontend framework configured with React and Vite
- Backend starter with Express and nodemon for development
- No production features implemented yet

## Development

The project uses ES modules (`"type": "module"`) in both client and server packages. Ensure your imports and exports follow ES6+ module syntax.

## License

ISC
