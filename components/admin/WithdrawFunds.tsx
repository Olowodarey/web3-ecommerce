"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { Contract, Provider } from "starknet";
import { StoreAbi } from "@/constants/abi";
import { STORE_CONTRACT_ADDRESS } from "@/constants";
import { 
  Wallet, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  TrendingDown 
} from "lucide-react";

const WithdrawFunds = () => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const { account } = useAccount();
  const { sendAsync, isPending } = useSendTransaction({});

  // Fetch contract balance
  const fetchContractBalance = async () => {
    try {
      setIsLoadingBalance(true);
      console.log("🔍 Starting contract balance fetch...");
      console.log("📋 Contract Address:", STORE_CONTRACT_ADDRESS);

      // Initialize Starknet provider
      const provider = new Provider({
        nodeUrl: "https://starknet-sepolia.blastapi.io/cb15156d-9e8d-4a8b-aa9a-81d8de0e09a7/rpc/v0_8",
      });

      console.log("🌐 Provider initialized");

      // Initialize contract with explicit Cairo version
      const contract = new Contract(
        StoreAbi,
        STORE_CONTRACT_ADDRESS,
        provider
      );

      console.log("📄 Contract initialized, calling get_contract_balance...");
      
      let response;
      try {
        // Try direct method call first
        response = await contract.get_contract_balance();
        console.log("📊 Raw contract balance response:", response);
      } catch (methodError: any) {
        console.log("⚠️ Method call failed, trying contract.call:", methodError.message);
        try {
          // Fallback to contract.call if direct method fails
          response = await contract.call('get_contract_balance');
          console.log("📊 Raw contract balance response (via call):", response);
        } catch (callError) {
          console.error("❌ Both method calls failed:", callError);
          throw callError;
        }
      }
      
      console.log("📊 Response type:", typeof response);
      console.log("📊 Response constructor:", response?.constructor?.name);
      
      // Handle different response formats
      let balanceValue = BigInt(0);
      
      // Handle BigInt response (like 16988099232565525504n)
      if (typeof response === 'bigint') {
        console.log("📊 Response is BigInt:", response.toString());
        balanceValue = response;
      } else if (Array.isArray(response) && response.length > 0) {
        console.log("📊 Response is array, first element:", response[0]);
        balanceValue = BigInt(response[0].toString());
      } else if (typeof response === 'object' && response !== null) {
        if ('low' in response && 'high' in response) {
          console.log("📊 Response has low/high parts:", { low: response.low, high: response.high });
          balanceValue = BigInt(response.low.toString()) + (BigInt(response.high.toString()) << BigInt(128));
        } else if (response.toString) {
          console.log("📊 Converting object to string:", response.toString());
          balanceValue = BigInt(response.toString());
        }
      } else {
        console.log("📊 Direct conversion:", response);
        balanceValue = BigInt(response.toString());
      }
      
      console.log("💰 Parsed balance value (wei):", balanceValue.toString());
      
      // Convert to STRK (18 decimals) - handle large numbers safely
      const balanceInWei = balanceValue.toString();
      const balanceInStrk = balanceInWei.length > 18 
        ? (Number(balanceInWei.slice(0, -18) + '.' + balanceInWei.slice(-18))).toFixed(6)
        : (Number(balanceInWei) / Math.pow(10, 18)).toFixed(6);
      
      setContractBalance(balanceInStrk);
      console.log("✅ Final contract balance:", balanceInStrk, "STRK");
      
      // Show success toast
      toast({
        title: "✅ Success",
        description: `Contract balance loaded: ${balanceInStrk} STRK`,
        variant: "default",
      });

    } catch (error: any) {
      console.error("Error fetching contract balance:", error);
      console.error("Error details:", {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      
      toast({
        title: "❌ Error",
        description: `Failed to fetch contract balance: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
      
      // Set balance to 0 on error
      setContractBalance("0");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Auto-populate recipient with connected wallet address
  useEffect(() => {
    if (account?.address) {
      setRecipientAddress(account.address);
    }
  }, [account]);

  // Fetch balance on component mount
  useEffect(() => {
    fetchContractBalance();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawAmount || !recipientAddress) {
      toast({
        title: "❌ Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!account) {
      toast({
        title: "❌ Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    // Validate withdrawal amount
    const amount = parseFloat(withdrawAmount);
    const balance = parseFloat(contractBalance);
    
    if (amount <= 0) {
      toast({
        title: "❌ Invalid Amount",
        description: "Withdrawal amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "❌ Insufficient Balance",
        description: `Cannot withdraw ${amount} STRK. Contract balance is ${balance} STRK`,
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);

    try {
      // Convert STRK amount to wei (multiply by 10^18)
      const amountInWei = Math.floor(amount * Math.pow(10, 18)).toString();

      console.log("Withdrawing funds:", {
        amount: withdrawAmount,
        amountInWei,
        recipient: recipientAddress,
      });

      // Convert u256 amount to low and high parts for proper serialization
      const amountBigInt = BigInt(amountInWei);
      const amountLow = (amountBigInt & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")).toString();
      const amountHigh = (amountBigInt >> BigInt(128)).toString();

      // Prepare the contract call
      const calls = [
        {
          contractAddress: STORE_CONTRACT_ADDRESS,
          entrypoint: "withdraw_tokens",
          calldata: [
            amountLow,        // u256 low part
            amountHigh,       // u256 high part
            recipientAddress, // recipient: ContractAddress
          ],
        },
      ];

      // Send transaction
      const result = await sendAsync(calls);

      console.log("Withdrawal transaction sent:", result.transaction_hash);

      toast({
        title: "🎉 Withdrawal Successful!",
        description: `Successfully withdrew ${withdrawAmount} STRK to ${recipientAddress.slice(0, 10)}...`,
      });

      // Reset form
      setWithdrawAmount("");
      
      // Refresh contract balance
      setTimeout(() => {
        fetchContractBalance();
      }, 3000);

    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast({
        title: "❌ Withdrawal Failed",
        description: "Failed to withdraw funds from contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleMaxWithdraw = () => {
    setWithdrawAmount(contractBalance);
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <TrendingDown className="h-5 w-5 text-red-400" />
          <span>Withdraw Contract Funds</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Withdraw STRK tokens from the contract balance to a specified address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Balance Display */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">Available Balance:</span>
            </div>
            <div className="text-right">
              {isLoadingBalance ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">
                    {contractBalance} STRK
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={fetchContractBalance}
                    className="text-xs text-blue-400 p-0 h-auto"
                  >
                    Refresh Balance
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-gray-300">
              Withdrawal Amount (STRK) *
            </Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="amount"
                type="number"
                step="0.000001"
                min="0"
                max={contractBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.000000"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleMaxWithdraw}
                disabled={isLoadingBalance || parseFloat(contractBalance) === 0}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                MAX
              </Button>
            </div>
            {withdrawAmount && parseFloat(withdrawAmount) > parseFloat(contractBalance) && (
              <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Amount exceeds available balance</span>
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="recipient" className="text-gray-300">
              Recipient Address *
            </Label>
            <Input
              id="recipient"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 mt-1"
            />
            {recipientAddress && account?.address && recipientAddress === account.address && (
              <p className="text-xs text-blue-400 mt-1 flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Withdrawing to your connected wallet</span>
              </p>
            )}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
            <div className="text-xs text-yellow-200">
              <p className="font-medium">Important:</p>
              <p>This action will transfer STRK tokens from the contract to the specified address. Make sure the recipient address is correct as this cannot be undone.</p>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          disabled={
            isWithdrawing || 
            isPending || 
            !withdrawAmount || 
            !recipientAddress || 
            parseFloat(withdrawAmount) <= 0 || 
            parseFloat(withdrawAmount) > parseFloat(contractBalance) ||
            parseFloat(contractBalance) === 0
          }
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {isWithdrawing || isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Withdrawal...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Withdraw {withdrawAmount || "0"} STRK
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WithdrawFunds;
