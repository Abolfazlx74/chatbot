# AI-powered Chatbot (Local)

A modern, customizable AI-chatbot you can run locally in your browser. this project features a clean UI, dark mode, avatar customization, and more.

---

## Features

- **Chat with AI**: Chat with AI powered by your chosen model
- **Dark mode**: Toggle between light and dark themes
- **Custom avatars**: Upload your own user and bot avatars
- **Settings panel**: General settings, customizations, and about info
- **Responsive design**: Works on desktop and mobile

---

## Getting Started

### 1. Clone the repository

```bash
git clone "https://github.com/Abolfazlx74/chatbot.git"
cd chatbot-master
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Add your own API key(you can get one for free from https://openrouter.ai/)

Create a file called `.env` in the `server` directory with this content:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 4. Start the backend server

```bash
npm start
```

The server will run on [http://localhost:3001](http://localhost:3001)

### 5. Open the app

open : [http://localhost:3001](http://localhost:3001)

---

## Usage

- Type your message and press Enter or click on Send button.
- Use the kebab menu (three dots) for settings, uploading avatars, or starting a new chat.
- Change between light and dark mode with the header button.

---

## Folder Structure

```
chatbot-presentation-master/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── ... (default images and uploads)
│   └── js/
│       └── index.js
├── index.html
└── server/
    ├── server.js
    ├── package.json
    └── .env (you create this)
```
