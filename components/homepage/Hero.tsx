"use client"
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Lock, Zap, Globe, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from "@/hooks/use-toast"

interface Product {
    id: number
    name: string
    price: number
    image: string
    description: string
    stock: number
    featured?: boolean
  }


interface CartItem extends Product {
    quantity: number
  }


const Hero = () => {

      const [cart, setCart] = useState<CartItem[]>([])
      const [isWalletConnected, setIsWalletConnected] = useState(false)
      const [walletAddress, setWalletAddress] = useState("")
      const [tokenBalance, setTokenBalance] = useState(1.5)
      const [isCartOpen, setIsCartOpen] = useState(false)

    const connectWallet = async () => {
        setIsWalletConnected(true)
        setWalletAddress("0x1234...5678")
        toast({
          title: "🎉 Wallet Connected",
          description: "Successfully connected to Starknet on Sepolia testnet",
        })
      }


  return (
    <section className="relative py-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto text-center">
      {/* Animated Network Badges */}
      <div className="flex justify-center space-x-6 mb-12">
        <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30 px-6 py-3 text-sm font-medium backdrop-blur-sm hover:scale-105 transition-all duration-300">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" />
          Sepolia Testnet
        </Badge>
      </div>

      {/* Enhanced Main Title */}
      <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          Next-Gen
        </span>
        <br />
        <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Web3 Commerce
        </span>
      </h1>

      {/* Enhanced Subtitle */}
      <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
        Shop with confidence using <span className="text-blue-400 font-semibold">Starknet's secure Layer 2</span>{" "}
        technology. <span className="text-orange-400 font-semibold">Fast transactions</span>,{" "}
        <span className="text-green-400 font-semibold">low fees</span>, and{" "}
        <span className="text-purple-400 font-semibold">complete decentralization</span>.
      </p>

      {/* Enhanced Feature Points */}
      <div className="flex flex-wrap justify-center gap-12 mb-16">
        <div className="flex items-center space-x-3 text-blue-400 bg-blue-500/10 px-6 py-3 rounded-full border border-blue-500/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
          <Lock className="h-6 w-6" />
          <span className="font-medium">Secure Payments</span>
        </div>
        <div className="flex items-center space-x-3 text-orange-400 bg-orange-500/10 px-6 py-3 rounded-full border border-orange-500/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
          <Zap className="h-6 w-6" />
          <span className="font-medium">Lightning Fast</span>
        </div>
        <div className="flex items-center space-x-3 text-purple-400 bg-purple-500/10 px-6 py-3 rounded-full border border-purple-500/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
          <Globe className="h-6 w-6" />
          <span className="font-medium">Global Access</span>
        </div>
      </div>

     

  
    </div>
  </section>
  )
}

export default Hero