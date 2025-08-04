'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Zap, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Contract, uint256 } from 'starknet'
import { useAccount, useSendTransaction, useTransactionReceipt } from '@starknet-react/core'
import { StoreAbi } from '@/constants/abi'
import { STORE_CONTRACT_ADDRESS, STRK_TOKEN_ADDRESS } from '@/constants'

// Cairo 1.0 ERC20 ABI for token approval
const ERC20_ABI = [
  {
    "name": "approve",
    "type": "function",
    "inputs": [
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [
      {
        "type": "core::bool"
      }
    ],
    "state_mutability": "external"
  },
  {
    "name": "allowance",
    "type": "function",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [
      {
        "type": "core::integer::u256"
      }
    ],
    "state_mutability": "view"
  }
]

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
  strkPrice?: number // Current STRK price in USD
}

export default function BuyNowButton({ product, onPurchaseSuccess, strkPrice }: BuyNowButtonProps) {
  const { account, status } = useAccount()
  const { sendAsync, isPending } = useSendTransaction({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  
  const isWalletConnected = status === 'connected'

  // Get transaction receipt to monitor transaction status
  const { data: receipt, isLoading: isWaitingForReceipt } = useTransactionReceipt({
    hash: transactionHash,
    watch: true,
  })

  // Effect to handle successful transaction receipt
  useEffect(() => {
    if (receipt && transactionHash) {
      // Transaction is confirmed
      setStatusMessage({
        type: 'success',
        message: `Successfully purchased ${product.name}!`
      })

      // Reset transaction hash
      setTransactionHash("")
      
      // Reset submission state
      setIsSubmitting(false)
      
      // Call success callback if provided
      if (onPurchaseSuccess) {
        onPurchaseSuccess()
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    }
  }, [receipt, transactionHash, product.name, onPurchaseSuccess])

  // Check current allowance
  const checkAllowance = async (requiredAmount: bigint): Promise<boolean> => {
    try {
      if (!account) return false

      const tokenContract = new Contract(ERC20_ABI, STRK_TOKEN_ADDRESS, account)
      const allowanceResult = await tokenContract.allowance(account.address, STORE_CONTRACT_ADDRESS)
      
      // Convert allowance to bigint for comparison
      const currentAllowance = BigInt(allowanceResult.toString())
      console.log("Current allowance:", currentAllowance.toString())
      console.log("Required amount:", requiredAmount.toString())
      
      return currentAllowance >= requiredAmount
    } catch (error) {
      console.error("Error checking allowance:", error)
      return false
    }
  }





  const buyNow = async (product: Product) => {
    if (product.stock === 0) {
      setStatusMessage({
        type: 'error',
        message: "This product is currently out of stock."
      })
      return
    }

    if (!isWalletConnected || !account) {
      setStatusMessage({
        type: 'error',
        message: "Please connect your wallet first."
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate required token amount
      setStatusMessage({
        type: 'info',
        message: 'Preparing purchase...'
      })

      const currentStrkPrice = strkPrice || 0.5 // Fallback to $0.5 if no price available
      const strkAmount = product.price / currentStrkPrice // USD / (USD per STRK) = STRK needed
      const requiredAmount = BigInt(Math.ceil(strkAmount * 10**18))
      const priceInCents = Math.round(product.price * 100)
      
      console.log("Required token amount:", requiredAmount.toString())
      console.log("Product price (USD):", product.price)
      console.log("Current STRK price (USD):", currentStrkPrice)
      console.log("STRK amount needed:", strkAmount)

      // Check current allowance to determine if we need approval
      const hasAllowance = await checkAllowance(requiredAmount)
      
      setStatusMessage({
        type: 'info',
        message: 'Please confirm the transaction in your wallet...'
      })

      // Prepare multicall: approval (if needed) + purchase
      const calls = []
      
      if (!hasAllowance) {
        // Add approval call to multicall
        const formattedAmount = uint256.bnToUint256(requiredAmount)
        const approveCall = {
          contractAddress: STRK_TOKEN_ADDRESS,
          entrypoint: "approve",
          calldata: [STORE_CONTRACT_ADDRESS, formattedAmount.low.toString(), formattedAmount.high.toString()]
        }
        calls.push(approveCall)
        console.log("Adding approval to multicall:", approveCall)
      }

      // Add purchase call to multicall
      const formattedPaymentAmount = uint256.bnToUint256(requiredAmount)
      const buyProductCall = {
        contractAddress: STORE_CONTRACT_ADDRESS,
        entrypoint: 'buy_product',
        calldata: [
          product.id.toString(),
          '1', // quantity
          priceInCents.toString(), // expected_price in cents
          formattedPaymentAmount.low.toString(), // payment_amount low part
          formattedPaymentAmount.high.toString() // payment_amount high part
        ]
      }
      calls.push(buyProductCall)
      console.log("Adding purchase to multicall:", buyProductCall)

      // Execute multicall transaction
      console.log("Executing multicall with", calls.length, "calls")
      const response = await sendAsync(calls)
      
      if (response.transaction_hash) {
        setTransactionHash(response.transaction_hash)
        
        toast({
          title: "✅ Transaction Submitted!",
          description: `Hash: ${response.transaction_hash.substring(0, 10)}...`,
        })
        
        setStatusMessage({
          type: 'info',
          message: `Transaction submitted: ${response.transaction_hash.substring(0, 10)}...`
        })
      } else {
        setIsSubmitting(false)
        return
      }

    } catch (error: any) {
      console.error("Purchase flow error:", error)
      
      setStatusMessage({
        type: 'error',
        message: "An unexpected error occurred. Please try again."
      })

      toast({
        title: "❌ Error",
        description: "An unexpected error occurred during the purchase process.",
        variant: "destructive",
      })
      
      setIsSubmitting(false)
      
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    }
  }

  const isLoading = isSubmitting || isWaitingForReceipt

  return (
    <div className="space-y-2 w-full">
      {statusMessage && (
        <div className={`p-2 rounded text-sm flex items-center ${
          statusMessage.type === 'error' ? 'bg-red-100 text-red-800' : 
          statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {statusMessage.type === 'error' && <AlertCircle className="h-4 w-4 mr-2" />}
          {statusMessage.type === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
          {statusMessage.type === 'info' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {statusMessage.message}
        </div>
      )}
      
      <Button
        onClick={() => buyNow(product)}
        disabled={product.stock === 0 || !isWalletConnected || isLoading}
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isWaitingForReceipt ? "Processing..." : "Submitting..."}
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Buy Now - ${product.price.toFixed(2)}
          </>
        )}
      </Button>
    </div>
  )
}