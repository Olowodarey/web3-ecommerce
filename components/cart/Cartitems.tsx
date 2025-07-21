"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Sparkles } from "lucide-react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  featured?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const Cartitems = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState(1.5);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const connectWallet = async () => {
    setIsWalletConnected(true);
    setWalletAddress("0x1234...5678");
    toast({
      title: "🎉 Wallet Connected",
      description: "Successfully connected to Starknet on Sepolia testnet",
    });
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const buyNow = (product: Product) => {
    if (!isWalletConnected) {
      toast({
        title: "🔐 Wallet Required",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      });
      return;
    }

    if (tokenBalance < product.price) {
      toast({
        title: "💰 Insufficient Balance",
        description: "You don't have enough tokens for this purchase",
        variant: "destructive",
      });
      return;
    }

    setTokenBalance((prev) => prev - product.price);
    toast({
      title: "🚀 Purchase Successful",
      description: `Successfully purchased ${product.name}`,
    });
  };

  const checkout = () => {
    if (!isWalletConnected) {
      toast({
        title: "🔐 Wallet Required",
        description: "Please connect your wallet to checkout",
        variant: "destructive",
      });
      return;
    }

    const total = getTotalPrice();
    if (tokenBalance < total) {
      toast({
        title: "💰 Insufficient Balance",
        description: "You don't have enough tokens for this purchase",
        variant: "destructive",
      });
      return;
    }

    setTokenBalance((prev) => prev - total);
    setCart([]);
    setIsCartOpen(false);
    toast({
      title: "🎉 Order Successful",
      description: "Your order has been processed successfully",
    });
  };

  return (
    <>
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
          <SheetTitle className="text-white text-xl">
            🛒 Shopping Cart
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Your cart is empty</p>
              <p className="text-gray-500 text-sm">
                Add some amazing products!
              </p>
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
                    <p className="text-sm text-blue-400 font-mono">
                      {item.price} ETH
                    </p>
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
                    <span className="w-8 text-center text-white font-medium">
                      {item.quantity}
                    </span>
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
    </>
  );
};

export default Cartitems;
