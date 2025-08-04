"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { shortString } from "starknet";
import { STORE_CONTRACT_ADDRESS } from "@/constants";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  sales: number;
  image: string;
}

interface AddProductDialogProps {
  onAddProduct: (product: Omit<Product, "id" | "sales">) => void;
}

export default function AddProductDialog({
  onAddProduct,
}: AddProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    image: "",
  });

  const { account } = useAccount();
  const { sendAsync, isPending } = useSendTransaction({});

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!account) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert price to cents (multiply by 100)
      const priceInCents = Math.round(
        Number.parseFloat(newProduct.price) * 100
      );
      const quantity = Number.parseInt(newProduct.stock);

      // Convert strings to felt252 format for Cairo using shortString
      const productNameFelt = shortString.encodeShortString(newProduct.name);
      const imageFelt = shortString.encodeShortString(
        newProduct.image || "/placeholder.svg?height=100&width=100"
      );

      console.log("String conversions:", {
        originalName: newProduct.name,
        convertedName: productNameFelt,
        originalImage:
          newProduct.image || "/placeholder.svg?height=100&width=100",
        convertedImage: imageFelt,
      });

      // Prepare the contract call
      const calls = [
        {
          contractAddress: STORE_CONTRACT_ADDRESS,
          entrypoint: "add_item",
          calldata: [
            productNameFelt, // productname: felt252
            priceInCents, // price: u32 (in cents)
            quantity, // quantity: u32
            imageFelt, // Img: felt252
          ],
        },
      ];

      console.log("Adding product to contract:", {
        name: productNameFelt,
        price: priceInCents,
        quantity,
        image: imageFelt,
      });

      // Send transaction
      const result = await sendAsync(calls);

      console.log("Transaction sent:", result.transaction_hash);

      // Create product object for local state update
      const product = {
        name: newProduct.name,
        price: Number.parseFloat(newProduct.price),
        description: newProduct.description,
        stock: quantity,
        image: newProduct.image || "/placeholder.svg?height=100&width=100",
      };

      // Update local state
      onAddProduct(product);

      // Reset form and close dialog
      setNewProduct({
        name: "",
        price: "",
        description: "",
        stock: "",
        image: "",
      });
      setIsOpen(false);

      toast({
        title: "🎉 Product Added!",
        description: `Product "${newProduct.name}" has been added to the blockchain`,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "❌ Error",
        description:
          "Failed to add product to the blockchain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: "",
      description: "",
      stock: "",
      image: "",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">
              Product Name *
            </Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Enter product name"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-gray-300">
              Price (ETH) *
            </Label>
            <Input
              id="price"
              type="number"
              step="0.001"
              min="0"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              placeholder="0.000"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="stock" className="text-gray-300">
              Stock Quantity *
            </Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
              placeholder="Enter stock quantity"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              placeholder="Enter product description"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-gray-300">
              Image URL
            </Label>
            <Input
              id="image"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
              placeholder="Enter image URL (optional)"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleAddProduct}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting || isPending}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding to Blockchain...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              disabled={isSubmitting || isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
