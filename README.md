# 📁 File Organizer - Full-Stack Web Application

A complete web development project using Node.js that automatically organizes files in your directory by categorizing them into subdirectories based on file type.

## 🎯 Problem Statement

**The Problem:** Managing cluttered directories (like Downloads, Desktop, or Documents) is a common challenge. Files accumulate over time with no organization, making it difficult to:
- Find specific files quickly
- Understand what files are present
- Clean up and maintain directories
- Keep a systematic file structure

**The Solution:** This application provides both a **command-line interface (CLI)** and a **web-based interface** to automatically organize files by moving them into category-based subdirectories (e.g., `images/`, `documents/`, `videos/`, etc.), making directory management effortless and efficient.

## ✨ Features

- **🌐 Web Interface**: Beautiful, responsive web UI for organizing files through a browser
- **💻 CLI Tool**: Command-line utility for quick file organization
- **📊 Directory Scanning**: Preview files before organizing
- **🔍 Dry Run Mode**: Preview changes without actually moving files
- **📁 Automatic Categorization**: Files organized into:
  - Images (jpg, png, gif, svg, etc.)
  - Documents (pdf, doc, txt, etc.)
  - Videos (mp4, avi, mov, etc.)
  - Audio (mp3, wav, flac, etc.)
  - Archives (zip, rar, 7z, etc.)
  - Code files (js, ts, py, html, etc.)
  - Executables (exe, dmg, pkg, etc.)
  - And more...
- **🛡️ Error Handling**: Robust error handling with detailed error messages
- **📈 Statistics**: View organization results with detailed statistics

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Steps

1. **Clone or download this project**

2. **Navigate to the project directory:**
   ```bash
   cd Internship_Project
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## 📖 How to Run

### Option 1: Web Interface (Recommended)

1. **Start the server:**
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

3. **Use the web interface:**
   - Enter a directory path (e.g., `./Downloads`, `~/Documents`, or absolute path)
   - Click "Scan Directory" to preview files
   - Use "Preview (Dry Run)" to see what would be organized
   - Click "Organize Files" to actually organize the directory

### Option 2: Command-Line Interface

1. **Run the CLI tool:**
   ```bash
   npm run cli
   ```
   or
   ```bash
   node cli.js <directory-path>
   ```

2. **CLI Examples:**
   ```bash
   # Organize Downloads folder
   node cli.js ./Downloads

   # Preview changes without organizing (dry run)
   node cli.js ./Downloads --dry-run

   # Organize with explicit directory flag
   node cli.js --directory ~/Documents

   # Show help
   node cli.js --help
   ```

3. **CLI Options:**
   - `-h, --help` - Show help message
   - `-d, --dry-run` - Preview changes without moving files
   - `--directory, -dir <path>` - Specify directory to organize

## 🎬 Demo & Screenshots

### Web Interface Screenshots

#### Home Screen
The web interface provides an intuitive way to scan and organize directories.

#### Directory Scanning
Preview all files in a directory with their categories and sizes before organizing.

#### Organization Results
View detailed statistics including files moved, folders created, and organized file list.

### CLI Usage Example

```bash
$ node cli.js ./test-folder --dry-run

============================================================
📁 File Organizer CLI
============================================================
Directory: /Users/harsh/Downloads/Internship_Project/test-folder
Mode: DRY RUN (Preview only)
============================================================

📊 Scanning directory...

Found 5 file(s) and 0 folder(s)

Files to organize:
------------------------------------------------------------
  📄 image.jpg                              [images] 245.5 KB
  📄 document.pdf                           [documents] 1.2 MB
  📄 video.mp4                              [videos] 15.8 MB
  📄 song.mp3                               [audio] 3.4 MB
  📄 archive.zip                            [archives] 500 KB
------------------------------------------------------------

🔍 Previewing organization...

============================================================
📊 Organization Results
============================================================
⚠️  DRY RUN MODE - No files were actually moved

📋 Organized files:
------------------------------------------------------------
  → image.jpg                               → images/image.jpg
  → document.pdf                            → documents/document.pdf
  → video.mp4                               → videos/video.mp4
  → song.mp3                                → audio/song.mp3
  → archive.zip                             → archives/archive.zip
============================================================

