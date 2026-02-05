# GitHub Authentication Setup

To push your code to GitHub, you need to authenticate. Here are the options:

## Option 1: Personal Access Token (Recommended)

Since GitHub has deprecated password authentication for Git operations, you'll need to create a Personal Access Token:

### Step 1: Create a Personal Access Token
1. Go to GitHub.com and log in to your account
2. Click on your profile picture in the top right → "Settings"
3. In the left sidebar, click "Developer settings"
4. Click "Personal access tokens" → "Tokens (classic)" or "Fine-grained tokens"
5. Click "Generate new token" (for classic) or "Create a fine-grained personal access token"
6. For classic tokens:
   - Give it a descriptive name (e.g., "Git Access")
   - Set expiration as needed
   - Under "Select scopes", check "repo" (for full access to repositories)
   - Click "Generate token"
7. Copy the generated token (you won't see it again!)

### Step 2: Use the Token to Push
When pushing to GitHub, use your username and the personal access token:
```bash
cd /Users/joe/.openclaw/workspace/work-progress-monitor
git push -u origin main
```

When prompted for username, enter: `joejoegobot`
When prompted for password, enter: [paste your personal access token]

### Step 3: Store Credentials (Optional)
To avoid entering credentials every time:
```bash
git config --global credential.helper store
```

## Option 2: SSH Keys (More Secure Long-Term)

### Step 1: Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "joejoego23@gmail.com"
```
Press Enter to accept the default file location, and optionally set a passphrase.

### Step 2: Start SSH Agent
```bash
eval "$(ssh-agent -s)"
```

### Step 3: Add Your SSH Key
```bash
ssh-add ~/.ssh/id_ed25519
```

### Step 4: Copy Your Public Key
```bash
cat ~/.ssh/id_ed25519.pub
```

### Step 5: Add SSH Key to GitHub
1. Go to GitHub.com → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste your public key from the previous step
4. Give it a descriptive title (e.g., "MacBook Pro")

### Step 6: Change Remote URL to SSH
```bash
git remote set-url origin git@github.com:joejoegobot/work-progress-monitor.git
```

### Step 7: Test SSH Connection
```bash
ssh -T git@github.com
```

## Recommendation
I recommend Option 1 (Personal Access Token) for a quick setup, and Option 2 (SSH Keys) for long-term use.

## After Authentication
Once authenticated, run:
```bash
cd /Users/joe/.openclaw/workspace/work-progress-monitor
git push -u origin main
```

Your code will then be uploaded to GitHub and ready for deployment to Render.