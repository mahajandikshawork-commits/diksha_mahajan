# Website Performance - Root Cause Analysis (RCA)

## 🔴 Problem Statement
The website is experiencing significant lag and poor performance, affecting user experience.

---

## 🔍 Root Cause Analysis

### **PRIMARY ISSUES IDENTIFIED**

### 1. **CRITICAL: Excessive Video Loading (Highest Impact)**

**Location:** Multiple components
- `HeroSectionDesktop.tsx` - 3 videos with `preload="auto"`
- `HeroSectionMobile.tsx` - 3 videos with `preload="auto"`
- `ProductSlider.tsx` - 21 product videos (all products)
- `ProductCard.tsx` - Videos with `preload="auto"` and `autoplay`

**Impact:** 
- **27+ videos loading simultaneously** on homepage
- Each video is likely 5-50MB in size
- Total initial load: **150-500MB+ of video data**
- Blocks page rendering and interactivity

**Why This Happens:**
```typescript
// HeroSectionDesktop.tsx - Line 95
preload="auto"  // Downloads entire video immediately

// ProductSlider.tsx - Lines 38-39
showVideo={true}
autoplay={true}  // All 21 product videos try to autoplay

// ProductCard.tsx - Line 61
preload="auto"  // Every product card preloads full video
```

**Severity:** 🔴 CRITICAL - This is the #1 performance killer

---

### 2. **CRITICAL: Loading Screen Duration Issue**

**Location:** `LoadingScreen.tsx` - Line 14

**Problem:**
```typescript
const duration = 5000; // 5 seconds (comment says 3 seconds)
```

**Impact:**
- Loading screen shows for 5 seconds
- During this time, ALL videos start downloading in background
- User sees loading screen while browser struggles with 500MB+ downloads
- Creates perception of slow website

**Severity:** 🔴 CRITICAL - Masks the real problem

---

### 3. **HIGH: No Lazy Loading Strategy**

**Location:** All video and image components

**Problem:**
- All videos load immediately, even those off-screen
- No intersection observer for lazy loading
- ProductSlider loads all 21 products at once
- Collection page loads all products simultaneously

**Impact:**
- Wasted bandwidth on content user may never see
- Slower initial page load
- Poor mobile performance (limited bandwidth)

**Severity:** 🟠 HIGH

---

### 4. **HIGH: Image Optimization Issues**

**Location:** Multiple components

**Problems:**
- Images using `priority` flag unnecessarily (ProductCard.tsx - Line 72)
- No WebP format usage
- Large uncompressed images
- All images in ProductSlider marked as priority

**Impact:**
- Larger file sizes than necessary
- Slower image loading
- Higher bandwidth usage

**Severity:** 🟠 HIGH

---

### 5. **MEDIUM: Client-Side Rendering Overhead**

**Location:** All pages are client-side rendered ('use client')

**Problems:**
- `page.tsx` - Client-side
- `collection/page.tsx` - Client-side
- `product/[slug]/page.tsx` - Client-side
- All components client-side

**Impact:**
- No server-side rendering benefits
- Larger JavaScript bundle
- Slower Time to Interactive (TTI)
- Poor SEO (though we added metadata)

**Severity:** 🟡 MEDIUM

---

### 6. **MEDIUM: Multiple Re-renders**

**Location:** `ClientLayout.tsx`, `LoadingScreen.tsx`

**Problem:**
- Loading screen state management causes re-renders
- All page content rendered but hidden with opacity
- Double rendering (once hidden, once visible)

**Impact:**
- Unnecessary computation
- Delayed interactivity
- Memory overhead

**Severity:** 🟡 MEDIUM

---

## 📊 Performance Metrics (Estimated)

### Current State:
- **Initial Load Time:** 8-15 seconds (on good connection)
- **Time to Interactive:** 10-20 seconds
- **Total Page Weight:** 200-600MB
- **Lighthouse Score:** Likely 10-30/100
- **Core Web Vitals:** All failing

### Expected After Fixes:
- **Initial Load Time:** 1-3 seconds
- **Time to Interactive:** 2-4 seconds
- **Total Page Weight:** 2-5MB initial
- **Lighthouse Score:** 80-95/100
- **Core Web Vitals:** All passing

---

## 🛠️ SOLUTIONS (Priority Order)

### **IMMEDIATE FIXES (Do These First)**

#### 1. Fix Video Preloading Strategy

**Change from:**
```typescript
preload="auto"  // Downloads entire video
```

**Change to:**
```typescript
preload="metadata"  // Only downloads video metadata (< 1KB)
```

**Files to Update:**
- `app/components/HeroSectionDesktop.tsx` - Line 95
- `app/components/HeroSectionMobile.tsx` - Line 124
- `app/components/ProductCard.tsx` - Line 61

**Impact:** Reduces initial load from 500MB to ~5MB

---

#### 2. Disable Autoplay in ProductSlider

**Change from:**
```typescript
// ProductSlider.tsx - Lines 38-39
showVideo={true}
autoplay={true}
```

