const express = require('express');
const path = require('path');
const FileOrganizer = require('./src/fileOrganizer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// API Routes

// Get directory structure
app.post('/api/scan', async (req, res) => {
  try {
    const { directory } = req.body;
    
    if (!directory) {
      return res.status(400).json({ error: 'Directory path is required' });
    }

    const organizer = new FileOrganizer(directory);
    const structure = await organizer.getDirectoryStructure();
    
    res.json({
      success: true,
      directory: directory,
      structure: structure
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Organize directory
app.post('/api/organize', async (req, res) => {
  try {
    const { directory, dryRun = false } = req.body;
    
    if (!directory) {
      return res.status(400).json({ error: 'Directory path is required' });
    }

    const organizer = new FileOrganizer(directory);
    const stats = await organizer.organize(dryRun);
    
    res.json({
      success: true,
      directory: directory,
      dryRun: dryRun,
      stats: stats
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'File Organizer API is running' });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 File Organizer Server running on http://localhost:${PORT}`);
  console.log(`📁 Access the web interface at http://localhost:${PORT}`);
  console.log(`⚡ API endpoints available at http://localhost:${PORT}/api\n`);
});

module.exports = app;
