"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { addToCart, Product } from '@/lib/features/cart/cartSlice';
import { toast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  disabled = false,
}) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Check if product is already in cart
  const existingItem = cartItems.find(item => item.id === product.id);
  const isInCart = !!existingItem;
  
  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart(product));
    
    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const isDisabled = disabled || product.stock <= 0;

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={`${className} ${isInCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
      disabled={isDisabled}
    >
      {showIcon && (
        isInCart ? (
          <Plus className="w-4 h-4 mr-2" />
        ) : (
          <ShoppingCart className="w-4 h-4 mr-2" />
        )
      )}
      {isInCart ? `Add More (${existingItem?.quantity})` : 'Add to Cart'}
    </Button>
  );
};

export default AddToCartButton;
