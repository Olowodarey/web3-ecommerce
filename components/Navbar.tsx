"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { useAccount } from "@starknet-react/core";
import WalletConnectDialog from "./connectwallet/WalletConnectDialog";
import Account from "./connectwallet/Accoiunt";
import Cartitems from "./cart/Cartitems";
import ContractBalance from "./navbar/ContractBalance";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { account, isConnected } = useAccount();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <header className="relative z-40 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
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

          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8">
            <Link
              href="#"
              className="text-white hover:text-blue-400 transition-all duration-300 font-medium relative group py-2"
            >
              Products
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/purchases"
              className="text-gray-400 hover:text-white transition-all duration-300 font-medium relative group py-2"
            >
              My Purchases
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-all duration-300 font-medium relative group py-2"
            >
              About
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/admin/login"
              className="text-gray-400 hover:text-white transition-all duration-300 font-medium relative group py-2"
            >
              Admin
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Contract Balance Display */}
            <ContractBalance />
            
            <div>
              {isConnected && account ? (
                <Account />
              ) : (
                <Button
                  onClick={() => setIsOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20 border-0"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <Cartitems />
            </Sheet>

            <WalletConnectDialog isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
