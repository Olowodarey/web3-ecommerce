"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Contract, Provider, constants } from "starknet";
import { StoreAbi } from "@/constants/abi";
import { STORE_CONTRACT_ADDRESS } from "@/constants";
import BuyNowButton from "@/components/BuyNowButton";

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

interface ContractProduct {
  id: number;
  productname: string;
  price: number;
  quantity: number;
  Img: string;
}

const Product = () => {
  const [lastToastTime, setLastToastTime] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [strkPrice, setStrkPrice] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Check wallet connection on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Check if wallet is connected
  const checkWalletConnection = async () => {
    try {
      const starknet = (window as any).starknet;
      if (starknet?.isConnected) {
        setIsWalletConnected(true);
        const accounts = await starknet.account.address;
        setWalletAddress(accounts);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      const starknet = (window as any).starknet;
      if (!starknet) {
        toast({
          title: "Wallet Not Found",
          description: "Please install ArgentX or Braavos wallet",
          variant: "destructive",
        });
        return;
      }

      await starknet.enable();
      setIsWalletConnected(true);
      const accounts = await starknet.account.address;
      setWalletAddress(accounts);

      toast({
        title: "🎉 Wallet Connected!",
        description: "You can now make purchases with STRK tokens",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  // Function to calculate STRK amount needed for USD price
  const calculateStrkAmount = (usdPrice: number): string => {
    if (!strkPrice) return "Loading...";
    const strkAmount = usdPrice / strkPrice;
    return strkAmount.toFixed(4);
  };

  // Fetch live STRK price from CoinGecko API
  const fetchStrkPrice = async () => {
    try {
      console.log("Fetching live STRK price from CoinGecko...");

      // Fetch real live STRK price from CoinGecko API
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=starknet&vs_currencies=usd"
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("CoinGecko API response:", data);

      if (data.starknet && data.starknet.usd) {
        const livePrice = data.starknet.usd;
        setStrkPrice(livePrice);
        console.log("✅ Live STRK price updated:", `$${livePrice}`);

        const now = Date.now();
        if (now - lastToastTime > 3600000) { // 1 hour in ms
          toast({
            title: "📈 Live Price Updated",
            description: `STRK price: $${livePrice.toFixed(4)}`,
          });
          setLastToastTime(now);
        }
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (error) {
      console.error("❌ Error fetching live STRK price:", error);

      // Fallback to realistic market price if API fails
      const fallbackPrice = 0.125;
      setStrkPrice(fallbackPrice);

      toast({
        title: "⚠️ Using Fallback Price",
        description: `API unavailable. Using fallback: $${fallbackPrice}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Fetch initial price
    fetchStrkPrice();

    // Set up periodic price updates every 30 seconds for live pricing
    const priceUpdateInterval = setInterval(() => {
      fetchStrkPrice();
    }, 30000); // Update every 30 seconds

    // Cleanup interval on component unmount
    return () => {
      clearInterval(priceUpdateInterval);
      console.log("🔄 Live price updates stopped");
    };
  }, []);

  // Fetch products from contract
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Initialize Starknet provider
        const provider = new Provider({
          nodeUrl: "https://starknet-sepolia.blastapi.io/cb15156d-9e8d-4a8b-aa9a-81d8de0e09a7/rpc/v0_8",
        });

        // Initialize contract
        const contract = new Contract(
          StoreAbi[0],
          STORE_CONTRACT_ADDRESS,
          provider
        );

        console.log("Fetching products from contract...");

        // Call the get_all_items function
        const response = await contract.get_all_items();
        console.log("Contract response:", response);

        // Transform the contract response to match our Product interface
        const formattedProducts: Product[] = response.map((item: any) => ({
          id: Number(item.id.toString()),
          name: item.productname.toString(),
          price: Number(item.price.toString()) / 100, // Convert cents to dollars
          image: item.Img.toString(),
          description: `High-quality product with ID ${item.id}`,
          stock: Number(item.quantity.toString()),
          featured: Number(item.id.toString()) <= 2, // Mark first 2 as featured
        }));

        setProducts(formattedProducts);

        toast({
          title: "✅ Products Loaded",
          description: `Successfully loaded ${formattedProducts.length} products from blockchain`,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "❌ Error",
          description: "Failed to fetch products from the contract",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add to cart function
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    toast({
      title: "✨ Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  // Buy functionality has been moved to the BuyNowButton component

  return (
    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
          ✨ Featured Products
        </h2>
        <p className="text-gray-400 text-xl">
          Discover unique digital assets and Web3 products
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No products available</p>
            </div>
          ) : (
            products.map((product) => (
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
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-left">
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)} USD
                      </span>
                      <div className="text-sm text-gray-400 mt-1">
                        ≈ {calculateStrkAmount(product.price)} STRK
                      </div>
                    </div>
                    <Badge
                      variant={product.stock > 0 ? "default" : "destructive"}
                      className={`${
                        product.stock > 0
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          : ""
                      } transition-all duration-300`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
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
                  <BuyNowButton 
                    product={product}
                    strkPrice={strkPrice || undefined}
                    onPurchaseSuccess={() => {
                      // Refresh products after successful purchase
                      window.location.reload() // Simple refresh for now
                    }}
                  />
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default Product;
