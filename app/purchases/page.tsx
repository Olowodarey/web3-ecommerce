'use client'

import { useEffect, useState } from 'react'
import { useAccount } from '@starknet-react/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShoppingBag, AlertCircle, Loader2 } from 'lucide-react'
import { Contract, Provider } from 'starknet'
import { StoreAbi } from '@/constants/abi'
import { STORE_CONTRACT_ADDRESS } from '@/constants'
import { MintReceiptButton } from '@/components/purchases/MintReceiptButton'
import ViewNFTReceiptButton from '@/components/purchases/ViewNFTReceiptButton'
import ViewTransactionButton from '@/components/purchases/ViewTransactionButton'

interface Purchase {
  id: string
  product_id: number
  quantity: number
  total_price: number
  timestamp: number
  buyer: string
}

export default function PurchasesPage() {
  const { address, isConnected, account, status } = useAccount()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mintedStatus, setMintedStatus] = useState<Record<string, boolean>>({})

  // Create contract instance with Provider like in Products.tsx
  const provider = new Provider({
    nodeUrl: "https://starknet-sepolia.blastapi.io/cb15156d-9e8d-4a8b-aa9a-81d8de0e09a7/rpc/v0_8",
  });
  const contract = new Contract(StoreAbi[0], STORE_CONTRACT_ADDRESS, provider);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserPurchases()
    } else {
      setLoading(false)
    }
  }, [isConnected, address])

  const fetchUserPurchases = async () => {
    try {
      setLoading(true)
      setError(null)

      // First get the list of purchase IDs
      const purchaseIds = await contract.get_user_purchases(address)
      
      console.log('🔍 Purchase IDs:', purchaseIds)
      console.log('🔍 Number of purchases:', purchaseIds.length)
      
      // Now fetch detailed data for each purchase ID using get_purchase_details
      const formattedPurchases: Purchase[] = []
      
      for (let i = 0; i < purchaseIds.length; i++) {
        try {
          const purchaseId = purchaseIds[i].toString()
          console.log(`🔍 Fetching details for purchase ID: ${purchaseId}`)
          
          // Get detailed purchase data
          const purchaseDetails = await contract.get_purchase_details(parseInt(purchaseId, 10))
          console.log(`🔍 Purchase details for ID ${purchaseId}:`, purchaseDetails)
          
          const formattedPurchase: Purchase = {
            id: purchaseId,
            product_id: Number(purchaseDetails.product_id?.toString() || 0),
            quantity: Number(purchaseDetails.quantity?.toString() || 0),
            total_price: Number(purchaseDetails.total_price_cents?.toString() || 0),
            timestamp: Number(purchaseDetails.timestamp?.toString() || Date.now()),
            buyer: purchaseDetails.buyer?.toString() || address || '',
          }
          
          console.log(`🔍 Formatted purchase ${purchaseId}:`, formattedPurchase)
          formattedPurchases.push(formattedPurchase)
          
          // Check if this purchase has been minted as NFT
          try {
            const isMinted = await contract.is_purchase_minted(parseInt(purchaseId, 10))
            setMintedStatus(prev => ({ ...prev, [purchaseId]: Boolean(isMinted) }))
          } catch (mintError) {
            console.error(`Error checking mint status for purchase ${purchaseId}:`, mintError)
            setMintedStatus(prev => ({ ...prev, [purchaseId]: false }))
          }
        } catch (error) {
          console.error(`❌ Error fetching details for purchase ${purchaseIds[i]}:`, error)
          // Add a placeholder entry if we can't fetch details
          formattedPurchases.push({
            id: purchaseIds[i].toString(),
            product_id: 0,
            quantity: 0,
            total_price: 0,
            timestamp: Date.now(),
            buyer: address || '',
          })
        }
      }

      setPurchases(formattedPurchases)
    } catch (err) {
      console.error('Error fetching user purchases:', err)
      setError('Failed to load your purchases. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Show loading while wallet is connecting/reconnecting
  if (status === 'connecting' || status === 'reconnecting') {
    return (
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
              <p className="text-gray-300">Connecting to wallet...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected || !account) {
    return (
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-gray-300">
                Please connect your wallet to view your purchase history.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header with Glow Effect */}
        <div className="flex items-center gap-4 mb-12 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <ShoppingBag className="h-10 w-10 text-blue-400 relative z-10" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              My Purchases
            </h1>
            <p className="text-gray-300 mt-1">View your purchase history and mint NFT receipts</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-700/50 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-700/50 rounded w-24"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-gray-300">{error}</p>
            </div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl shadow-2xl">
            <div className="text-center py-16">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gray-500/10 rounded-full blur-2xl" />
                <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto relative z-10" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No purchases yet</h3>
              <p className="text-gray-400 text-lg">
                When you make your first purchase, it will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase, index) => {
              const tierColor = purchase.total_price >= 50000 ? 'from-yellow-400/20 to-orange-400/20 border-yellow-400/30' : 
                               purchase.total_price >= 10000 ? 'from-gray-400/20 to-gray-300/20 border-gray-400/30' : 
                               'from-blue-400/20 to-purple-400/20 border-blue-400/30'
              
              return (
                <div 
                  key={purchase.id} 
                  className={`bg-gradient-to-br ${tierColor} backdrop-blur-sm border rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group relative overflow-hidden`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Header */}
                  <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse" />
                          <div className="w-3 h-3 bg-blue-400 rounded-full relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Purchase #{purchase.id}
                        </h3>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-600/30">
                        <span className="text-gray-300 text-sm">
                          {formatDate(purchase.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Purchase Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                        <p className="text-gray-400 text-sm mb-1">Product ID</p>
                        <p className="font-bold text-white text-lg">#{purchase.product_id}</p>
                      </div>
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                        <p className="text-gray-400 text-sm mb-1">Quantity</p>
                        <p className="font-bold text-white text-lg">{purchase.quantity}</p>
                      </div>
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                        <p className="text-gray-400 text-sm mb-1">Total Price</p>
                        <p className="font-bold text-green-400 text-lg">
                          {formatPrice(purchase.total_price)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                      <div className="text-sm text-gray-400">
                        <span className="text-gray-500">TX ID:</span> {purchase.id}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <ViewNFTReceiptButton
                          purchaseId={purchase.id}
                          productId={purchase.product_id}
                          quantity={purchase.quantity}
                          totalPrice={purchase.total_price}
                          isMinted={mintedStatus[purchase.id] || false}
                        />
                        <ViewTransactionButton
                          purchaseId={purchase.id}
                          purchaseTransactionHash={purchase.id}
                          mintTransactionHash={undefined}
                          isMinted={mintedStatus[purchase.id] || false}
                        />
                        <MintReceiptButton 
                          purchaseId={purchase.id}
                          onMintSuccess={() => {
                            console.log('Receipt minted successfully for purchase:', purchase.id)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
