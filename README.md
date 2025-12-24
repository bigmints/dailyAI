<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10QwtgD3qf5gqRvbs-P_eelTolW8o_bZh

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

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

### Repository Setup Required

1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to `main` to trigger first deployment
