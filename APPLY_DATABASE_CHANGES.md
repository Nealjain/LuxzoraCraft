# Apply Database Changes to Supabase

## ⚠️ IMPORTANT WARNING
This will **DELETE ALL USER DATA** from your database! Make sure you want to start fresh.

## Steps to Apply Changes:

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
   - Visit: https://supabase.com/dashboard/projects
   - Select your LuxZoraCraft project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the sidebar
   - Click "New Query"

3. **Copy and paste the SQL**
   - Open the file: `clean_and_setup_unique_constraints.sql`
   - Copy all the content
   - Paste it into the SQL Editor

4. **Run the script**
   - Click "Run" button
   - Wait for completion (should show success message)

### Method 2: Using Supabase CLI (Alternative)

```bash
# Make sure you're in the project directory
cd /Users/nealjain/luxzoracraft

# Link to your project if not already linked
npx supabase link --project-ref kshoqrfdlhpralshfhhl

# Apply the SQL file directly
npx supabase db reset --linked
```

## What This Script Does:

### 🗑️ **Data Cleanup:**
- ✅ Deletes all wishlist items
- ✅ Deletes all reviews
- ✅ Deletes all order items and orders
- ✅ Deletes all addresses
- ✅ Deletes all users

### 🔧 **Schema Updates:**
- ✅ Adds `provider` column (for 'credentials' or 'google')
- ✅ Adds `provider_id` column (for OAuth provider IDs)
- ✅ Adds `avatar_url` column (for profile pictures)

### 🔒 **Unique Constraints:**
- ✅ **Email UNIQUE constraint** - No duplicate emails
- ✅ **Phone UNIQUE constraint** - No duplicate phone numbers (excluding NULL)

### ✅ **Validation:**
- ✅ Email format validation
- ✅ Phone number format validation (Indian mobile: 6-9xxxxxxxxx)
- ✅ Automatic phone number normalization

### 🔄 **Functions Created:**
- ✅ `normalize_phone_number()` - Cleans and validates phone numbers
- ✅ `handle_oauth_user()` - Manages Google OAuth user creation
- ✅ `trigger_normalize_phone()` - Auto-normalizes phone on insert/update

## After Running:

1. **Test Registration:**
   - Try registering with email and phone
   - Verify duplicate email/phone rejection

2. **Test Google OAuth:**
   - Try "Sign in with Google"
   - Check if user data is stored properly

3. **Verify Constraints:**
   - Attempt to register duplicate email (should fail)
   - Attempt to register duplicate phone (should fail)

## Verification Queries:

After running, you can verify the setup with these queries in SQL Editor:

```sql
-- Check if constraints exist
SELECT conname, contype FROM pg_constraint WHERE conrelid = 'users'::regclass;

-- Check if indexes exist
SELECT indexname FROM pg_indexes WHERE tablename = 'users';

-- Check if functions exist
SELECT proname FROM pg_proc WHERE proname IN ('normalize_phone_number', 'handle_oauth_user');

-- Check table structure
\d users;
```

## Rollback Plan:

If something goes wrong, you can restore from Supabase backup:
1. Go to Project Settings > Database
2. Find your latest backup
3. Restore from backup

---

**Ready to proceed? Copy the SQL from `clean_and_setup_unique_constraints.sql` and run it in your Supabase SQL Editor!**
