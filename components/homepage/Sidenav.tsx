"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Sparkles, Lock } from 'lucide-react'
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

const Sidenav = () => {

    const [products] = useState<Product[]>([
        {
          id: 1,
          name: "Digital Art NFT #001",
          price: 0.05,
          image: "/placeholder.svg?height=300&width=300",
          description: "Unique digital artwork on Starknet",
          stock: 1,
          featured: true,
        },
        {
          id: 2,
          name: "Gaming Token Pack",
          price: 0.1,
          image: "/placeholder.svg?height=300&width=300",
          description: "Premium gaming tokens for Web3 games",
          stock: 50,
          featured: true,
        },
        {
          id: 3,
          name: "Starknet Merchandise",
          price: 0.03,
          image: "/placeholder.svg?height=300&width=300",
          description: "Official Starknet branded items",
          stock: 25,
        },
        {
          id: 4,
          name: "DeFi Access Pass",
          price: 0.2,
          image: "/placeholder.svg?height=300&width=300",
          description: "Premium DeFi protocol access",
          stock: 10,
          featured: true,
        },
        {
          id: 5,
          name: "Web3 Course Bundle",
          price: 0.15,
          image: "/placeholder.svg?height=300&width=300",
          description: "Complete Web3 development course",
          stock: 100,
        },
        {
          id: 6,
          name: "Crypto Collectible",
          price: 0.08,
          image: "/placeholder.svg?height=300&width=300",
          description: "Rare crypto collectible item",
          stock: 5,
        },
      ])
    
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
    
      const addToCart = (product: Product) => {
        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.id === product.id)
          if (existingItem) {
            return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
          }
          return [...prevCart, { ...product, quantity: 1 }]
        })
        toast({
          title: "✨ Added to Cart",
          description: `${product.name} has been added to your cart`,
        })
      }
    
      const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity === 0) {
          setCart((prevCart) => prevCart.filter((item) => item.id !== id))
        } else {
          setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
        }
      }
    
      const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
      }
    
      const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
      }
    
      const buyNow = (product: Product) => {
        if (!isWalletConnected) {
          toast({
            title: "🔐 Wallet Required",
            description: "Please connect your wallet to make a purchase",
            variant: "destructive",
          })
          return
        }
    
        if (tokenBalance < product.price) {
          toast({
            title: "💰 Insufficient Balance",
            description: "You don't have enough tokens for this purchase",
            variant: "destructive",
          })
          return
        }
    
        setTokenBalance((prev) => prev - product.price)
        toast({
          title: "🚀 Purchase Successful",
          description: `Successfully purchased ${product.name}`,
        })
      }
    
      const checkout = () => {
        if (!isWalletConnected) {
          toast({
            title: "🔐 Wallet Required",
            description: "Please connect your wallet to checkout",
            variant: "destructive",
          })
          return
        }
    
        const total = getTotalPrice()
        if (tokenBalance < total) {
          toast({
            title: "💰 Insufficient Balance",
            description: "You don't have enough tokens for this purchase",
            variant: "destructive",
          })
          return
        }
    
        setTokenBalance((prev) => prev - total)
        setCart([])
        setIsCartOpen(false)
        toast({
          title: "🎉 Order Successful",
          description: "Your order has been processed successfully",
        })
      }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 space-y-3">
    <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-3 space-y-2 border border-gray-800 shadow-2xl">
      <Button
        size="sm"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-sm px-3 py-2"
      >
        <Sparkles className="h-3 w-3 mr-2" />
        Home
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="w-full text-white hover:bg-gray-800 transition-all duration-300 relative text-sm px-3 py-2"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart className="h-3 w-3 mr-2" />
        Cart ({getTotalItems()})
        {getTotalItems() > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xs animate-bounce">
            {getTotalItems()}
          </div>
        )}
      </Button>
      <Button
        asChild
        size="sm"
        variant="ghost"
        className="w-full text-white hover:bg-gray-800 transition-all duration-300 text-sm px-3 py-2"
      >
        <a href="/admin/login">
          <Lock className="h-3 w-3 mr-2" />
          Admin
        </a>
      </Button>
    </div>
  </div>
  )
}

export default Sidenav