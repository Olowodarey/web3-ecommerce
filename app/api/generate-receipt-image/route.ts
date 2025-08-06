import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get('tokenId') || '1'
    const productId = searchParams.get('productId') || '0'
    const amount = searchParams.get('amount') || '0'
    const quantity = searchParams.get('quantity') || '1'
    
    // For now, return a simple SVG receipt image
    // You can replace this with actual image generation later
    const receiptSvg = generateReceiptSVG({
      tokenId,
      productId,
      amount: parseInt(amount, 10),
      quantity: parseInt(quantity, 10)
    })

    return new NextResponse(receiptSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Error generating receipt image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}

function generateReceiptSVG({
  tokenId,
  productId,
  amount,
  quantity
}: {
  tokenId: string
  productId: string
  amount: number
  quantity: number
}) {
  // Determine receipt style based on amount
  const isPremium = amount >= 50000
  const isStandard = amount >= 10000
  
  const bgColor = isPremium ? '#FFD700' : isStandard ? '#C0C0C0' : '#F5F5F5'
  const borderColor = isPremium ? '#B8860B' : isStandard ? '#808080' : '#CCCCCC'
  const category = isPremium ? 'PREMIUM' : isStandard ? 'STANDARD' : 'BASIC'
  
  const formattedAmount = (amount / 100).toFixed(2)
  const currentDate = new Date().toLocaleDateString()

  return `
    <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:white;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="600" fill="url(#bgGradient)" stroke="${borderColor}" stroke-width="3" rx="15"/>
      
      <!-- Header -->
      <rect x="20" y="20" width="360" height="80" fill="${borderColor}" rx="10"/>
      <text x="200" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">
        WEB3 E-COMMERCE
      </text>
      <text x="200" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white">
        PURCHASE RECEIPT NFT
      </text>
      <text x="200" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">
        ${category} TIER
      </text>
      
      <!-- Receipt Details -->
      <text x="40" y="140" font-family="monospace" font-size="16" font-weight="bold" fill="#333">
        Receipt #${tokenId}
      </text>
      
      <text x="40" y="170" font-family="Arial, sans-serif" font-size="14" fill="#666">
        Date: ${currentDate}
      </text>
      
      <line x1="40" y1="190" x2="360" y2="190" stroke="#DDD" stroke-width="1"/>
      
      <!-- Purchase Details -->
      <text x="40" y="220" font-family="Arial, sans-serif" font-size="14" fill="#333">
        Product ID: #${productId}
      </text>
      
      <text x="40" y="250" font-family="Arial, sans-serif" font-size="14" fill="#333">
        Quantity: ${quantity}
      </text>
      
      <text x="40" y="280" font-family="Arial, sans-serif" font-size="14" fill="#333">
        Unit Price: $${(amount / quantity / 100).toFixed(2)}
      </text>
      
      <line x1="40" y1="300" x2="360" y2="300" stroke="#DDD" stroke-width="1"/>
      
      <!-- Total -->
      <text x="40" y="330" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">
        Total: $${formattedAmount}
      </text>
      
      <line x1="40" y1="350" x2="360" y2="350" stroke="#333" stroke-width="2"/>
      
      <!-- NFT Info -->
      <text x="40" y="380" font-family="Arial, sans-serif" font-size="12" fill="#666">
        This is an NFT receipt stored on Starknet
      </text>
      
      <text x="40" y="400" font-family="Arial, sans-serif" font-size="12" fill="#666">
        Token ID: ${tokenId}
      </text>
      
      <!-- Footer -->
      <rect x="40" y="450" width="320" height="100" fill="#F8F8F8" stroke="#DDD" stroke-width="1" rx="5"/>
      <text x="200" y="475" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#333">
        BLOCKCHAIN VERIFIED
      </text>
      <text x="200" y="495" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">
        This receipt is permanently stored on
      </text>
      <text x="200" y="510" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">
        the Starknet blockchain and cannot be
      </text>
      <text x="200" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">
        altered or duplicated.
      </text>
    </svg>
  `
}
