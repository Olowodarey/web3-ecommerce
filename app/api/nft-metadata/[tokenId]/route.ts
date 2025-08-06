import { NextRequest, NextResponse } from 'next/server'
import { Contract, Provider } from 'starknet'
import { StoreAbi } from '@/constants/abi'
import { STORE_CONTRACT_ADDRESS } from '@/constants'

// Initialize contract for reading purchase data
const provider = new Provider({ sequencer: { network: 'sepolia-testnet' } })
const contract = new Contract(StoreAbi[0], STORE_CONTRACT_ADDRESS, provider)

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const tokenId = params.tokenId
    
    // Validate token ID
    if (!tokenId || isNaN(Number(tokenId))) {
      return NextResponse.json(
        { error: 'Invalid token ID' },
        { status: 400 }
      )
    }

    // Get purchase details from contract
    let purchaseData
    try {
      purchaseData = await contract.get_purchase_details(parseInt(tokenId, 10))
    } catch (error) {
      console.error('Error fetching purchase data:', error)
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    // Extract purchase information
    const productId = Number(purchaseData.product_id?.toString() || 0)
    const quantity = Number(purchaseData.quantity?.toString() || 0)
    const totalPrice = Number(purchaseData.total_price_cents?.toString() || 0)
    const timestamp = Number(purchaseData.timestamp?.toString() || Date.now())
    const buyer = purchaseData.buyer?.toString() || ''

    // Determine image based on purchase data
    const imageUrl = generateReceiptImage({
      tokenId,
      productId,
      quantity,
      totalPrice,
      timestamp
    })

    // Generate dynamic metadata
    const metadata = {
      name: `Store Receipt #${tokenId}`,
      description: `Purchase receipt NFT from Web3 E-commerce Store. Product ID: ${productId}, Quantity: ${quantity}`,
      image: imageUrl,
      external_url: `https://web3-ecommerce-roan.vercel.app/receipt/${tokenId}`,
      attributes: [
        {
          trait_type: "Token ID",
          value: tokenId
        },
        {
          trait_type: "Product ID", 
          value: productId
        },
        {
          trait_type: "Quantity",
          value: quantity
        },
        {
          trait_type: "Total Price (cents)",
          value: totalPrice
        },
        {
          trait_type: "Purchase Date",
          value: new Date(timestamp * 1000).toISOString().split('T')[0]
        },
        {
          trait_type: "Buyer",
          value: buyer
        },
        {
          trait_type: "Receipt Category",
          value: getReceiptCategory(totalPrice)
        }
      ]
    }

    // Set CORS headers for NFT marketplaces
    return NextResponse.json(metadata, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })

  } catch (error) {
    console.error('Error generating NFT metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate dynamic receipt image URL based on purchase data
function generateReceiptImage({
  tokenId,
  productId,
  quantity,
  totalPrice,
  timestamp
}: {
  tokenId: string
  productId: number
  quantity: number
  totalPrice: number
  timestamp: number
}) {
  // Use your live Vercel deployment URL
  const baseUrl = 'https://web3-ecommerce-roan.vercel.app'
  
  // Generate dynamic SVG image with purchase data
  return `${baseUrl}/api/generate-receipt-image?tokenId=${tokenId}&productId=${productId}&amount=${totalPrice}&quantity=${quantity}`
}

// Categorize receipts based on purchase amount
function getReceiptCategory(totalPrice: number): string {
  if (totalPrice >= 50000) return 'Premium'
  if (totalPrice >= 10000) return 'Standard'
  return 'Basic'
}
