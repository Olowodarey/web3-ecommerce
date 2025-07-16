import React from 'react'
import { Star } from "lucide-react"
import { Zap } from "lucide-react"
import { Lock } from "lucide-react"

const Footer = () => {
  return (
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
  )
}

export default Footer