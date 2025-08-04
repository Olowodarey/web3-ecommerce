'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Zap, Loader2 } from 'lucide-react'
import { Contract, Provider, constants } from 'starknet'
import { useAccount, useProvider } from '@starknet-react/core'
import { StoreAbi } from '@/constants/abi'
import { STORE_CONTRACT_ADDRESS } from '@/constants'


interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  stock: number
}

interface BuyNowButtonProps {
  product: Product
  onPurchaseSuccess?: () => void
}

export default function BuyNowButton({ product, onPurchaseSuccess }: BuyNowButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { account, status } = useAccount()
  const { provider } = useProvider()
  
  const isWalletConnected = status === 'connected'

  const buyNow = async (product: Product) => {
    if (product.stock === 0) {
      toast({
        title: "❌ Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)

    try {
      // Check wallet connection using global context
      if (!isWalletConnected) {
        toast({
          title: "🔐 Wallet Required",
          description: "Please connect your wallet using the button in the top-right corner first.",
          variant: "destructive",
        })
        return
      }
      
      // Check if account is available from starknet-react, fallback to window.starknet
      let walletAccount = account
      
      if (!walletAccount) {
        // Fallback to window.starknet if starknet-react account not available
        const starknet = (window as any).starknet
        if (starknet?.account) {
          walletAccount = starknet.account
          console.log('Using fallback wallet account from window.starknet')
        } else {
          toast({
            title: "❌ Wallet Connection Failed",
            description: "Please ensure your wallet is properly connected",
            variant: "destructive",
          })
          return
        }
      }

      toast({
        title: "🔄 Processing Purchase...",
        description: "Calculating STRK amount using live oracle pricing...",
      })

      // Use provider from starknet-react context

      const contract = new Contract(
        StoreAbi[0],
        STORE_CONTRACT_ADDRESS,
        walletAccount // Use connected wallet account (starknet-react or fallback)
      )

      // Convert USD price back to cents for contract call
      const priceInCents = Math.round(product.price * 100)

      console.log("Calling buy_product with:", {
        productId: product.id,
        quantity: 1,
        expectedPrice: priceInCents,
      })

      // Call buy_product function with live oracle pricing
      // The contract will automatically convert USD to STRK using Pragma Oracle
      const result = await contract.buy_product(
        product.id,
        1, // quantity
        priceInCents // expected_price in cents
      )

      console.log("Transaction result:", result)

      // Wait for transaction confirmation
      await provider.waitForTransaction(result.transaction_hash)

      toast({
        title: "🎉 Purchase Successful!",
        description: `Successfully purchased ${product.name} using live STRK pricing!`,
      })

      // Call success callback if provided
      if (onPurchaseSuccess) {
        onPurchaseSuccess()
      }

    } catch (error: any) {
      console.error("Purchase error:", error)
      
      let errorMessage = "Transaction failed. Please try again."
      
      if (error.message?.includes("insufficient")) {
        errorMessage = "Insufficient STRK balance for this purchase"
      } else if (error.message?.includes("allowance")) {
        errorMessage = "Please approve STRK token spending first"
      } else if (error.message?.includes("quantity")) {
        errorMessage = "Insufficient product stock"
      } else if (error.message?.includes("rejected")) {
        errorMessage = "Transaction was rejected by user"
      }

      toast({
        title: "❌ Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={() => buyNow(product)}
      className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
      disabled={product.stock === 0 || isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Zap className="h-4 w-4 mr-2" />
          Buy Now
        </>
      )}
    </Button>
  )
}
