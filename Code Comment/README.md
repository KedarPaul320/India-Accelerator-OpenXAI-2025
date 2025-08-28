# Code Comment

AI-powered code commenting assistant built with Next.js. Paste code, get clear explanations and inline comments via an API route.

## Prerequisites
- Node.js 18+
- npm, pnpm, or yarn

## Quick Start
```bash
# From repo root
cd "Code Comment/nextjs-app"

# Install dependencies
npm install

# Run dev server
npm run dev
# App will be available at http://localhost:3000
```

## Project Structure
```
Code Comment/
  nextjs-app/
    app/
      api/
        code-comment/
          route.ts    # API endpoint for generating code comments
      layout.tsx      # Root layout
      page.tsx        # UI entry
    tailwind.config.js
    package.json
```

## API
- Endpoint: POST `/api/code-comment`
- Body: `{ code: string, language?: string }`
- Response: `{ comments: string }` (shape may vary based on implementation)

See `nextjs-app/app/api/code-comment/route.ts` for exact contract and model configuration.

## Scripts
- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm start`: Run production server
- `npm run lint`: Lint

## Configuration
- Tailwind is pre-configured. Edit `app/globals.css` and component styles as needed.
- Update model/provider settings inside the API route to point to your LLM (local or hosted).

## Deployment
Deploy to any Next.js-compatible host (Vercel, Netlify, Docker, etc.). Ensure required env vars for your LLM/provider are configured.

## License
See the repository root `LICENSE` file.
