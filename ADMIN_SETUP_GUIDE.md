# 🔧 LuxZoraCraft Admin Setup Guide

## 🗄️ **Step 1: Database Setup**

### Run Migrations in Supabase
Copy and run these SQL scripts in your Supabase SQL Editor:

1. **Initial Schema** (`supabase/migrations/0001_initial_schema.sql`)
2. **RLS Policies** (`supabase/migrations/0002_rls_policies.sql`)
3. **Seed Data** (`supabase/migrations/0003_seed_data.sql`)
4. **Tracking Number** (`supabase/migrations/0004_add_tracking_number.sql`)

### Environment Variables
Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_PROMOTION_SECRET=luxzora-admin-secret-2024
```

## 👤 **Step 2: Create Admin User**

### Option 1: Using the Admin Setup Page
1. Go to: `http://localhost:3000/admin-setup`
2. Enter the email of the user you want to make admin
3. Enter the admin secret: `luxzora-admin-secret-2024`
4. Click "Promote to Admin"

### Option 2: Manual Database Update
1. Register a user normally on your website
2. In Supabase, go to Table Editor → users
3. Find your user and set `is_admin` to `true`

### Option 3: Using API
```bash
curl -X POST http://localhost:3000/api/admin/promote-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "secret": "luxzora-admin-secret-2024"
  }'
```

## 🧪 **Step 3: Test Database Connection**

Visit: `http://localhost:3000/api/test-db`

You should see:
```json
{
  "status": "success",
  "message": "All database connections working properly!",
  "tables": {
    "users": "connected",
    "products": "connected",
    "categories": "connected",
    "orders": "connected"
  }
}
```

## 🚀 **Step 4: Access Admin Dashboard**

1. **Login** with your admin user
2. **Visit**: `http://localhost:3000/admin`
3. You should see the admin dashboard with:
   - Real-time statistics
   - Order management
   - Product management
   - Customer data

## 📊 **Step 5: Admin Features Available**

### **Order Management** (`/admin/orders`)
- ✅ View all orders with customer details
- ✅ Update order status (Pending → Paid → Shipped → Delivered)
- ✅ Add tracking numbers
- ✅ Search and filter orders
- ✅ View order items and customer addresses

### **Dashboard** (`/admin`)
- ✅ Total revenue tracking
- ✅ Order count by status
- ✅ Customer and product statistics
- ✅ Low stock alerts
- ✅ Recent order activity

### **Products** (`/admin/products`)
- ✅ Add/edit/delete products
- ✅ Manage inventory levels
- ✅ Category organization
- ✅ Image management

## 🔍 **Troubleshooting**

### Database Connection Issues
1. Check your Supabase URL and keys in `.env.local`
2. Ensure RLS policies are enabled
3. Run the test API: `/api/test-db`

### Admin Access Issues
1. Verify user has `is_admin = true` in database
2. Logout and login again to refresh session
3. Check browser console for authentication errors

### Image Issues
1. Ensure hero images are in `public/images/hero/`
2. Files should be named: `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`

## 📝 **Quick Checklist**

- [ ] Database migrations run in Supabase
- [ ] Environment variables set correctly
- [ ] Admin user created and promoted
- [ ] Database connection test passes
- [ ] Can access admin dashboard at `/admin`
- [ ] Hero images displaying properly
- [ ] Order management working
- [ ] Product management working

## 🎯 **Success Indicators**

When everything is working correctly:

1. **Homepage**: Hero images slide properly
2. **Login**: Authentication works with Google/email
3. **Admin Access**: `/admin` shows dashboard with real data
4. **Order Management**: Can view and update order statuses
5. **Database**: All APIs return real data, not mock data

## 🚨 **Common Issues & Solutions**

### "Failed to update profile"
- **Solution**: Restart the dev server after updating NextAuth config

### "Hero images not visible"
- **Solution**: Images are now fixed and should display properly

### "Admin dashboard shows no data"
- **Solution**: Run database migrations and check API endpoints

### "Can't access admin panel"
- **Solution**: Ensure user has `is_admin = true` and re-login

---

## 🎉 **You're All Set!**

Your LuxZoraCraft website is now a fully functional e-commerce platform with:
- ✅ Complete admin panel
- ✅ Real database integration
- ✅ Order management system
- ✅ Customer management
- ✅ Product inventory tracking
- ✅ Professional UI/UX

**Ready for production!** 🚀
