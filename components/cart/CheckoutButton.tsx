"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { clearCart } from '@/lib/features/cart/cartSlice';
import { toast } from '@/hooks/use-toast';
import { useAccount, useSendTransaction } from '@starknet-react/core';
import { Contract, uint256 } from 'starknet';
import { StoreAbi } from '@/constants/abi';
import { STORE_CONTRACT_ADDRESS, STRK_TOKEN_ADDRESS } from '@/constants';

// ERC20 ABI for token approval
const ERC20_ABI = [
  {
    "name": "approve",
    "type": "function",
    "inputs": [
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [
      {
        "type": "core::bool"
      }
    ],
    "state_mutability": "external"
  },
  {
    "name": "allowance",
    "type": "function",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [
      {
        "type": "core::integer::u256"
      }
    ],
    "state_mutability": "view"
  }
];

interface CheckoutButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  disabled?: boolean;
  onCheckoutSuccess?: () => void;
  strkPrice?: number;
}

interface ContractCartItem {
  product_id: number;
  quantity: number;
  expected_price: number; // Price in cents
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  disabled = false,
  onCheckoutSuccess,
  strkPrice,
}) => {
  const dispatch = useAppDispatch();
  const { items: cartItems, totalItems, totalPrice } = useAppSelector((state) => state.cart);
  const { account, status } = useAccount();
  const isConnected = status === 'connected';
  const [isProcessing, setIsProcessing] = useState(false);

  const { sendAsync } = useSendTransaction({});

  // Helper function to check current allowance
  const checkAllowance = async (requiredAmount: bigint): Promise<boolean> => {
    try {
      if (!account) return false;

      const tokenContract = new Contract(ERC20_ABI, STRK_TOKEN_ADDRESS, account);
      const allowanceResult = await tokenContract.allowance(account.address, STORE_CONTRACT_ADDRESS);
      
      // Convert allowance to bigint for comparison
      const currentAllowance = BigInt(allowanceResult.toString());
      console.log("Current allowance:", currentAllowance.toString());
      console.log("Required amount:", requiredAmount.toString());
      
      return currentAllowance >= requiredAmount;
    } catch (error) {
      console.error("Error checking allowance:", error);
      return false;
    }
  };

  const handleCheckout = async () => {
    if (!isConnected || !account) {
      toast({
        title: "🔐 Wallet Required",
        description: "Please connect your wallet to checkout",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "🛒 Empty Cart",
        description: "Add some items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }



    setIsProcessing(true);

    try {
      // Convert cart items to contract format
      const contractCartItems: ContractCartItem[] = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        expected_price: Math.round(item.price * 100), // Convert to cents
      }));

      // Calculate required token amount with realistic oracle price assumption
      // Since oracle price is much higher than $0.5, use more realistic assumptions
      const fallbackStrkPrice = strkPrice || 2.0; // Assume $2.00 per STRK (more realistic)
      const strkAmount = totalPrice / fallbackStrkPrice; // USD / (USD per STRK) = STRK needed
      
      // Add 3x buffer to handle oracle price fluctuations (covers up to $6 per STRK)
      const bufferedStrkAmount = strkAmount * 4.0;
      const requiredAmount = BigInt(Math.ceil(bufferedStrkAmount * 10**18)); // Convert to wei
      const totalPaymentAmountCents = Math.round(totalPrice * 100);
      
      console.log("🛒 Processing checkout:", {
        cartItems: contractCartItems,
        totalPriceUSD: totalPrice,
        fallbackStrkPrice,
        strkAmountNeeded: strkAmount,
        bufferedStrkAmount,
        requiredTokenAmount: requiredAmount.toString(),
        requiredTokenAmountETH: (Number(requiredAmount) / 10**18).toFixed(6),
        totalPaymentAmountCents,
        itemCount: totalItems,
        bufferMultiplier: "3x",
        note: "Realistic $2.00 STRK price + 3x buffer (covers up to $6.00)"
      });

      // Check current allowance to determine if we need approval
      const hasAllowance = await checkAllowance(requiredAmount);
      
      // Prepare multicall: approval (if needed) + purchase
      const calls = [];
      
      if (!hasAllowance) {
        // Add approval call to multicall
        const formattedAmount = uint256.bnToUint256(requiredAmount);
        const approveCall = {
          contractAddress: STRK_TOKEN_ADDRESS,
          entrypoint: "approve",
          calldata: [STORE_CONTRACT_ADDRESS, formattedAmount.low.toString(), formattedAmount.high.toString()]
        };
        calls.push(approveCall);
        console.log("Adding approval to multicall:", approveCall);
      }

      // Add purchase call to multicall
      // Note: total_payment_amount should be STRK tokens (like buy_product payment_amount)
      const formattedPaymentAmount = uint256.bnToUint256(requiredAmount);
      
      const buyMultipleCall = {
        contractAddress: STORE_CONTRACT_ADDRESS,
        entrypoint: 'buy_multiple_products',
        calldata: [
          contractCartItems.length, // Array length
          ...contractCartItems.flatMap(item => [
            item.product_id,
            item.quantity,
            item.expected_price,
          ]),
          formattedPaymentAmount.low.toString(), // total STRK payment amount (low part)
          formattedPaymentAmount.high.toString(), // total STRK payment amount (high part)
        ],
      };
      calls.push(buyMultipleCall);
      console.log("Adding purchase to multicall:", buyMultipleCall);

      // Execute multicall transaction
      console.log("Executing multicall with", calls.length, "calls");
      const result = await sendAsync(calls);

      console.log("✅ Checkout transaction sent:", result.transaction_hash);

      // Clear the cart after successful purchase
      dispatch(clearCart());

      toast({
        title: "🎉 Purchase Successful!",
        description: `Successfully purchased ${totalItems} item${totalItems > 1 ? 's' : ''} for $${totalPrice.toFixed(2)}`,
      });

      // Call success callback if provided
      if (onCheckoutSuccess) {
        onCheckoutSuccess();
      }

    } catch (error: any) {
      console.error("❌ Checkout failed:", error);
      
      let errorMessage = "Transaction failed. Please try again.";
      
      if (error?.message?.includes("insufficient")) {
        errorMessage = "Insufficient balance for this purchase.";
      } else if (error?.message?.includes("rejected")) {
        errorMessage = "Transaction was rejected.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "❌ Checkout Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = disabled || cartItems.length === 0 || !isConnected || isProcessing;

  return (
    <Button
      onClick={handleCheckout}
      variant={variant}
      size={size}
      className={`${className} ${isProcessing ? 'opacity-75' : ''}`}
      disabled={isDisabled}
    >
      {isProcessing ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : showIcon ? (
        <CreditCard className="w-4 h-4 mr-2" />
      ) : null}
      
      {isProcessing 
        ? 'Processing...' 
        : `Checkout (${totalItems} item${totalItems !== 1 ? 's' : ''} - $${totalPrice.toFixed(2)})`
      }
    </Button>
  );
};

export default CheckoutButton;
