"use client"

import { useState } from "react"
import { ShoppingCart, Wallet, Plus, Minus, Zap, Globe, Lock, ArrowRight, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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

export default function EcommercePage() {
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden pr-24">
      {/* Clean Background with Subtle Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Side Navigation - Fixed positioning */}
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

      {/* Enhanced Header */}
      <header className="relative z-40 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">W3</span>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Web3 Store
                  </span>
                  <div className="text-xs text-blue-400">Next-Gen Commerce</div>
                </div>
              </div>

              <nav className="hidden md:flex space-x-8">
                <a
                  href="#"
                  className="text-white hover:text-blue-400 transition-all duration-300 font-medium relative group"
                >
                  Products
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300 font-medium relative group"
                >
                  About
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </a>
                <a
                  href="/admin/login"
                  className="text-gray-400 hover:text-white transition-all duration-300 font-medium relative group"
                >
                  Admin
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {isWalletConnected && (
                <div className="text-sm text-right bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                  <div className="font-medium text-white">{walletAddress}</div>
                  <div className="text-blue-400 font-mono">{tokenBalance.toFixed(3)} ETH</div>
                </div>
              )}

              <Button
                onClick={connectWallet}
                className={`${
                  isWalletConnected
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-500/25"
                    : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-orange-500/25"
                } text-white transition-all duration-300 transform hover:scale-105`}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isWalletConnected ? "Connected" : "Connect Starknet"}
              </Button>

              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative border-gray-700 bg-gray-900/50 hover:bg-gray-800 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingCart className="h-5 w-5 text-white" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-900/95 border-gray-800 backdrop-blur-xl">
                  <SheetHeader>
                    <SheetTitle className="text-white text-xl">🛒 Shopping Cart</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Your cart is empty</p>
                        <p className="text-gray-500 text-sm">Add some amazing products!</p>
                      </div>
                    ) : (
                      <>
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 p-4 border border-gray-800 rounded-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300"
                          >
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg shadow-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-white">{item.name}</h3>
                              <p className="text-sm text-blue-400 font-mono">{item.price} ETH</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 w-8 h-8 transition-all duration-300"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3 text-white" />
                              </Button>
                              <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 w-8 h-8 transition-all duration-300"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3 text-white" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Separator className="bg-gray-800" />
                        <div className="space-y-4">
                          <div className="flex justify-between text-xl font-bold text-white bg-gray-800/50 p-4 rounded-xl">
                            <span>Total: {getTotalPrice().toFixed(3)} ETH</span>
                          </div>
                          <Button
                            onClick={checkout}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                            size="lg"
                          >
                            <Sparkles className="h-5 w-5 mr-2" />
                            Checkout Now
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Network Badges */}
          <div className="flex justify-center space-x-6 mb-12">
            <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30 px-6 py-3 text-sm font-medium backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse" />
              Starknet Mainnet
            </Badge>
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

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button
              onClick={connectWallet}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-6 text-xl font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl"
            >
              <Wallet className="mr-3 h-6 w-6" />
              Connect Starknet Wallet
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 px-10 py-6 text-xl font-semibold bg-gray-900/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 rounded-xl"
            >
              <Star className="mr-3 h-6 w-6" />
              Browse Catalog
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                500+
              </div>
              <div className="text-gray-400 font-medium">Products</div>
            </div>
            <div className="text-center bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                50K+
              </div>
              <div className="text-gray-400 font-medium">Transactions</div>
            </div>
            <div className="text-center bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                99.9%
              </div>
              <div className="text-gray-400 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Grid */}
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

      {/* Enhanced Footer */}
      <footer className="relative bg-gray-900/50 border-t border-gray-800 py-16 mt-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">W3</span>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Web3 Store
                  </span>
                  <div className="text-xs text-blue-400">Next-Gen Commerce</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The future of ecommerce powered by Starknet and Web3 technology. Experience seamless, secure, and
                decentralized shopping.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">🌐 Supported Networks</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Starknet Mainnet</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Sepolia Testnet</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Layer 2 Scaling</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">✨ Features</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>NFT Marketplace</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>Token Payments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>Decentralized Storage</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 Web3 Store. Built with ❤️ on Starknet.
              <span className="text-blue-400 ml-2">Powered by the future of commerce.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
