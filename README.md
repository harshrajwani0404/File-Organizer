📁 File Organizer (CLI + Web App)

A full-stack Node.js project that helps you organize messy folders (Downloads/Desktop/Documents) by automatically sorting files into category-based subfolders like images, documents, videos, audio, archives, code, etc.

🔗 Live Demo: https://fileorganizerproject.vercel.app/

🎥 YouTube Demo: https://youtu.be/-qPcQDyhXXI

📌 GitHub Repo: https://github.com/harshrajwani0404/File-Organizer

✨ Features

🌐 Web UI to scan and organize folders easily

💻 CLI tool for fast organization from terminal

🔍 Directory scan preview

🧪 Dry-run mode (preview changes without moving files)

📂 Auto categorization (images, documents, videos, audio, archives, code, etc.)

📊 Shows summary/statistics after organizing

🛡️ Handles errors safely (skips failed files, avoids overwriting)

🖥️ Web App Usage
Run locally
npm install
npm start


Open in browser:

http://localhost:3000

💻 CLI Usage
node cli.js <directory-path>

Examples
# Organize a folder
node cli.js ./Downloads

# Preview only (no changes)
node cli.js ./Downloads --dry-run

📁 Project Structure
Internship_Project/
├── src/                  # core logic
├── public/               # frontend (HTML/CSS/JS)
├── server.js             # backend server
├── cli.js                # CLI tool
├── package.json
└── README.md

🚀 Deployment

Deployed using Vercel
Live Link: https://fileorganizerproject.vercel.app/

🎬 Demo Video

YouTube: https://youtu.be/-qPcQDyhXXI

👤 Author

Harsh Rajwani
GitHub: https://github.com/harshrajwani0404
