# Premium Shoes & Watches Store

A premium responsive e-commerce website for a shoes and watches business, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Lucide React
- Vercel

## Features

### Customer website

- Premium responsive homepage
- Shoes and Watches categories
- Product cards and product detail pages
- Product image gallery
- Product options
- Price and comparison price
- New / Popular badges
- Approved customer reviews and ratings
- Related products
- WhatsApp ordering/contact flow
- SEO metadata
- Canonical URLs
- Open Graph / Twitter metadata
- Product JSON-LD structured data
- Responsive mobile, tablet and desktop layouts

### Admin dashboard

- Admin authentication
- Product create/edit/delete
- Product activation/deactivation
- Featured/New controls
- Product options
- Product image upload/delete
- Review approval/unapproval
- Review editing/deletion
- Admin-only database operations protected by RLS

## Project Structure

```text
app/
├── admin/
│   ├── login/
│   ├── products/
│   └── reviews/
├── product/
│   └── [slug]/
├── robots.txt/
├── sitemap.xml/
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── admin/
├── home/
├── layout/
└── product/

lib/
├── products.ts
├── reviews.ts
├── structured-data.ts
├── whatsapp.ts
└── supabase/
    ├── client.ts
    ├── server.ts
    ├── proxy.ts
    ├── products.ts
    ├── productQueries.ts
    ├── productImageUrl.ts
    └── uploadProductImages.ts

types/
├── product.ts
└── review.ts
```

## Environment Variables

Create `.env.local` locally:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For Vercel, add these variables in the project's Environment Variables settings.

Never expose a Supabase service-role key through a `NEXT_PUBLIC_*` variable or client-side code.

## Supabase Database

Main tables:

```text
admin_users
categories
products
product_images
product_options
product_reviews
```

Relationships:

```text
categories
    └── products.category_id

products
    ├── product_images.product_id
    ├── product_options.product_id
    └── product_reviews.product_id

admin_users.user_id
    └── auth.users.id
```

Product child records use cascade deletion. Category deletion is restricted while products reference the category.

## Row Level Security

RLS is enabled on the application tables.

Public users can view active catalog content and approved reviews.

Admins can manage products, product images, product options, and reviews.

Admin authorization is based on the `admin_users` table and the `is_admin()` helper.

## Storage

Product images use the Supabase Storage bucket:

```text
product-images
```

The application stores paths such as:

```text
{productId}/{random-file-name}.{extension}
```

The database stores the path in:

```text
product_images.storage_path
```

Database records and Storage objects are separate. Deleting a `product_images` database row does not automatically delete the physical Storage object. Image removal must call the Supabase Storage API with the exact object path.

## Reviews

Reviews are stored in:

```text
product_reviews
```

Rating is constrained to:

```text
1 <= rating <= 5
```

Only approved reviews are shown publicly.

## SEO

Product pages provide:

- title
- description
- canonical URL
- Open Graph metadata
- Twitter metadata
- Product JSON-LD structured data
- price and availability
- aggregate rating when reviews exist

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

Before deployment:

```bash
npm run build
```

The build must finish without TypeScript or compilation errors.

## Deployment

Recommended architecture:

```text
GitHub
   ↓
Vercel
   ↓
Next.js application

Supabase
   ├── PostgreSQL
   ├── Authentication
   └── Storage
```

After connecting GitHub to Vercel:

1. Add the four production environment variables.
2. Deploy.
3. Verify the production build.
4. Configure the custom domain.
5. Verify HTTPS/SSL.
6. Change `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain.
7. Redeploy.

## Production Checklist

### Customer website

- [ ] Homepage loads
- [ ] Shoes section contains only shoes
- [ ] Watches section contains only watches
- [ ] Product detail pages work
- [ ] Product images load
- [ ] Product options work
- [ ] Approved reviews display
- [ ] Related products work
- [ ] WhatsApp contact works
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Footer appears on all public pages
- [ ] Navigation works

### Admin

- [ ] Admin login works
- [ ] Unauthorized users cannot access admin
- [ ] Create product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Upload images works
- [ ] Delete image removes database record
- [ ] Delete image removes Storage object
- [ ] Approve/unapprove review works
- [ ] Edit review works
- [ ] Delete review works

### SEO

- [ ] `/robots.txt` works
- [ ] `/sitemap.xml` works
- [ ] Product canonical URLs are correct
- [ ] Product metadata is correct
- [ ] Product structured data is present
- [ ] Production site URL uses HTTPS

## Security

Do not commit:

```text
.env
.env.local
.env.production
```

Do not expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

The Supabase publishable key is intended for client-side use; database and Storage access must remain protected by RLS.

## Business Flow

This project intentionally does not use an online payment gateway.

The customer:

```text
Browse products
      ↓
Open product
      ↓
Choose product/options
      ↓
Contact shop through WhatsApp
      ↓
Shop completes the order manually
```

## License

Private client project. All rights reserved.
