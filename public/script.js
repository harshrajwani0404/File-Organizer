// API base URL
const API_BASE = '/api';

// DOM elements
const directoryInput = document.getElementById('directoryInput');
const scanBtn = document.getElementById('scanBtn');
const organizeBtn = document.getElementById('organizeBtn');
const dryRunBtn = document.getElementById('dryRunBtn');
const resultsCard = document.getElementById('results');
const actionCard = document.getElementById('actionCard');
const statsCard = document.getElementById('statsCard');
const fileList = document.getElementById('fileList');
const statsContent = document.getElementById('statsContent');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Current directory being worked on
let currentDirectory = null;

// Initialize event listeners
scanBtn.addEventListener('click', handleScan);
organizeBtn.addEventListener('click', () => handleOrganize(false));
dryRunBtn.addEventListener('click', () => handleOrganize(true));
directoryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleScan();
    }
});

// Set default directory (current working directory)
directoryInput.value = './Downloads' || './';

/**
 * Handle directory scan
 */
async function handleScan() {
    const directory = directoryInput.value.trim();
    
    if (!directory) {
        showError('Please enter a directory path');
        return;
    }

    currentDirectory = directory;
    hideError();
    showLoading();

    try {
        const response = await fetch(`${API_BASE}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ directory })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to scan directory');
        }

        displayDirectoryStructure(data.structure);
        actionCard.classList.remove('hidden');
        statsCard.classList.add('hidden');

    } catch (error) {
        showError(`Error scanning directory: ${error.message}`);
        resultsCard.classList.add('hidden');
        actionCard.classList.add('hidden');
    } finally {
        hideLoading();
    }
}

/**
 * Handle file organization
 */
async function handleOrganize(dryRun) {
    if (!currentDirectory) {
        showError('Please scan a directory first');
        return;
    }

    hideError();
    showLoading();
    statsCard.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE}/organize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                directory: currentDirectory,
                dryRun: dryRun
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to organize files');
        }

        displayStats(data.stats, dryRun);

        // Rescan directory to show updated structure
        if (!dryRun) {
            setTimeout(() => {
                handleScan();
            }, 1000);
        }

    } catch (error) {
        showError(`Error organizing files: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Display directory structure
 */
function displayDirectoryStructure(structure) {
    fileList.innerHTML = '';

    if (structure.files.length === 0) {
        fileList.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">No files found in this directory</p>';
        resultsCard.classList.remove('hidden');
        return;
    }

    structure.files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;

        const meta = document.createElement('div');
        meta.className = 'file-meta';

        const category = document.createElement('span');
        category.className = `badge badge-${file.category}`;
        category.textContent = file.category.toUpperCase();

        const size = document.createElement('span');
        size.textContent = formatBytes(file.size);

        meta.appendChild(category);
        meta.appendChild(size);
        fileItem.appendChild(fileName);
        fileItem.appendChild(meta);
        fileList.appendChild(fileItem);
    });

    resultsCard.classList.remove('hidden');
}

/**
 * Display organization statistics
 */
function displayStats(stats, dryRun) {
    statsContent.innerHTML = '';

    if (dryRun) {
        const warning = document.createElement('div');
        warning.style.cssText = 'background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;';
        warning.innerHTML = '<strong>⚠️ DRY RUN MODE</strong> - No files were actually moved. This is a preview of what would happen.';
        statsContent.appendChild(warning);
    }

    // Stats grid
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';

    if (!dryRun) {
        const filesMoved = document.createElement('div');
        filesMoved.className = 'stat-card';
        filesMoved.innerHTML = `
            <div class="stat-value">${stats.filesMoved}</div>
            <div class="stat-label">Files Moved</div>
        `;
        statsGrid.appendChild(filesMoved);

        const foldersCreated = document.createElement('div');
        foldersCreated.className = 'stat-card';
        foldersCreated.innerHTML = `
            <div class="stat-value">${stats.foldersCreated}</div>
            <div class="stat-label">Folders Created</div>
        `;
        statsGrid.appendChild(foldersCreated);
    }

    if (stats.errors.length > 0) {
        const errors = document.createElement('div');
        errors.className = 'stat-card';
        errors.style.background = 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)';
        errors.innerHTML = `
            <div class="stat-value">${stats.errors.length}</div>
            <div class="stat-label">Errors</div>
        `;
        statsGrid.appendChild(errors);
    }

    statsContent.appendChild(statsGrid);

    // Organized files list
    if (stats.organizedFiles.length > 0) {
        const heading = document.createElement('h3');
        heading.textContent = 'Organized Files:';
        heading.style.cssText = 'margin: 20px 0 10px 0; color: #2d3748;';
        statsContent.appendChild(heading);

        stats.organizedFiles.forEach(file => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'organized-file';
            fileDiv.innerHTML = `
                <strong>${file.original}</strong> → 
                <span style="color: #48bb78;">${file.destination}</span>
                <span class="badge badge-${file.category}" style="margin-left: 10px;">${file.category}</span>
            `;
            statsContent.appendChild(fileDiv);
        });
    }

    // Errors list
    if (stats.errors.length > 0) {
        const errorsHeading = document.createElement('h3');
        errorsHeading.textContent = 'Errors:';
        errorsHeading.style.cssText = 'margin: 20px 0 10px 0; color: #e53e3e;';
        statsContent.appendChild(errorsHeading);

        stats.errors.forEach(error => {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'background: #fed7d7; padding: 10px; border-radius: 4px; margin: 5px 0; border-left: 4px solid #e53e3e;';
            errorDiv.innerHTML = `<strong>${error.file}:</strong> ${error.error}`;
            statsContent.appendChild(errorDiv);
        });
    }

    statsCard.classList.remove('hidden');
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Show loading indicator
 */
function showLoading() {
    loading.classList.remove('hidden');
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    loading.classList.add('hidden');
}

/**
 * Show error message
 */
function showError(message) {
    errorDiv.textContent = `❌ ${message}`;
    errorDiv.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    errorDiv.classList.add('hidden');
}

// Check API health on load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        console.log('API Status:', data.status);
    } catch (error) {
        console.error('API connection error:', error);
    }
});
