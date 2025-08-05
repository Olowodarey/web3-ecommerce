"use client";

import React, { useEffect, useState } from "react";
import { useReadContract } from "@starknet-react/core";
import { Contract, Provider } from "starknet";
import { StoreAbi } from "@/constants/abi";
import { STORE_CONTRACT_ADDRESS } from "@/constants";
import { Coins, TrendingUp } from "lucide-react";

const ContractBalance = () => {
  const [balance, setBalance] = useState<string>("0");
  const [usdValue, setUsdValue] = useState<string>("0.00");
  const [strkPrice, setStrkPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  // Fetch contract balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);

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

        console.log("Fetching contract balance...");

        // Call the get_contract_balance function
        const response = await contract.get_contract_balance();
        console.log("Contract balance response:", response);

        // Convert u256 balance to string (assuming it's in wei/smallest unit)
        const balanceValue = response.toString();
        
        // Convert from wei to STRK (divide by 10^18)
        const balanceInStrk = (Number(balanceValue) / Math.pow(10, 18)).toFixed(6);
        
        setBalance(balanceInStrk);
        console.log("Contract balance:", balanceInStrk, "STRK");
        
        // Calculate USD value if STRK price is available
        if (strkPrice) {
          const usdVal = (Number(balanceInStrk) * strkPrice).toFixed(2);
          setUsdValue(usdVal);
        }

      } catch (error) {
        console.error("Error fetching contract balance:", error);
        setError("Failed to fetch balance");
        setBalance("0");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();


    // Set up periodic balance updates every 30 seconds
    const balanceUpdateInterval = setInterval(() => {
      fetchBalance();
  
    }, 30000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(balanceUpdateInterval);
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-400 text-sm">
        <Coins className="h-4 w-4" />
        <span>Balance Error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          {isLoading ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Coins className="h-3 w-3 text-white" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 leading-none">Contract Balance</span>
          <div className="flex items-center space-x-1">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {isLoading ? "Loading..." : `${balance} STRK`}
              </span>
            
           
            </div>
            {!isLoading && Number(balance) > 0 && (
              <TrendingUp className="h-3 w-3 text-green-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractBalance;
