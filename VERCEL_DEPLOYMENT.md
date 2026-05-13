# Vercel Deployment Guide for Ride on Demand

## Files Created ✅

The following files have been created to enable Vercel deployment:

1. **vercel.json** - Main Vercel configuration
2. **api/ssr.js** - Serverless function for handling requests
3. **.vercelignore** - Files to exclude from deployment
4. **.env.production** - Production environment variables
5. **src/environments/environment.production.ts** - Production API configuration

## Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Angular project settings
   - Click "Deploy"

3. **Set Environment Variables** (if needed)
   - In Vercel Dashboard: Settings → Environment Variables
   - Add `API_BASE_URL` pointing to your backend API

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   - Follow prompts to connect account
   - Select project scope
   - Confirm deployment settings

### Option 3: Deploy Manually

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy dist folder**
   - Go to https://vercel.com
   - Drag and drop the `dist/ride-on-demand` folder
   - Or use Vercel CLI: `vercel --prod`

## Important Configuration Notes

### Backend API Connection

Your app currently points to `http://localhost:8081` for the backend API.

**⚠️ BEFORE DEPLOYING TO PRODUCTION**, update `src/environments/environment.production.ts` with your actual backend API URL:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-api-domain.com'  // Update this!
};
```

### Environment Variables in Vercel

After deployment, you can set environment variables in Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add variables like:
   - `API_BASE_URL=https://your-api-domain.com`
   - `JWT_SECRET=your-secret` (if needed)

## What Gets Deployed

- ✅ Angular frontend (built with SSR)
- ✅ Server-side rendering enabled
- ✅ All static assets (images, styles)
- ✅ API integration layer

## After Deployment

1. **Your live URL**: `https://your-project-name.vercel.app`
2. **Custom Domain**: Add in Vercel Dashboard → Domains
3. **Auto-deployments**: Push to GitHub and Vercel redeploys automatically
4. **Analytics**: Monitor in Vercel Dashboard

## Verify Build Works Locally

The build has already been tested and succeeded! ✅

Browser bundle: 324.52 kB (88.45 kB gzipped)
Server bundle: Ready for SSR

## Troubleshooting

- **Build fails**: Check Node version is v20.x or v18.x (not odd versions like v25)
- **API errors**: Verify backend URL in environment.production.ts
- **CORS errors**: Configure CORS on backend to allow Vercel domain
- **Database connection**: Ensure backend can reach production database

## Next Steps

1. Update the API URL in `environment.production.ts`
2. Connect to GitHub and push this code
3. Deploy via Vercel Dashboard
4. Test your app at the provided URL
5. Add custom domain if needed

