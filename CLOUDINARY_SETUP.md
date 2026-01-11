# Cloudinary Video Hosting Setup Guide

## Why Cloudinary?

Cloudinary provides:
- **Faster loading**: CDN delivery worldwide
- **Automatic optimization**: Format conversion, quality optimization
- **Bandwidth savings**: Adaptive streaming
- **Better performance**: Reduced server load
- **Free tier**: 25GB storage, 25GB bandwidth/month

## Step 1: Create Cloudinary Account

1. **Sign up for free**
   - Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
   - Create an account (free tier is sufficient to start)

2. **Get your credentials**
   - After signup, go to [Dashboard](https://console.cloudinary.com/)
   - You'll see your credentials:
     - **Cloud Name**
     - **API Key**
     - **API Secret**

## Step 2: Configure Environment Variables

1. **Update `.env.local`**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   ```

2. **Important**: Never commit `.env.local` to git!

## Step 3: Upload Videos to Cloudinary

Run the upload script:

```bash
node upload_to_cloudinary.js
```

This will:
- Find all `.mp4` files in the `public` folder
- Upload them to Cloudinary
- Create a mapping file (`cloudinary_mapping.json`)
- Show progress and results

**Expected output:**
```
🚀 Starting Cloudinary video upload...
🔍 Finding all MP4 files...
Found 22 video files

📹 Uploading: video1.mp4
   ✅ Uploaded successfully
   URL: https://res.cloudinary.com/...

...

✨ Upload complete!
📊 Summary:
   Total files: 22
   Uploaded: 22
   Failed: 0
```

## Step 4: Update Products with Cloudinary URLs

Run the update script:

```bash
node update_products_cloudinary.js
```

This will:
- Read the mapping file
- Update `products.json` with Cloudinary URLs
- Replace local paths with CDN URLs

## Step 5: Deploy to Vercel

Add Cloudinary credentials to Vercel:

1. Go to your Vercel project
2. Settings > Environment Variables
3. Add:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Benefits After Setup

### Before (Local Videos):
- ❌ Slow initial load
- ❌ High bandwidth usage
- ❌ No optimization
- ❌ Server load

### After (Cloudinary):
- ✅ Fast CDN delivery
- ✅ Automatic optimization
- ✅ Adaptive quality
- ✅ Global distribution
- ✅ Free tier: 25GB storage + 25GB bandwidth/month

## Video Optimization Features

Cloudinary automatically:
- Converts to optimal format (WebM, MP4)
- Adjusts quality based on connection
- Generates thumbnails
- Enables lazy loading
- Provides analytics

## Cloudinary Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Videos**: Unlimited

**Your current usage:**
- 22 videos × ~12MB average = ~264MB storage
- Well within free tier! 🎉

## Troubleshooting

### Upload fails with "Invalid credentials"
- Check your `.env.local` file
- Verify credentials in Cloudinary dashboard
- Ensure no extra spaces in values

### "Rate limit exceeded"
- Free tier has rate limits
- Script includes 1-second delay between uploads
- If needed, increase delay in `upload_to_cloudinary.js`

### Videos not loading on site
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Verify URLs in `products.json` are correct
- Check browser console for errors

## Optional: Video Transformations

You can add transformations to Cloudinary URLs for:
- Different quality levels
- Thumbnail generation
- Watermarks
- Cropping/resizing

Example:
```
https://res.cloudinary.com/your-cloud/video/upload/q_auto,f_auto/video.mp4
```

## Monitoring Usage

Check your usage at:
[https://console.cloudinary.com/console/usage](https://console.cloudinary.com/console/usage)

---

**Ready to start?** Follow Step 1 above to create your Cloudinary account!
