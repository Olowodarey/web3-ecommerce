# Pinata IPFS Setup Instructions

## 🚀 Complete Pinata IPFS Integration Setup

Your Web3 e-commerce store now has full Pinata IPFS integration! Follow these steps to set up your API keys:

## 📋 Step 1: Get Your Pinata API Keys

1. Go to [Pinata.cloud](https://pinata.cloud)
2. Sign up or log in to your account
3. Navigate to **API Keys** in your dashboard
4. Click **New Key** 
5. Give it a name like "Web3-Ecommerce-Admin"
6. Enable **Pinning Services API** permissions
7. Copy your **API Key** and **Secret Key**

## 🔧 Step 2: Configure Environment Variables

Create a `.env.local` file in your project root and add:

```bash
# Pinata IPFS Configuration
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
```

**Replace the placeholder values with your actual Pinata credentials.**

## ✅ Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Go to Admin Dashboard → Add Product
3. Click "Upload Image to IPFS" 
4. Select an image file
5. Watch it upload to IPFS automatically!

## 🎯 Features Now Available

### ✅ **Admin Features:**
- **Direct Upload**: Click button to upload images to IPFS
- **Manual Entry**: Enter IPFS hash if you already have one
- **Image Preview**: See uploaded images before submitting
- **IPFS Validation**: Real-time validation of IPFS hashes
- **Progress Feedback**: Loading states and success notifications

### ✅ **Customer Features:**
- **IPFS Images**: All product images loaded from IPFS
- **Automatic Conversion**: IPFS hashes automatically converted to viewable URLs
- **Fallback Support**: Works with both IPFS and regular URLs

## 🔄 How It Works

### **Adding Products (Admin):**
1. **Upload Image** → Pinata IPFS → Get hash (e.g., `QmXxXxXx...`)
2. **Store Hash** → Convert to felt252 → Save on Starknet contract
3. **Display Confirmation** → Show success with IPFS hash

### **Viewing Products (Customer):**
1. **Fetch from Contract** → Get felt252 values
2. **Decode Hash** → Convert felt252 back to IPFS hash
3. **Load Image** → Convert hash to IPFS gateway URL
4. **Display Image** → Show image from IPFS

## 🛡️ Security Notes

- API keys are stored in environment variables (not in code)
- `.env.local` is gitignored (won't be committed to repository)
- Only admins can upload images (wallet-based authentication)
- Images are permanently stored on IPFS (decentralized)

## 🎊 You're All Set!

Once you add your Pinata API keys to `.env.local`, your admin dashboard will be able to:
- Upload images directly to IPFS
- Store IPFS hashes on the blockchain
- Display images from IPFS on your product pages

Your Web3 e-commerce store now has complete decentralized image storage! 🚀