**Change to:**
```typescript
showVideo={false}  // Show images instead
autoplay={false}
```

**Impact:** Prevents 21 videos from loading on homepage

---

#### 3. Fix Loading Screen Duration

**Change from:**
```typescript
const duration = 5000; // 5 seconds
```

**Change to:**
```typescript
const duration = 1500; // 1.5 seconds
```

**Impact:** Faster perceived load time

---

### **HIGH PRIORITY FIXES**

#### 4. Implement Lazy Loading for Videos

Add Intersection Observer to only load videos when they're about to be visible:

```typescript
// Example implementation
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { rootMargin: '100px' } // Load 100px before visible
  );

  if (cardRef.current) {
    observer.observe(cardRef.current);
  }

  return () => observer.disconnect();
}, []);

// Only render video if visible
{isVisible && <video ... />}
```

**Files to Update:**
- `app/components/ProductCard.tsx`
- `app/components/ProductSlider.tsx`

---

#### 5. Optimize Images

- Convert images to WebP format
- Use Next.js Image optimization
- Remove unnecessary `priority` flags
- Add proper `loading="lazy"` attributes

---

#### 6. Implement Virtual Scrolling for ProductSlider

Instead of rendering all 21 products, only render visible ones:

```typescript
// Use react-window or similar library
import { FixedSizeList } from 'react-window';
```

---

### **MEDIUM PRIORITY FIXES**

#### 7. Enable Server-Side Rendering

Convert static pages to server components:
- Remove 'use client' from pages that don't need it
- Keep 'use client' only for interactive components

---

#### 8. Code Splitting

- Lazy load heavy components
- Split product data into chunks
- Use dynamic imports for modals and overlays

---

#### 9. Optimize Loading Strategy

Remove or simplify LoadingScreen:
- Either remove it entirely
- Or reduce to 0.5 seconds
- Don't hide content behind it

---

## 📈 Implementation Plan

### Phase 1: Emergency Fixes (1-2 hours)
1. ✅ Change all `preload="auto"` to `preload="metadata"`
2. ✅ Disable autoplay in ProductSlider
3. ✅ Fix loading screen duration
4. ✅ Remove `priority` from non-critical images

**Expected Result:** 70-80% performance improvement

### Phase 2: Optimization (4-6 hours)
1. ✅ Implement lazy loading for videos
2. ✅ Optimize images to WebP
3. ✅ Add virtual scrolling to ProductSlider
4. ✅ Implement intersection observers

**Expected Result:** 90% performance improvement

### Phase 3: Architecture (8-12 hours)
1. ✅ Convert pages to server components where possible
2. ✅ Implement code splitting
3. ✅ Add service worker for caching
4. ✅ Optimize bundle size

**Expected Result:** 95%+ performance improvement

---

## 🎯 Quick Wins (Do These Now!)

### 1. Update HeroSectionDesktop.tsx
```typescript
// Line 95: Change from
preload="auto"
// To
preload="metadata"
```

### 2. Update HeroSectionMobile.tsx
```typescript
// Line 124: Change from
preload="auto"
// To
preload="metadata"
```

### 3. Update ProductSlider.tsx
```typescript
// Lines 38-39: Change from
showVideo={true}
autoplay={true}
// To
showVideo={false}
autoplay={false}
```

### 4. Update ProductCard.tsx
```typescript
// Line 61: Change from
preload="auto"
// To
preload="metadata"

// Line 72: Change from
priority
// To
loading="lazy"
```

### 5. Update LoadingScreen.tsx
```typescript
// Line 14: Change from
const duration = 5000;
// To
const duration = 1500;
```

---

## 🧪 Testing After Fixes

1. **Open Chrome DevTools**
   - Network tab → Disable cache
   - Throttle to "Fast 3G"
   - Reload page

2. **Check Metrics:**
   - Total page weight should be < 10MB
   - Load time should be < 5 seconds
   - Videos should NOT download until hovered

3. **Lighthouse Audit:**
   - Run in incognito mode
   - Check Performance score (should be 80+)
   - Check all Core Web Vitals

---

## 📝 Summary

**Root Cause:** Aggressive video preloading strategy causing 500MB+ downloads on page load

**Primary Culprits:**
1. 27+ videos with `preload="auto"` (500MB+)
2. All product videos autoplaying simultaneously
3. No lazy loading implementation
4. 5-second loading screen masking the problem

**Solution:** Change preload strategy, disable autoplay, implement lazy loading

**Expected Improvement:** 70-95% faster load times

---

## ⚠️ Critical Notes

1. **Never use `preload="auto"` for multiple videos**
   - Use `preload="metadata"` or `preload="none"`
   - Only preload videos that will definitely play

2. **Autoplay should be rare**
   - Only for hero sections
   - Never for product grids
   - Always with user interaction

3. **Lazy load everything off-screen**
   - Videos
   - Images
   - Heavy components

4. **Test on slow connections**
   - Most users don't have fiber
   - Mobile data is limited
   - International users have slower speeds

---

**Next Steps:** Implement Phase 1 fixes immediately for 70-80% improvement.
