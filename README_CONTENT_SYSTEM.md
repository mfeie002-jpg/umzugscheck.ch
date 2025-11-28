# Content Management System - Technical Documentation

## Overview

This project has been transformed into a content-driven system where all user-facing content is stored in JSON files and can be edited via an admin interface without touching code.

## Architecture

### Content Layer

All content is stored in `/src/content/` directory:

```
/src/content/
├── types.ts              # TypeScript type definitions
├── homepage.json         # Homepage content
├── services.json         # Services/offerings
├── regions.json          # Swiss regions and cities
├── faq.json             # FAQ items
├── costExamples.json    # Cost example cards
├── whyUs.json           # USP/benefit cards
└── seo.json             # SEO meta tags
```

### Content Utilities

`/src/lib/content.ts` provides helper functions to load content:

```typescript
import { getHomepageContent, getServices, getFAQs } from "@/lib/content";

// In your component
const content = getHomepageContent();
const services = getServices();
const faqs = getFAQs();
```

### Component Updates

Components have been updated to use the content layer:

**Before:**
```tsx
<h1>Der schnellste Weg zu Ihrem perfekten Umzug</h1>
```

**After:**
```tsx
const content = getHomepageContent().hero;
<h1>{content.headline} <span>{content.highlightedText}</span></h1>
```

## Admin Interface

### Access

URL: `http://localhost:5173/admin` (or `https://yourdomain.ch/admin` in production)

Default password: Set via `VITE_ADMIN_PASSWORD` environment variable

### Features

- **Authentication:** Simple password-based auth (sessionStorage)
- **Content Editing:** Forms for all content areas
- **Real-time Preview:** View changes on the live site
- **Save/Load:** Read/write JSON files

### Security

⚠️ **Important:** The current authentication is basic and suitable for:
- Single admin user
- Development/testing
- Internal tools

For production use, implement:
- Server-side authentication
- Database-backed content storage
- Role-based access control
- Audit logging

## Adding New Content

### 1. Define Type

```typescript
// src/content/types.ts
export interface NewContentType {
  id: string;
  title: string;
  description: string;
  // ...
}
```

### 2. Create JSON File

```json
// src/content/newContent.json
[
  {
    "id": "item1",
    "title": "First Item",
    "description": "Description here"
  }
]
```

### 3. Add Utility Function

```typescript
// src/lib/content.ts
import newContentData from "@/content/newContent.json";

export const getNewContent = (): NewContentType[] => {
  return newContentData as NewContentType[];
};
```

### 4. Create Admin Form

Add a new tab in `/src/pages/Admin.tsx` with appropriate forms.

### 5. Update Components

```tsx
import { getNewContent } from "@/lib/content";

const MyComponent = () => {
  const items = getNewContent();
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
```

## Image Handling

### Current Implementation

Images are referenced via:
- **External URLs:** `https://images.unsplash.com/photo-xxx`
- **Public folder:** `/images/my-image.jpg`

### Recommended Setup (for production)

1. **Cloudinary Integration:**
```typescript
// Add to .env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

// In admin panel
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url;
};
```

2. **Supabase Storage:**
```typescript
import { supabase } from "@/integrations/supabase/client";

const uploadToSupabase = async (file) => {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(`public/${file.name}`, file);
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(data.path);
    
  return publicUrl;
};
```

## SEO Implementation

### Structure

```json
{
  "global": {
    "siteName": "umzugscheck.ch",
    "defaultTitleSuffix": " | umzugscheck.ch",
    "defaultDescription": "...",
    "defaultImage": "/og-image.jpg"
  },
  "pages": {
    "home": {
      "title": "Umzugsfirmen vergleichen",
      "description": "...",
      "canonicalPath": "/",
      "schemaType": "WebSite"
    }
  }
}
```

### Usage

```tsx
import { Helmet } from "react-helmet";
import { getPageSEO } from "@/lib/content";

const MyPage = () => {
  const seo = getPageSEO('home');
  
  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={`https://umzugscheck.ch${seo.canonicalPath}`} />
      </Helmet>
      {/* Page content */}
    </>
  );
};
```

## Persistence Layer

### Development (Current)

Content is loaded from static JSON files. Changes in the admin panel update these files.

**Note:** File system writes don't work in browser environments by default.

### Production Options

#### Option 1: Supabase Database

```sql
-- Create content tables
CREATE TABLE content_homepage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Edge function to update content
CREATE OR REPLACE FUNCTION update_homepage_content(new_content jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO content_homepage (content)
  VALUES (new_content)
  ON CONFLICT (id) DO UPDATE SET
    content = new_content,
    updated_at = now();
    
  RETURN new_content;
END;
$$ LANGUAGE plpgsql;
```

#### Option 2: API Backend

```typescript
// src/lib/contentApi.ts
export const saveContent = async (
  contentType: string,
  data: any
) => {
  const response = await fetch('/api/content/' + contentType, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return response.json();
};

export const loadContent = async (contentType: string) => {
  const response = await fetch('/api/content/' + contentType);
  return response.json();
};
```

## Migration Guide

### From Hard-coded to Content System

1. **Identify hard-coded content** in components
2. **Extract to JSON** with proper structure
3. **Update component** to use content utilities
4. **Add admin form** for editing
5. **Test thoroughly**

### Example Migration

**Before:**
```tsx
export const Hero = () => (
  <div>
    <h1>Welcome to our platform</h1>
    <p>The best moving company comparison</p>
    <button>Get Started</button>
  </div>
);
```

**After:**
```tsx
import { getHomepageContent } from "@/lib/content";

export const Hero = () => {
  const { hero } = getHomepageContent();
  
  return (
    <div>
      <h1>{hero.headline}</h1>
      <p>{hero.subheadline}</p>
      <button>{hero.primaryCTA}</button>
    </div>
  );
};
```

## Best Practices

### Content Structure

- ✅ Keep JSON files focused (one concern per file)
- ✅ Use consistent naming conventions
- ✅ Include `id` fields for all list items
- ✅ Add `order` fields for sortable lists
- ✅ Validate data with TypeScript types

### Admin Panel

- ✅ Provide inline validation
- ✅ Show character count for limited fields
- ✅ Use optimistic UI updates
- ✅ Implement undo functionality
- ✅ Add confirmation for destructive actions

### Performance

- ✅ Lazy load content when possible
- ✅ Cache loaded content
- ✅ Minimize JSON file size
- ✅ Use code splitting for admin panel
- ✅ Implement progressive loading

## Troubleshooting

### Content not updating

1. Check browser console for errors
2. Verify JSON syntax is valid
3. Clear browser cache
4. Check file permissions (development)
5. Verify API endpoints (production)

### Admin panel not accessible

1. Check `VITE_ADMIN_PASSWORD` is set
2. Clear sessionStorage
3. Verify route is registered in App.tsx
4. Check for JavaScript errors

### Type errors

1. Update TypeScript types in `types.ts`
2. Run `npm run type-check`
3. Ensure JSON matches type definitions

## Future Enhancements

- [ ] Versioning & rollback
- [ ] Multi-language support
- [ ] Image upload with preview
- [ ] Bulk import/export
- [ ] Content scheduling
- [ ] Approval workflows
- [ ] Real-time collaborative editing
- [ ] Content analytics
- [ ] A/B testing integration

## Support

For questions or issues:
1. Check this documentation
2. Review `/docs/content-editing.md` (user guide)
3. Check existing GitHub issues
4. Contact the development team

---

**Last Updated:** 2025-01-19  
**Version:** 1.0.0  
**Maintainer:** Umzugscheck.ch Development Team
