# 🚀 Deployment Guide - LUXE Ecommerce

## Overview

This guide covers deploying your LUXE luxury ecommerce platform to production.

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Supabase database tables created
- [ ] EmailJS configuration complete
- [ ] No console errors or warnings
- [ ] Responsive design tested
- [ ] All languages working
- [ ] Dark mode tested

## Build for Production

```bash
npm run build
```

This creates an optimized `dist` folder ready for deployment.

### What Gets Built
- Minified JavaScript bundles
- Optimized CSS files
- Compressed images
- Static assets
- Service worker (optional)

---

## Deployment Options

### 1. Vercel (Recommended - Easiest)

#### Setup
```bash
npm install -g vercel
vercel login
```

#### Deploy
```bash
cd c:\Repos\react\luxury-ecommerce
vercel
```

#### Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_KEY=your_key
VITE_EMAILJS_PUBLIC_KEY=your_key
```

#### Domain Setup
1. Go to Vercel Dashboard
2. Settings → Domains
3. Add custom domain
4. Update DNS records
5. SSL certificate auto-configured

---

### 2. Netlify

#### Setup
1. Commit to GitHub: https://github.com/yourusername/luxury-ecommerce

#### Deploy
1. Go to Netlify.com
2. Click "New site from Git"
3. Connect GitHub
4. Select repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Environment Variables
Netlify Dashboard → Site Settings → Build & Deploy → Environment
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_KEY=your_key
VITE_EMAILJS_PUBLIC_KEY=your_key
```

#### Domain
1. Netlify DNS → Add domain
2. Or connect existing domain
3. Auto HTTPS enabled

---

### 3. AWS Amplify

#### Setup
```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### Deploy
```bash
amplify init
amplify add hosting
amplify publish
```

---

### 4. Firebase Hosting

#### Setup
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

#### Deploy
```bash
npm run build
firebase deploy
```

---

### 5. GitHub Pages

#### Configuration in `vite.config.ts`
```typescript
export default defineConfig({
  base: '/luxury-ecommerce/',
  // ... rest of config
})
```

#### Deploy
```bash
npm run build
# Commit dist folder or use GitHub Actions
git add dist
git commit -m "build: production build"
git push
```

---

## Production Checklist

### Performance
- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Lazy loading configured
- [ ] Cache headers set
- [ ] Compression enabled
- [ ] CDN configured

### Security
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Secure headers set
- [ ] No hardcoded secrets
- [ ] API key rotation policy

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics configured
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

## Environment Variables for Production

### Required
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

### Optional
```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id

# Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id

# Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn

# Environment
VITE_APP_ENV=production
```

---

## Post-Deployment

### 1. Verify Deployment
```bash
# Test homepage
curl https://yourdomain.com

# Test API endpoints
curl https://yourdomain.com/api/products
```

### 2. Test All Features
- [ ] HomePage loads
- [ ] Shop products display
- [ ] Filters work
- [ ] Cart functions
- [ ] Language switching
- [ ] Dark mode
- [ ] Login/signup
- [ ] Contact form

### 3. Monitor Performance
- Google Lighthouse audit
- Core Web Vitals
- Load time monitoring
- Error tracking

### 4. Setup Monitoring
```bash
# Install Sentry for error tracking
npm install @sentry/react @sentry/tracing
```

---

## Scaling Considerations

### As Traffic Grows

#### Database
- Enable Supabase auto-scaling
- Set up read replicas
- Implement caching strategy
- Monitor query performance

#### CDN
- Use CDN for static assets
- Enable image optimization
- Set cache expiration
- Monitor bandwidth usage

#### API
- Rate limiting
- Request queuing
- Load balancing
- Auto-scaling

#### Monitoring
- Set up alerts
- Error rate tracking
- Performance metrics
- User analytics

---

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Security patches: `npm audit fix`
- Monitor logs
- Check error rates
- Review analytics

### Backups
- Database backups (Supabase handles)
- Code backups (GitHub)
- Configuration backups

### Updates
```bash
# Update all packages
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Troubleshooting Deployment

### Site Not Loading
1. Check build logs
2. Verify environment variables
3. Check browser console
4. Test locally first

### API Calls Failing
1. Verify Supabase URL correct
2. Check API key valid
3. Verify CORS settings
4. Test with curl/Postman

### Images Not Loading
1. Check image URLs
2. Verify CDN path
3. Check file permissions
4. Inspect network tab

### Slow Performance
1. Run Lighthouse audit
2. Check image sizes
3. Enable gzip compression
4. Review code bundles

---

## SSL/TLS Certificate

### Automatic (Recommended)
- Vercel: Automatic
- Netlify: Automatic
- AWS: Request in ACM

### Manual
```bash
# Using Let's Encrypt
certbot certonly --webroot
```

---

## Custom Domain

### Domain Provider Setup
1. Go to domain registrar
2. Find DNS settings
3. Add records:
   - **Type A**: Point to hosting provider
   - **CNAME**: For subdomains
   - **MX**: For email (if needed)

### Hosting Provider Setup
1. Add custom domain in dashboard
2. Update name servers
3. Verify ownership
4. Wait for DNS propagation (24-48 hours)

---

## Continuous Deployment (CD)

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Analytics & Monitoring

### Google Analytics
```typescript
// Add to main.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Sentry (Error Tracking)
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| White screen | Check console for errors |
| API fails | Verify Supabase credentials |
| Slow load | Check image sizes, bundle size |
| CORS errors | Add domain to Supabase CORS |
| Images missing | Check CDN/image paths |
| Styles broken | Clear cache, verify CSS loading |

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Deployment](https://supabase.com/docs/guides/hosting)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Backup & Recovery

### Before Deploying
```bash
# Create local backup
git tag v1.0.0-production
git push origin v1.0.0-production
```

### Emergency Rollback
```bash
vercel rollback
# or redeploy previous commit
```

---

## Final Deployment Checklist

- [ ] Code tested locally
- [ ] Build successful (`npm run build`)
- [ ] Environment variables set
- [ ] Database configured
- [ ] Deployment platform chosen
- [ ] Custom domain ready
- [ ] SSL certificate verified
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Database backups enabled
- [ ] Monitoring alerts set
- [ ] Team access configured
- [ ] Staging environment tested
- [ ] Production environment ready

---

**Ready to Deploy?** Choose your platform and follow the steps above!

Happy deployment! 🚀
