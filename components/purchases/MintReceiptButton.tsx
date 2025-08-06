'use client'

import { useState, useEffect } from 'react'
import { useAccount, useSendTransaction } from '@starknet-react/core'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Receipt, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Contract, Provider, uint256 } from 'starknet'
import { STORE_CONTRACT_ADDRESS } from '@/constants'
import { StoreAbi } from '@/constants/abi'

interface MintReceiptButtonProps {
  purchaseId: string
  onMintSuccess?: () => void
}

export function MintReceiptButton({ purchaseId, onMintSuccess }: MintReceiptButtonProps) {
  const { address, isConnected, account } = useAccount()
  const [isMinted, setIsMinted] = useState<boolean | null>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [isMinting, setIsMinting] = useState(false)

  // Create contract instance with Provider like in Products.tsx
  const provider = new Provider({
    nodeUrl: "https://starknet-sepolia.blastapi.io/cb15156d-9e8d-4a8b-aa9a-81d8de0e09a7/rpc/v0_8",
  });
  const contract = new Contract(StoreAbi[0], STORE_CONTRACT_ADDRESS, provider);

  const { sendAsync } = useSendTransaction({})

  // Check if receipt is already minted
  useEffect(() => {
    if (purchaseId && isConnected && address) {
      checkMintStatus()
    }
  }, [purchaseId, isConnected, address])

  const checkMintStatus = async () => {
    if (!isConnected || !address) {
      setIsMinted(false)
      setIsCheckingStatus(false)
      return
    }

    try {
      setIsCheckingStatus(true)
      // Convert purchaseId to proper format for u256
      const purchaseIdU256 = uint256.bnToUint256(purchaseId)
      console.log('🔍 Checking mint status for purchase ID:', { purchaseId, purchaseIdU256 })
      
      // Enhanced debugging for mint status check
      console.log('🔍 [MINT STATUS] Raw purchaseId:', purchaseId)
      console.log('🔍 [MINT STATUS] purchaseId type:', typeof purchaseId)
      console.log('🔍 [MINT STATUS] Converted purchaseIdU256:', purchaseIdU256)
      console.log('🔍 [MINT STATUS] U256 low:', purchaseIdU256.low)
      console.log('🔍 [MINT STATUS] U256 high:', purchaseIdU256.high)
      
      const result = await contract.is_purchase_minted(purchaseIdU256)
      console.log('🔍 [MINT STATUS] Contract result:', result)
      setIsMinted(Boolean(result))
    } catch (error) {
      console.error('Error checking mint status:', error)
      setIsMinted(false)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const handleMintReceipt = async () => {
    console.log('🔍 Mint button clicked:', { isConnected, address, purchaseId, isMinted, isMinting })
    
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    if (isMinted) {
      toast.info('Receipt has already been minted for this purchase')
      return
    }

    try {
      setIsMinting(true)
      toast.loading('Minting receipt NFT...', { id: 'mint-receipt' })

      // Enhanced debugging for purchase ID format
      console.log('🔍 Raw purchaseId:', purchaseId)
      console.log('🔍 purchaseId type:', typeof purchaseId)
      console.log('🔍 purchaseId length:', purchaseId.length)
      
      // Convert to proper u256 format
      const purchaseIdU256 = uint256.bnToUint256(purchaseId)
      console.log('🔍 Converted purchaseIdU256:', purchaseIdU256)
      console.log('🔍 U256 low:', purchaseIdU256.low)
      console.log('🔍 U256 high:', purchaseIdU256.high)

      // Prepare transaction calls
      const calls = [{
        contractAddress: STORE_CONTRACT_ADDRESS,
        entrypoint: 'mint_receipt',
        calldata: [purchaseIdU256.low, purchaseIdU256.high] // Pass u256 as low and high parts
      }]
      
      console.log('🔍 Transaction calls:', calls)

      const result = await sendAsync(calls)
      
      if (result?.transaction_hash) {
        toast.success('Receipt minted successfully!', { 
          id: 'mint-receipt',
          description: `Transaction: ${result.transaction_hash}`
        })
        
        // Update local state
        setIsMinted(true)
        
        // Call success callback
        onMintSuccess?.()
      } else {
        throw new Error('Transaction failed')
      }
    } catch (error: any) {
      console.error('Error minting receipt:', error)
      toast.error('Failed to mint receipt', {
        id: 'mint-receipt',
        description: error?.message || 'Please try again'
      })
    } finally {
      setIsMinting(false)
    }
  }

  if (isCheckingStatus) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-600">Checking status...</span>
      </div>
    )
  }

  if (isMinted) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Receipt Minted
        </Badge>
      </div>
    )
  }

  return (
    <Button
      onClick={handleMintReceipt}
      disabled={isMinting || !isConnected || Boolean(isMinted)}
      size="sm"
      variant="outline"
      className="flex items-center gap-2 bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-gray-500 backdrop-blur-sm disabled:opacity-50"
    >
      {isMinting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Minting...
        </>
      ) : (
        <>
          <Receipt className="h-4 w-4" />
          Mint Receipt
        </>
      )}
    </Button>
  )
}
