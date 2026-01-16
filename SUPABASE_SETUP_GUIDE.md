# Supabase Setup Guide for Order Management

This guide will help you set up Supabase to store order details from your e-commerce application.

## Features Implemented

✅ **Supabase Database Integration**: Orders are automatically saved to Supabase after payment confirmation  
✅ **Automatic Invoice Download**: Invoice automatically downloads when users reach the order success page  
✅ **Complete Order Data Storage**: All customer details, items, and payment information stored securely

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: diksha-mahajan-orders (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

---

## Step 2: Create the Orders Table

1. In your Supabase dashboard, navigate to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste the contents from `/supabase/schema.sql`:

```sql
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  payment_id TEXT NOT NULL,
  order_date TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL,
  customer_pincode TEXT NOT NULL,
  items JSONB NOT NULL,
  total TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable all access for authenticated users" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click **"Run"** to execute the SQL
5. You should see "Success. No rows returned" message

---

## Step 3: Get Your API Keys

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click on **API** in the settings menu
3. You'll see three important values:

### Copy These Values:

- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different long string)

⚠️ **IMPORTANT**: The `service_role` key has admin privileges. Never expose it in client-side code!

---

## Step 4: Update Environment Variables

1. Open your `.env.local` file in the project root
2. Add the following variables with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. Save the file

---

## Step 5: Test the Integration

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Place a test order**:
   - Add items to cart
   - Go to checkout
   - Fill in customer details
   - Complete payment (use Razorpay test mode)

3. **Verify the order was saved**:
   - Go to Supabase dashboard
   - Click **Table Editor** in left sidebar
   - Select the `orders` table
   - You should see your test order!

4. **Check automatic invoice download**:
   - After successful payment, you'll be redirected to the order success page
   - A print dialog should automatically open with the invoice
   - You can save it as PDF or print it

---

## Database Schema

The `orders` table stores the following information:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `order_id` | TEXT | Razorpay order ID (unique) |
| `payment_id` | TEXT | Razorpay payment ID |
| `order_date` | TEXT | Formatted order date |
| `customer_name` | TEXT | Customer's full name |
| `customer_email` | TEXT | Customer's email address |
| `customer_phone` | TEXT | Customer's phone number |
| `customer_address` | TEXT | Street address |
| `customer_city` | TEXT | City |
| `customer_state` | TEXT | State |
| `customer_pincode` | TEXT | Postal code |
| `items` | JSONB | Array of order items with details |
| `total` | TEXT | Order total amount |
| `status` | TEXT | Order status (default: 'confirmed') |
| `created_at` | TIMESTAMP | When the order was created |
| `updated_at` | TIMESTAMP | Last update timestamp |

---

## Viewing Orders

### In Supabase Dashboard:
1. Go to **Table Editor**
2. Click on **orders** table
3. View all orders with full details

### Query Examples:

**Get all orders:**
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

**Get orders by customer email:**
```sql
SELECT * FROM orders WHERE customer_email = 'customer@example.com';
```

**Get orders from today:**
```sql
SELECT * FROM orders WHERE created_at::date = CURRENT_DATE;
```

**Get total revenue:**
```sql
SELECT COUNT(*) as total_orders, 
       SUM(CAST(REPLACE(REPLACE(total, 'Rs.', ''), ',', '') AS NUMERIC)) as total_revenue 
FROM orders;
```

---

## Automatic Invoice Download

When a customer completes their order:

1. They're redirected to `/order-success` page
2. After 1 second, a print dialog automatically opens
3. The invoice contains:
   - Order details (ID, date, status)
   - Customer information
   - Shipping address
   - All order items with quantities and prices
   - Order total
   - Contact information

The customer can:
- **Save as PDF**: Most browsers allow saving the print dialog as PDF
- **Print**: Print a physical copy
- **Close**: Close the dialog and view the invoice on the page

---

## Security Notes

✅ **Row Level Security (RLS)** is enabled on the orders table  
✅ **Service role key** is only used server-side in API routes  
✅ **Anon key** is safe to use in client-side code  
✅ All database operations happen through secure API routes

---

## Troubleshooting

### Orders not saving to database:

1. Check that all environment variables are set correctly
2. Verify the Supabase URL doesn't have trailing slashes
3. Check the browser console for errors
4. Verify the `orders` table exists in Supabase

### Invoice not downloading automatically:

1. Check browser popup blocker settings
2. Ensure order data is in sessionStorage
3. Check browser console for JavaScript errors

### Can't see orders in Supabase:

1. Verify you're looking at the correct project
2. Check the `orders` table in Table Editor
3. Try running a SQL query to check if data exists

---

## Next Steps

- Set up email notifications (currently commented out in code)
- Create an admin dashboard to view orders
- Add order status updates
- Implement order tracking
- Set up automated backups

---

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the code in `/app/api/razorpay/verify-payment/route.ts`
- Check the order success page: `/app/order-success/page.tsx`
