const hostname = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (hostname ? `https://${hostname}` : "http://localhost:3000");
