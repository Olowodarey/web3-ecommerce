"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Wallet, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function AdminLogin() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const router = useRouter()

  const adminWallets = [
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdef1234567890abcdef1234567890abcdef12",
    "0x9876543210fedcba9876543210fedcba98765432",
  ]

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockAddress = "0x1234567890abcdef1234567890abcdef12345678"
      setWalletAddress(mockAddress)
      setIsWalletConnected(true)

      if (adminWallets.includes(mockAddress)) {
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
        setIsWalletConnected(false)
        setWalletAddress("")
      }
    } catch (error) {
      toast({
        title: "❌ Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }

    setIsConnecting(false)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Clean Background with Subtle Glow Effects */}
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
                      onClick={connectWallet}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl"
                      disabled={isConnecting}
                      size="lg"
                    >
                      <Wallet className="h-5 w-5 mr-2" />
                      {isConnecting ? (
                        <>
                          <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                          Connecting...
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
                      Demo Mode:
                    </p>
                    <p className="text-xs text-blue-400">
                      This demo will simulate connecting with an admin wallet address
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
    </div>
  )
}
