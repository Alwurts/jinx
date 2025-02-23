# Jinxify - AI-Powered HR Automation

## Prerequisites

- Node.js v20+
- PostgreSQL database
- GitHub/Google OAuth credentials (for authentication)
- OpenAI API key

## 🚀 Getting Started

1. **Clone the repository** (already done if following root README)
2. **Install dependencies**:

    ```bash
    npm i
    ```

3. **Environment Setup**:

    Create a `.env` file in the root directory with the environment variables from the `.env.example` file.

4. **Database Setup**:

    ```bash
    npm run db:migrate
    ```

5. **Start the development server**:

    ```bash
    npm run dev
    ```

## 📦 Building for Production

1. Build the application:

    ```bash
    npm run build
    ```

2. Start the production server:

    ```bash
    npm run start
    ```

❗**Important**: Ensure database migrations have been run in production environment.

### Environment Variables Reference

| Variable              | Required | Description                          |
|-----------------------|----------|--------------------------------------|
| `DATABASE_URL`        | Yes      | PostgreSQL connection string         |
| `AUTH_SECRET`         | Yes      | Random secret for authentication    |
| `AUTH_GITHUB_ID`      | No       | GitHub OAuth Client ID               |
| `AUTH_GITHUB_SECRET`  | No       | GitHub OAuth Client Secret           |
| `AUTH_GOOGLE_ID`      | No       | Google OAuth Client ID               |
| `AUTH_GOOGLE_SECRET`  | No       | Google OAuth Client Secret           |
| `OPENAI_API_KEY`      | Yes      | OpenAI API key for AI features       |

## 📂 Project Structure

Key files/folders:

```bash
jinxify/
├── src/
│ ├── app/ # Next.js app router
│ ├── components/ # UI components
│ ├── server/ # Database config
│ └── lib/ # Utilities
├── drizzle.config.ts # Database migrations (lines 6-13)
└── tailwind.config.ts # Styling config
```

## 🌐 Deployment

### Vercel Deployment

1. Import your repository to Vercel
2. Set root directory to `jinxify`
3. Add all required environment variables from `.env.example`
4. Execute database migrations
5. Deploy!

Vercel will automatically:

- Detect Next.js framework
- Run build commands

### 🐳 Docker Deployment

1. Build and start containers:

    ```bash
    docker-compose up --build
    ```

2. After first run, execute database migrations:

    ```bash
    docker-compose exec app npm run db:migrate
    ```

3. Access the application at <http://localhost:3000>
