<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b922d27d-4e13-4c69-abd5-5ecdb4b5d4f6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_TAMBO_API_KEY` in [.env](.env) to your Tambo API key.
3. (Optional) Set `GEMINI_API_KEY` if using Gemini features.
4. Run the app:
   `npm run dev`

## Deployment

When deploying to Vercel, ensure you add `VITE_TAMBO_API_KEY` to your Project Settings > Environment Variables.
