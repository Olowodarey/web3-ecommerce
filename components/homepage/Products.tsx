"use client"
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShoppingCart , Zap} from "lucide-react"
import { useState } from "react"
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


const Product = () => {


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
    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="mb-16 text-center">
      <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
        ✨ Featured Products
      </h2>
      <p className="text-gray-400 text-xl">Discover unique digital assets and Web3 products</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Card
          key={product.id}
          className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm rounded-2xl overflow-hidden group"
        >
          <CardHeader className="p-0 relative">
            {product.featured && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-xs font-bold">
                  <Star className="h-3 w-3 mr-1" />
                  FEATURED
                </Badge>
              </div>
            )}
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="text-xl mb-3 text-white group-hover:text-blue-300 transition-colors duration-300">
              {product.name}
            </CardTitle>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{product.description}</p>
            <div className="flex justify-between items-center mb-6">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {product.price} ETH
              </span>
              <Badge
                variant={product.stock > 0 ? "default" : "destructive"}
                className={`${
                  product.stock > 0
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    : ""
                } transition-all duration-300`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex flex-col space-y-3">
            <Button
              onClick={() => addToCart(product)}
              variant="outline"
              className="w-full h-11 border-gray-600 bg-gray-800/80 text-white hover:bg-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={() => buyNow(product)}
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
              disabled={product.stock === 0}
            >
              <Zap className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </main>
  )
}

export default Product