💡 Run without --dry-run to actually organize the files
```

### YouTube Demo Link

📹 **Video Demonstration:** [Link to your YouTube video (3-5 minutes)]

The video demonstrates:
- Problem statement and real-world use case
- Web interface usage
- CLI tool usage
- Design decisions and architecture
- Key features and capabilities

## 🏗️ Design Decisions

### Architecture

**1. Separation of Concerns:**
   - **Core Logic** (`src/fileOrganizer.js`): Pure business logic for file organization, reusable across CLI and web interface
   - **Backend API** (`server.js`): Express server providing RESTful endpoints
   - **Frontend** (`public/`): Client-side HTML/CSS/JavaScript for web interface
   - **CLI** (`cli.js`): Command-line interface using the same core logic

**2. Modular Design:**
   - FileOrganizer class encapsulates all file organization logic
   - Single responsibility principle: each module has a clear purpose
   - Easy to extend with new file categories or features

### Technology Choices

**Backend:**
- **Node.js**: JavaScript runtime for both server and CLI
- **Express.js**: Lightweight web framework for REST API
- **fs.promises**: Native Node.js file system module (async/await based)

**Frontend:**
- **Vanilla JavaScript**: No framework dependencies for simplicity
- **Modern CSS**: Responsive design with Flexbox/Grid
- **Fetch API**: Modern HTTP client for API communication

**Why these choices?**
- Uses standard libraries and minimal external dependencies
- Fast and lightweight
- Easy to understand and maintain
- Works across different operating systems

### File Organization Strategy

**1. Category-Based Organization:**
   - Files grouped by type (images, documents, videos, etc.)
   - Intuitive folder structure
   - Easy to locate files later

**2. Conflict Resolution:**
   - Checks if destination file exists
   - Automatically renames with counter (e.g., `file_1.jpg`) if conflict
   - Prevents data loss

**3. Safety Features:**
   - Dry run mode for previewing changes
   - Error handling for each file operation
   - Detailed statistics and reporting
   - Skips files already in category folders

### Error Handling

**1. Input Validation:**
   - Directory path validation
   - File permission checks
   - Graceful handling of inaccessible files

**2. Operation Safety:**
   - Individual file error tracking (one failure doesn't stop the process)
   - Detailed error messages
   - Rollback consideration (future enhancement)

**3. User Feedback:**
   - Clear error messages in both CLI and web interface
   - Loading indicators during operations
   - Success/failure statistics

### API Design

**RESTful Endpoints:**
- `POST /api/scan` - Scan directory structure
- `POST /api/organize` - Organize files in directory
- `GET /api/health` - Health check endpoint

**Request/Response Format:**
- JSON-based communication
- Consistent error response format
- Clear success/failure indicators

## 📁 Project Structure

```
Internship_Project/
├── src/
│   └── fileOrganizer.js    # Core file organization logic
├── public/
│   ├── index.html          # Web interface HTML
│   ├── style.css           # Web interface styles
│   └── script.js           # Web interface JavaScript
├── server.js               # Express backend server
├── cli.js                  # Command-line interface
├── package.json            # Project dependencies
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## 🔧 Configuration

The server runs on port **3000** by default. To change the port, set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## ⚠️ Important Notes

1. **Backup Important Files**: Always backup important files before organizing, especially when using for the first time.

2. **Directory Permissions**: Ensure you have read/write permissions for the directory you want to organize.

3. **Dry Run First**: Use dry run mode (`--dry-run` or Preview button) to preview changes before actually organizing.

4. **Path Format**: 
   - Use `./` for relative paths (e.g., `./Downloads`)
   - Use `~/` for home directory (e.g., `~/Documents`)
   - Use absolute paths for specific locations (e.g., `/Users/name/Desktop`)

## 🧪 Testing

To test the application:

1. **Create a test directory:**
   ```bash
   mkdir test-folder
   cd test-folder
   # Add some test files of different types
   ```

2. **Run in dry-run mode first:**
   ```bash
   node cli.js ./test-folder --dry-run
   ```

3. **Verify the preview, then organize:**
   ```bash
   node cli.js ./test-folder
   ```

## 🚧 Future Enhancements

Potential improvements for future versions:
- Undo/rollback functionality
- Custom organization rules
- Scheduled automatic organization
- File deduplication
- Cloud storage integration
- Advanced filtering options

## 📄 License

MIT License - Feel free to use and modify for your needs.

## 👤 Author

Developed as part of an internship project to demonstrate:
- Full-stack development skills
- Clean coding practices
- Error handling and validation
- Problem-solving approach
- Software design principles

---

**Note**: This project uses only standard libraries (Node.js built-ins + Express for the web framework) as per assignment requirements. The solution reflects personal understanding and implementation of file organization automation.
