# CritiSize

A Vite + React demo app for CritiSize, your website design critic.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root with:
   ```env
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## Notes

- The app uses the Claude API (`https://api.anthropic.com/v1/messages`).
- Add your Anthropiс API key in `.env` to make the evaluation features work.
- The current project is a plain React + Vite app, ready to open in VS Code.
