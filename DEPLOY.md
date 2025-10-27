# Deploying HardWord Hex to Vercel

This guide walks you through deploying HardWord Hex to Vercel in a few minutes.

---

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally (for testing)

---

## Step 1: Push to Git

If you haven't already, initialize a Git repository and push your code:

```powershell
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - HardWord Hex game"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/hardword-hex.git

# Push
git push -u origin main
```

> **Note:** If your default branch is `master` instead of `main`, use `master` in the commands above.

---

## Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** → **"Project"**.
3. Select your Git provider (GitHub, GitLab, or Bitbucket).
4. Authorize Vercel to access your repositories.
5. Find and select the `hardword-hex` repository.

---

## Step 3: Configure Build Settings

Vercel will auto-detect Next.js settings. Verify these defaults:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` or `next build`
- **Output Directory:** (leave blank; Next.js auto-detects)
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

> These should be pre-filled automatically. If not, set them manually.

---

## Step 4: Environment Variables (Optional)

The app currently has no required environment variables. If you add any in the future (API keys, DB URLs), add them here:

1. In the Vercel project settings, go to **Settings** → **Environment Variables**.
2. Add key-value pairs as needed.
3. Redeploy for changes to take effect.

---

## Step 5: Deploy

1. Click **"Deploy"**.
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run `npm run build`
   - Deploy the optimized build

This typically takes 1-2 minutes.

---

## Step 6: Access Your Live Site

Once deployment completes, Vercel provides:

- **Production URL:** `https://hardword-hex.vercel.app` (or similar)
- **Preview URLs:** For every branch/PR you push, Vercel creates a preview deployment.

Your game is now live! 🎉

---

## Optional: Custom Domain

To use your own domain (e.g., `hardwordhex.com`):

1. Go to **Settings** → **Domains** in your Vercel project.
2. Add your custom domain.
3. Follow Vercel's DNS instructions to point your domain to Vercel's servers.

---

## Continuous Deployment

Every time you push to `main` (or your production branch):

- Vercel automatically rebuilds and redeploys.
- Preview deployments are created for other branches and PRs.

---

## Troubleshooting

### Build fails

- Check the Vercel build logs for errors.
- Ensure your local `npm run build` succeeds before pushing.
- Verify Node.js version (Vercel uses Node 18+ by default).

### Site doesn't load

- Check the **Functions** tab in Vercel for runtime errors.
- Ensure no client-side code is trying to access `localStorage` or `window` during SSR (wrap with `typeof window !== 'undefined'` checks).

### Need help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)

---

## Local Testing (Production Mode)

To test the production build locally before deploying:

```powershell
# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to test.

---

## Summary

1. Push code to Git
2. Import project on Vercel
3. Click Deploy
4. Done! Your game is live.

Enjoy your deployed word puzzle game! 🚀
