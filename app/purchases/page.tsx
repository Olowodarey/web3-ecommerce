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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Connecting to wallet...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected || !account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to view your purchase history.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
            <p className="text-gray-600">View your purchase history and mint receipts</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : purchases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-600">
                When you make your first purchase, it will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Purchase #{purchase.id}
                    </CardTitle>
                    <Badge variant="secondary">
                      {formatDate(purchase.timestamp)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Product ID</p>
                      <p className="font-semibold">#{purchase.product_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold">{purchase.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="font-semibold text-green-600">
                        {formatPrice(purchase.total_price)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Transaction ID: {purchase.id}
                    </div>
                    <MintReceiptButton 
                      purchaseId={purchase.id}
                      onMintSuccess={() => {
                        // Optionally refresh purchases or show success message
                        console.log('Receipt minted successfully for purchase:', purchase.id)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
