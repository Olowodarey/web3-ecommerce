import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Wallet, ShoppingCart, Award, Zap, Shield, Globe } from 'lucide-react'

const AboutPage = () => {
  return (
    <div >
      {/* Hero Section */}
      <section className="relative py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-gray-800/40 text-gray-300 border-gray-600/50 px-6 py-3 text-sm font-medium backdrop-blur-sm mb-8">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 animate-pulse" />
            Powered by Starknet
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
            Web3 E-Commerce Store
          </h1>
          
          <p className="text-xl text-gray-300 mb-1 leading-relaxed">
            Experience the future of decentralized shopping with our Starknet-powered e-commerce platform. 
            Buy products with STRK tokens and receive NFT receipts for every purchase.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            
            {/* Project Overview */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-white">
                  <ShoppingCart className="mr-3 h-6 w-6 text-blue-400" />
                  About This Project
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  This is a <strong className="text-white">decentralized e-commerce platform</strong> built on Starknet, 
                  showcasing the power of blockchain technology for online shopping.
                </p>
                <p>
                  Our platform features <strong className="text-blue-400">smart contract integration</strong> for 
                  secure payments, <strong className="text-green-400">live oracle price feeds</strong> for accurate 
                  STRK token pricing, and <strong className="text-purple-400">NFT receipt minting</strong> for 
                  purchase verification.
                </p>
                <p>
                  Built with <strong className="text-cyan-400">Next.js</strong>, <strong className="text-orange-400">Cairo smart contracts</strong>, 
                  and <strong className="text-pink-400">Redux Toolkit</strong> for state management.
                </p>
              </CardContent>
            </Card>

            {/* Wallet Requirements */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-white">
                  <Wallet className="mr-3 h-6 w-6 text-orange-400" />
                  Wallet Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  To interact with this platform, you need a <strong className="text-white">Starknet-compatible wallet</strong>:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                    <strong className="text-orange-400">Argent X</strong> (Recommended)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    <strong className="text-blue-400">Braavos Wallet</strong>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    Any Starknet-supported wallet
                  </li>
                </ul>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                  <p className="text-yellow-300 text-sm">
                    <strong>Important:</strong> Make sure to switch your wallet to <strong>Sepolia Testnet</strong> 
                    before making any transactions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testnet Setup */}
          <Card className="bg-gray-900/30 border-gray-700/50 mb-16">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-white">
                <Globe className="mr-3 h-6 w-6 text-gray-400" />
                Get Sepolia Testnet Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-400">
                This platform operates on <strong className="text-gray-200">Starknet Sepolia Testnet</strong>. 
                You'll need testnet STRK tokens to make purchases.
              </p>
              
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">How to Get Testnet Tokens:</h3>
                <ol className="space-y-3 text-gray-400 ml-4">
                  <li className="flex items-start">
                    <span className="bg-gray-600 text-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 font-medium">1</span>
                    Switch your wallet to Sepolia Testnet
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-600 text-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 font-medium">2</span>
                    Visit the Starknet Faucet
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-600 text-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 font-medium">3</span>
                    Enter your wallet address and request tokens
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-600 text-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 font-medium">4</span>
                    Wait for tokens to arrive in your wallet
                  </li>
                </ol>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  asChild
                  className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 text-lg font-semibold border border-gray-600 transition-all duration-300"
                >
                  <a href="https://starknet-faucet.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Get Sepolia Testnet Tokens
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-white">
                  <Zap className="mr-3 h-5 w-5 text-yellow-400" />
                  Smart Contracts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>Secure, transparent transactions powered by Cairo smart contracts on Starknet.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-white">
                  <Shield className="mr-3 h-5 w-5 text-green-400" />
                  Live Price Feeds
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>Real-time STRK token pricing using Pragma Oracle for accurate payment calculations.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-white">
                  <Award className="mr-3 h-5 w-5 text-purple-400" />
                  NFT Receipts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>Every purchase generates a unique NFT receipt that you can mint and own forever.</p>
              </CardContent>
            </Card>
          </div>

          {/* NFT Information */}
          <Card className="bg-gray-900/30 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-white">
                <Award className="mr-3 h-6 w-6 text-gray-400" />
                NFT Purchase Receipts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                One of the unique features of our platform is the <strong className="text-gray-200">NFT receipt system</strong>. 
                Every time you make a purchase, the transaction details are stored on-chain and you can mint an 
                <strong className="text-gray-300"> NFT receipt</strong> as proof of purchase.
              </p>
              
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">NFT Receipt Features:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-3" />
                    <strong className="text-gray-300">Permanent Proof:</strong> Immutable record of your purchase
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-3" />
                    <strong className="text-gray-300">Collectible:</strong> Each receipt is a unique NFT you can own
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-3" />
                    <strong className="text-gray-300">Detailed Info:</strong> Contains product details, price, and timestamp
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-3" />
                    <strong className="text-gray-300">Transferable:</strong> Can be transferred or traded like any NFT
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800/20 border border-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-gray-300">How it works:</strong> After making a purchase, you'll see an option to mint your receipt as an NFT. 
                  This creates a permanent, blockchain-verified record of your transaction that you can keep forever!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default AboutPage