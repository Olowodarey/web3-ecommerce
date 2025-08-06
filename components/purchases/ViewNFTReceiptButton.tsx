'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Eye, ExternalLink, Download } from 'lucide-react'
import { toast } from 'sonner'

interface ViewNFTReceiptButtonProps {
  purchaseId: string
  productId: number
  quantity: number
  totalPrice: number
  isMinted: boolean
}

export default function ViewNFTReceiptButton({
  purchaseId,
  productId,
  quantity,
  totalPrice,
  isMinted
}: ViewNFTReceiptButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Generate the NFT receipt image URL
  const receiptImageUrl = `https://web3-ecommerce-roan.vercel.app/api/generate-receipt-image?tokenId=${purchaseId}&productId=${productId}&amount=${totalPrice}&quantity=${quantity}`
  
  // Generate the NFT metadata URL
  const metadataUrl = `https://web3-ecommerce-roan.vercel.app/api/nft-metadata/${purchaseId}`

  const handleViewReceipt = () => {
    setIsOpen(true)
  }

  const handleOpenInNewTab = () => {
    window.open(receiptImageUrl, '_blank')
  }

  const handleDownloadReceipt = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(receiptImageUrl)
      const svgBlob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(svgBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `receipt-${purchaseId}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Receipt downloaded successfully!')
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast.error('Failed to download receipt')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewMetadata = () => {
    window.open(metadataUrl, '_blank')
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewReceipt}
        className="flex items-center gap-2 bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-gray-500 backdrop-blur-sm"
      >
        <Eye className="h-4 w-4" />
        {isMinted ? 'View NFT Receipt' : 'Preview Receipt'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {isMinted ? 'NFT Receipt #' : 'Receipt Preview #'}{purchaseId}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {isMinted && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    NFT Minted
                  </Badge>
                )}
                <Badge variant="outline">
                  {totalPrice >= 50000 ? 'Premium' : totalPrice >= 10000 ? 'Standard' : 'Basic'}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Receipt Image */}
            <div className="flex justify-center bg-gray-50 rounded-lg p-4">
              <div className="max-w-md w-full">
                <img
                  src={receiptImageUrl}
                  alt={`Receipt #${purchaseId}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '600px', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Receipt ID</p>
                <p className="font-semibold">#{purchaseId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Product ID</p>
                <p className="font-semibold">#{productId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-semibold">{quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold">${(totalPrice / 100).toFixed(2)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReceipt}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isLoading ? 'Downloading...' : 'Download SVG'}
              </Button>

              {isMinted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewMetadata}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View NFT Metadata
                </Button>
              )}
            </div>

            {/* NFT Info */}
            {isMinted && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">🎨 NFT Information</h4>
                <p className="text-sm text-blue-800 mb-2">
                  This receipt has been minted as an NFT on the Starknet blockchain.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">Token ID: {purchaseId}</Badge>
                  <Badge variant="secondary">Blockchain: Starknet</Badge>
                  <Badge variant="secondary">Standard: ERC721</Badge>
                </div>
              </div>
            )}

            {/* Preview Info */}
            {!isMinted && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">📋 Receipt Preview</h4>
                <p className="text-sm text-yellow-800">
                  This is how your receipt will look when minted as an NFT. Click "Mint Receipt" to create the actual NFT.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
