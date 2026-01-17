# How to Upload This Project to GitHub

Follow these steps to upload your File Organizer project to GitHub:

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `file-organizer` (or any name you prefer)
   - **Description**: "Full-stack file organization utility with CLI and web interface"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have one)
5. Click **"Create repository"**
6. **Copy the repository URL** that GitHub shows (e.g., `https://github.com/yourusername/file-organizer.git`)

## Step 2: Initialize Git in Your Project (if not already done)

Run these commands in your terminal:

```bash
cd /Users/harsh/Downloads/Internship_Project
git init
```

## Step 3: Add All Files to Git

```bash
git add .
```

This adds all your project files to Git.

## Step 4: Create Your First Commit

```bash
git commit -m "Initial commit: File Organizer full-stack application"
```

## Step 5: Connect to GitHub and Push

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# Add the remote repository (use the URL from Step 1)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename the branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

If GitHub asks for authentication:
- Use a **Personal Access Token** (not your password)
- To create one: GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
- Select scopes: `repo` (full control of private repositories)

## Alternative: Using GitHub CLI (gh)

If you have GitHub CLI installed:

```bash
gh repo create file-organizer --public --source=. --remote=origin --push
```

## Quick Command Summary

Here's all the commands in one block (replace the repository URL):

```bash
cd /Users/harsh/Downloads/Internship_Project
git init
git add .
git commit -m "Initial commit: File Organizer full-stack application"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Troubleshooting

### If you get "repository already exists" error:
Remove the existing remote and add the correct one:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you need to update after making changes:
```bash
git add .
git commit -m "Your commit message"
git push
```

### If authentication fails:
- Make sure you're using a Personal Access Token, not your password
- Or use SSH: `git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git`

## Next Steps

After uploading:
1. Verify your files are on GitHub
2. Update README.md with your YouTube video link when ready
3. Add a description in the GitHub repository settings
4. Consider adding topics/tags in repository settings (e.g., `nodejs`, `express`, `file-organizer`)
