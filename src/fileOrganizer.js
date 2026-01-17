const fs = require('fs').promises;
const path = require('path');

/**
 * Core file organization logic
 * Organizes files in a directory by moving them into subdirectories based on file type
 */
class FileOrganizer {
  constructor(directory) {
    this.directory = directory;
    this.stats = {
      filesMoved: 0,
      foldersCreated: 0,
      errors: [],
      organizedFiles: []
    };
  }

  /**
   * Get file extension and determine category
   */
  getFileCategory(fileName) {
    const ext = path.extname(fileName).toLowerCase().slice(1);
    
    const categories = {
      images: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
      documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'],
      videos: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
      audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
      archives: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
      code: ['js', 'ts', 'html', 'css', 'py', 'java', 'cpp', 'c', 'json', 'xml', 'yaml', 'yml','m','mlx'],
      executables: ['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'app'],
      spreadsheets: ['csv', 'xls', 'xlsx', 'ods'],
      presentations: ['ppt', 'pptx', 'odp'],
      fonts: ['ttf', 'otf', 'woff', 'woff2']
    };

    for (const [category, extensions] of Object.entries(categories)) {
      if (extensions.includes(ext)) {
        return category;
      }
    }

    return 'others';
  }

  /**
   * Organize files in the directory
   */
  async organize(dryRun = false) {
    try {
      // Verify directory exists
      await fs.access(this.directory);
      
      const entries = await fs.readdir(this.directory, { withFileTypes: true });
      const files = entries.filter(entry => entry.isFile());

      for (const file of files) {
        try {
          const filePath = path.join(this.directory, file.name);
          const category = this.getFileCategory(file.name);
          const categoryFolder = path.join(this.directory, category);

          // Skip if already in a category folder
          if (this.directory.split(path.sep).pop() === category) {
            continue;
          }

          if (!dryRun) {
            // Create category folder if it doesn't exist
            try {
              await fs.access(categoryFolder);
            } catch {
              await fs.mkdir(categoryFolder, { recursive: true });
              this.stats.foldersCreated++;
            }

            // Check if file with same name exists in destination
            const destPath = path.join(categoryFolder, file.name);
            let finalDestPath = destPath;
            let counter = 1;

            while (true) {
              try {
                await fs.access(finalDestPath);
                // File exists, create unique name
                const ext = path.extname(file.name);
                const nameWithoutExt = path.basename(file.name, ext);
                finalDestPath = path.join(categoryFolder, `${nameWithoutExt}_${counter}${ext}`);
                counter++;
              } catch {
                break;
              }
            }

            // Move file
            await fs.rename(filePath, finalDestPath);
            this.stats.filesMoved++;
            this.stats.organizedFiles.push({
              original: file.name,
              category: category,
              destination: path.relative(this.directory, finalDestPath)
            });
          } else {
            // Dry run - just record what would be done
            this.stats.organizedFiles.push({
              original: file.name,
              category: category,
              destination: `${category}/${file.name}`
            });
          }
        } catch (error) {
          this.stats.errors.push({
            file: file.name,
            error: error.message
          });
        }
      }

      return this.stats;
    } catch (error) {
      throw new Error(`Failed to organize directory: ${error.message}`);
    }
  }

  /**
   * Get directory structure
   */
  async getDirectoryStructure() {
    try {
      await fs.access(this.directory);
      
      const entries = await fs.readdir(this.directory, { withFileTypes: true });
      const structure = {
        files: [],
        folders: []
      };

      for (const entry of entries) {
        const entryPath = path.join(this.directory, entry.name);
        const stats = await fs.stat(entryPath);
        
        if (entry.isFile()) {
          structure.files.push({
            name: entry.name,
            size: stats.size,
            modified: stats.mtime,
            category: this.getFileCategory(entry.name)
          });
        } else if (entry.isDirectory()) {
          const subEntries = await fs.readdir(entryPath);
          structure.folders.push({
            name: entry.name,
            itemCount: subEntries.length
          });
        }
      }

      return structure;
    } catch (error) {
      throw new Error(`Failed to read directory: ${error.message}`);
    }
  }
}

module.exports = FileOrganizer;
