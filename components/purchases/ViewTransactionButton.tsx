'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Hash, Copy, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ViewTransactionButtonProps {
  purchaseId: string
  purchaseTransactionHash?: string
  mintTransactionHash?: string
  isMinted: boolean
}

export default function ViewTransactionButton({
  purchaseId,
  purchaseTransactionHash,
  mintTransactionHash,
  isMinted
}: ViewTransactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  // Starknet explorer URLs (using Starkscan for Sepolia)
  const getExplorerUrl = (txHash: string) => {
    return `https://sepolia.starkscan.co/tx/${txHash}`
  }

  const handleCopyHash = async (hash: string, type: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHash(hash)
      toast.success(`${type} transaction hash copied!`)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedHash(null), 2000)
    } catch (error) {
      console.error('Failed to copy hash:', error)
      toast.error('Failed to copy transaction hash')
    }
  }

  const handleOpenExplorer = (hash: string) => {
    window.open(getExplorerUrl(hash), '_blank')
  }

  const formatHash = (hash: string) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Hash className="h-4 w-4" />
        View Transaction
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Transaction Details - Purchase #{purchaseId}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Purchase Transaction */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  🛒 Purchase Transaction
                </h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Original Purchase
                </Badge>
              </div>

              {purchaseTransactionHash ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Transaction Hash</p>
                      <p className="font-mono text-sm break-all">
                        {purchaseTransactionHash}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyHash(purchaseTransactionHash, 'Purchase')}
                      className="flex items-center gap-2"
                    >
                      {copiedHash === purchaseTransactionHash ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copiedHash === purchaseTransactionHash ? 'Copied!' : 'Copy Hash'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenExplorer(purchaseTransactionHash)}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Starkscan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    Purchase transaction hash not available. This might be an older purchase.
                  </p>
                </div>
              )}
            </div>

            {/* NFT Mint Transaction */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  🎨 NFT Mint Transaction
                </h3>
                <Badge 
                  variant="secondary" 
                  className={isMinted ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                >
                  {isMinted ? 'NFT Minted' : 'Not Minted'}
                </Badge>
              </div>

              {isMinted && mintTransactionHash ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">NFT Mint Hash</p>
                      <p className="font-mono text-sm break-all">
                        {mintTransactionHash}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyHash(mintTransactionHash, 'NFT Mint')}
                      className="flex items-center gap-2"
                    >
                      {copiedHash === mintTransactionHash ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copiedHash === mintTransactionHash ? 'Copied!' : 'Copy Hash'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenExplorer(mintTransactionHash)}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Starkscan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    {isMinted 
                      ? "NFT mint transaction hash not available." 
                      : "This purchase hasn't been minted as an NFT yet. Click 'Mint Receipt' to create the NFT."
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Transaction Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">🔗 Blockchain Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-800 font-medium">Network</p>
                  <p className="text-blue-700">Starknet Sepolia</p>
                </div>
                <div>
                  <p className="text-blue-800 font-medium">Explorer</p>
                  <p className="text-blue-700">Starkscan</p>
                </div>
                <div>
                  <p className="text-blue-800 font-medium">Purchase ID</p>
                  <p className="text-blue-700">#{purchaseId}</p>
                </div>
                <div>
                  <p className="text-blue-800 font-medium">Token Standard</p>
                  <p className="text-blue-700">{isMinted ? 'ERC721 NFT' : 'Not Minted'}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
