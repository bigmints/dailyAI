

## Data Structure

The app uses JSON-based daily posts stored in the `_data/` folder:
- Each file follows the format: `_data/YYYY-MM-DD.json`
- Data is loaded asynchronously on app startup
- Currently includes 7 daily editions (Dec 24-18, 2024)

### Adding New Posts

1. Create a new JSON file in `_data/` with today's date
2. Update `services/dataService.ts` to include the new date
3. Commit and push - GitHub Actions will automatically build and deploy

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions and JSON schema.

## Deployment

This site is deployed to **GitHub Pages** using GitHub Actions:
- Every push to `main` triggers an automatic build
- Workflow: `.github/workflows/deploy.yml`
- Live site updates within 2-3 minutes
- Configured for: https://bigmints.github.io/dailyAI/

### First-Time Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Set Source to "GitHub Actions"

2. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Monitor**: Check the Actions tab for deployment status

4. **Access**: Visit https://bigmints.github.io/dailyAI/ once deployed

## 🤖 Automated Content Updates

This repository is configured to receive content updates from the CMS via GitHub Actions.

### Setup Instructions

1.  **Generate a Personal Access Token (PAT)**:
    - Go to GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (Classic).
    - Generate new token with `repo` scope.
    - **Important**: Go to your Repository Settings > Secrets > Actions. Add a new secret named `PAT` with this token value. This is required for the automation to trigger a deployment.

2.  **Configure CMS Webhook**:
    - **URL**: `https://api.github.com/repos/[YOUR_USENAME]/[REPO_NAME]/dispatches`
    - **Method**: `POST`
    - **Headers**:
        - `Accept`: `application/vnd.github.v3+json`
        - `Authorization`: `Bearer YOUR_GITHUB_PAT`
    - **Body (JSON)**:
        ```json
        {
          "event_type": "publish_content",
          "client_payload": {
            "success": true,
            "data": [ ... ]
          }
        }
        ```

### How it works
1.  CMS sends `repository_dispatch` event.
2.  GitHub Action `content-update.yml` triggers.
3.  It runs `scripts/process-payload.js` which:
    - Parses the JSON.
    - Saves new editions to `public/_data/`.
    - Updates `public/_data/index.json`.
4.  The action commits and pushes the changes, triggering a fresh deployment.
