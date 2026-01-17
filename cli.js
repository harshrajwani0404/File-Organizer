#!/usr/bin/env node

const FileOrganizer = require('./src/fileOrganizer');
const path = require('path');
const fs = require('fs').promises;

// Get command line arguments
const args = process.argv.slice(2);

// Parse arguments
function parseArgs() {
  const options = {
    directory: null,
    dryRun: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
    } else if (arg === '--directory' || arg === '-dir') {
      options.directory = args[++i];
    } else if (!arg.startsWith('-') && !options.directory) {
      options.directory = arg;
    }
  }

  return options;
}

// Display help message
function showHelp() {
  console.log(`
📁 File Organizer CLI - Organize your files automatically

Usage:
  node cli.js [directory] [options]
  npm run cli [directory] [options]

Options:
  -h, --help              Show this help message
  -d, --dry-run           Preview changes without actually moving files
  --directory, -dir <path> Specify directory to organize

Examples:
  node cli.js ./Downloads
  node cli.js ./Downloads --dry-run
  node cli.js --directory ~/Documents
  node cli.js ./test-folder -d

Description:
  Organizes files in the specified directory by moving them into
  subdirectories based on file type (images, documents, videos, etc.).
  `);
}

// Format file size
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleString();
}

// Main CLI function
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (!options.directory) {
    console.error('❌ Error: Directory path is required');
    console.log('\nUse --help for usage information\n');
    process.exit(1);
  }

  // Resolve directory path
  let directory = path.resolve(options.directory);

  try {
    // Verify directory exists
    const stats = await fs.stat(directory);
    if (!stats.isDirectory()) {
      throw new Error('Path is not a directory');
    }
  } catch (error) {
    console.error(`❌ Error: Directory "${directory}" does not exist or is not accessible`);
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📁 File Organizer CLI');
  console.log('='.repeat(60));
  console.log(`Directory: ${directory}`);
  console.log(`Mode: ${options.dryRun ? 'DRY RUN (Preview only)' : 'ORGANIZE'}`);
  console.log('='.repeat(60) + '\n');

  try {
    // Show current structure
    console.log('📊 Scanning directory...\n');
    const organizer = new FileOrganizer(directory);
    const structure = await organizer.getDirectoryStructure();

    console.log(`Found ${structure.files.length} file(s) and ${structure.folders.length} folder(s)\n`);

    if (structure.files.length > 0) {
      console.log('Files to organize:');
      console.log('-'.repeat(60));
      structure.files.forEach(file => {
        console.log(`  📄 ${file.name.padEnd(40)} [${file.category}] ${formatBytes(file.size)}`);
      });
      console.log('-'.repeat(60) + '\n');
    }

    // Organize files
    console.log(options.dryRun ? '🔍 Previewing organization...' : '🔄 Organizing files...');
    const stats = await organizer.organize(options.dryRun);

    // Display results
    console.log('\n' + '='.repeat(60));
    console.log('📊 Organization Results');
    console.log('='.repeat(60));
    
    if (options.dryRun) {
      console.log('⚠️  DRY RUN MODE - No files were actually moved\n');
    } else {
      console.log(`✅ Files moved: ${stats.filesMoved}`);
      console.log(`📂 Folders created: ${stats.foldersCreated}`);
    }

    if (stats.errors.length > 0) {
      console.log(`❌ Errors: ${stats.errors.length}`);
      stats.errors.forEach(err => {
        console.log(`   - ${err.file}: ${err.error}`);
      });
    }

    if (stats.organizedFiles.length > 0) {
      console.log('\n📋 Organized files:');
      console.log('-'.repeat(60));
      stats.organizedFiles.forEach(file => {
        const arrow = options.dryRun ? '→' : '✅';
        console.log(`  ${arrow} ${file.original.padEnd(35)} → ${file.destination}`);
      });
    }

    console.log('='.repeat(60) + '\n');

    if (!options.dryRun && stats.filesMoved > 0) {
      console.log('✨ Organization complete!\n');
    } else if (options.dryRun) {
      console.log('💡 Run without --dry-run to actually organize the files\n');
    } else {
      console.log('ℹ️  No files needed organization\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n');
    process.exit(1);
  }
}

// Run CLI
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { main, parseArgs, showHelp };
