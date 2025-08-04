"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Wallet, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useAccount, useDisconnect } from "@starknet-react/core"
import WalletConnectDialog from "@/components/connectwallet/WalletConnectDialog"

export default function AdminLogin() {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  const { account, address, status } = useAccount()
  const { disconnect } = useDisconnect()

  const isWalletConnected = status === 'connected'
  const walletAddress = address || ''

  // Admin wallet addresses (in production, these should be stored securely)
  const adminWallets = [
    "0x024bd0E4A658FA8655B7D7E4e0a625D36F885639Ace3F45732F7097f0bB8c6E9",
    "0xabcdef1234567890abcdef1234567890abcdef12",
    "0x9876543210fedcba9876543210fedcba98765432",
  ]

  // Function to normalize address for comparison
  const normalizeAddress = (address: string): string => {
    return address.toLowerCase().trim()
  }

  // Effect to handle wallet connection and admin verification
  useEffect(() => {
    if (isWalletConnected && walletAddress && !isVerifying) {
      setIsVerifying(true)
      
      // Normalize addresses for comparison
      const normalizedWalletAddress = normalizeAddress(walletAddress)
      const normalizedAdminWallets = adminWallets.map(addr => normalizeAddress(addr))
      
      console.log('Connected wallet address:', walletAddress)
      console.log('Normalized wallet address:', normalizedWalletAddress)
      console.log('Admin wallets:', adminWallets)
      console.log('Normalized admin wallets:', normalizedAdminWallets)
      
      // Check if connected wallet is an admin wallet
      if (normalizedAdminWallets.includes(normalizedWalletAddress)) {
        toast({
          title: "🎉 Admin Access Granted",
          description: "Welcome to the admin dashboard",
        })

        setTimeout(() => {
          router.push("/admin")
        }, 1000)
      } else {
        toast({
          title: "🚫 Access Denied",
          description: "This wallet does not have admin privileges",
          variant: "destructive",
        })
        
        // Disconnect the wallet if not admin
        setTimeout(() => {
          disconnect()
          setIsVerifying(false)
        }, 2000)
      }
    }
  }, [isWalletConnected, walletAddress, adminWallets, router, disconnect, isVerifying])

  const handleConnectWallet = () => {
    setIsWalletDialogOpen(true)
  }

  const handleDisconnect = () => {
    disconnect()
    setIsVerifying(false)
    toast({
      title: "👋 Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
     
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white mb-6 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Store</span>
            </Link>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-lg">W3</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Admin Access
                </h1>
                <div className="text-sm text-blue-400">Secure Portal</div>
              </div>
            </div>
            <p className="text-gray-400">Connect your admin wallet to access the dashboard</p>
          </div>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center bg-gray-800/30 border-b border-gray-800">
              <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-xl">
                {isWalletConnected ? (
                  <CheckCircle className="h-8 w-8 text-green-400 animate-pulse" />
                ) : (
                  <Shield className="h-8 w-8 text-blue-400" />
                )}
              </div>
              <CardTitle className="text-white text-xl">
                {isWalletConnected ? "🎉 Wallet Connected" : "🔐 Connect Admin Wallet"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {!isWalletConnected ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-6">Connect your Starknet wallet to verify admin access</p>
                    <Button
                      onClick={handleConnectWallet}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl"
                      disabled={status === 'connecting' || isVerifying}
                      size="lg"
                    >
                      <Wallet className="h-5 w-5 mr-2" />
                      {status === 'connecting' ? (
                        <>
                          <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : isVerifying ? (
                        <>
                          <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Connect Starknet Wallet"
                      )}
                    </Button>
                  </div>

                  <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700 backdrop-blur-sm">
                    <p className="text-sm text-gray-300 mb-3 font-medium">✨ Supported Wallets:</p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>ArgentX</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Braavos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Starknet Wallet</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                    <p className="text-sm text-blue-300 mb-2 font-medium">
                      <Sparkles className="h-4 w-4 inline mr-2" />
                      Admin Access:
                    </p>
                    <p className="text-xs text-blue-400">
                      Only authorized admin wallets can access the dashboard
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/30 mb-6 backdrop-blur-sm">
                      <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3 animate-bounce" />
                      <p className="text-sm text-green-300 font-medium">🎉 Admin Access Verified</p>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
                      <p className="text-xs text-gray-400 mb-2">Connected Wallet:</p>
                      <p className="font-mono text-sm text-white break-all bg-gray-900/50 p-2 rounded">
                        {walletAddress}
                      </p>
                    </div>

                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      size="sm"
                    >
                      Disconnect Wallet
                    </Button>

                    <p className="text-sm text-gray-400 mt-6 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Redirecting to admin dashboard...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Badge className="bg-gray-800/50 text-blue-400 border-gray-700 px-4 py-2 backdrop-blur-sm">
              🔒 Wallet-Based Authentication
            </Badge>
          </div>

          <div className="mt-6 text-center">
            <div className="flex justify-center space-x-3">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1">Starknet</Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1">Sepolia Testnet</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Connect Dialog */}
      <WalletConnectDialog 
        isOpen={isWalletDialogOpen} 
        setIsOpen={setIsWalletDialogOpen} 
      />
    </div>
  )
}
