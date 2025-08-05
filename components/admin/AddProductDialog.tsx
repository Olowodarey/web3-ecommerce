"use client";

import { useState, useRef } from "react";
import { Plus, Loader2, Upload, Image, ExternalLink } from "lucide-react";
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
import { shortString, byteArray } from "starknet";
import { STORE_CONTRACT_ADDRESS } from "@/constants";
import { uploadToPinata, getIPFSUrl, isValidIPFSHash } from "@/lib/pinata";

// Number words to numeric conversion
const numberWords: { [key: string]: number } = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000, million: 1000000
};

// Convert number words to numeric value
function convertWordsToNumber(input: string): string {
  if (!input.trim()) return "";
  
  // If it's already a number, return as is
  if (!isNaN(Number(input))) return input;
  
  const words = input.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  let result = 0;
  let current = 0;
  
  for (const word of words) {
    if (numberWords[word] !== undefined) {
      const value = numberWords[word];
      
      if (value === 100) {
        current *= 100;
      } else if (value === 1000 || value === 1000000) {
        result += current * value;
        current = 0;
      } else {
        current += value;
      }
    }
  }
  
  result += current;
  return result > 0 ? result.toString() : input;
}

// Safely convert string to felt252 with proper validation
function safeEncodeToFelt252(input: string, fieldName: string): string {
  if (!input.trim()) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  
  const trimmedInput = input.trim();
  
  // Check length limit (31 characters max for felt252)
  if (trimmedInput.length > 31) {
    throw new Error(`${fieldName} "${trimmedInput}" is too long (${trimmedInput.length} chars). Max 31 characters for felt252.`);
  }
  
  // Check for non-ASCII characters
  if (!/^[\x00-\x7F]*$/.test(trimmedInput)) {
    throw new Error(`${fieldName} contains non-ASCII characters. Only ASCII characters are supported for felt252.`);
  }
  
  // Convert directly to felt252 without any prefixing or modification
  return shortString.encodeShortString(trimmedInput);
}

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
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { account } = useAccount();
  const { sendAsync, isPending } = useSendTransaction({});

  // Handle file upload to Pinata
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (PNG, JPG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      toast({
        title: "📤 Uploading to IPFS...",
        description: "Your image is being uploaded to Pinata IPFS",
      });

      const uploadResponse = await uploadToPinata(file);
      const ipfsHash = uploadResponse.IpfsHash;

      // Update the image field with IPFS hash
      setNewProduct({ ...newProduct, image: ipfsHash });
      
      // Set preview URL
      setImagePreview(getIPFSUrl(ipfsHash));

      toast({
        title: "✅ Upload Successful!",
        description: `Image uploaded to IPFS: ${ipfsHash.substring(0, 20)}...`,
      });

      console.log("IPFS Upload successful:", {
        hash: ipfsHash,
        size: uploadResponse.PinSize,
        url: getIPFSUrl(ipfsHash)
      });

    } catch (error) {
      console.error("IPFS upload failed:", error);
      toast({
        title: "❌ Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image to IPFS",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle manual IPFS hash input
  const handleImageInputChange = (value: string) => {
    setNewProduct({ ...newProduct, image: value });
    
    // Update preview if it's a valid IPFS hash
    if (value && isValidIPFSHash(value)) {
      setImagePreview(getIPFSUrl(value));
    } else {
      setImagePreview("");
    }
  };

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

      // Convert product name to felt252 and image URL to ByteArray
      const productNameFelt = safeEncodeToFelt252(newProduct.name, "Product Name");
      const imageUrl = newProduct.image || "/placeholder.svg?height=100&width=100";
      const imageByteArray = byteArray.byteArrayFromString(imageUrl);

      console.log("String conversions:", {
        originalName: newProduct.name,
        convertedName: productNameFelt,
        originalImage: imageUrl,
        convertedImageByteArray: imageByteArray,
      });

      // Prepare the contract call with proper ByteArray serialization
      const calls = [
        {
          contractAddress: STORE_CONTRACT_ADDRESS,
          entrypoint: "add_item",
          calldata: [
            productNameFelt, // productname: felt252
            priceInCents, // price: u32 (in cents)
            quantity, // quantity: u32
            imageByteArray.data.length, // ByteArray data length
            ...imageByteArray.data, // ByteArray data array
            imageByteArray.pending_word, // ByteArray pending word
            imageByteArray.pending_word_len, // ByteArray pending word length
          ],
        },
      ];

      console.log("Adding product to contract:", {
        name: productNameFelt,
        price: priceInCents,
        quantity,
        image: imageByteArray,
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
              Product Name * <span className="text-xs text-gray-500">(max 31 chars)</span>
            </Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Enter product name (e.g., 'Cool NFT' or '12345')"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              maxLength={31}
            />
            {newProduct.name.length > 25 && (
              <p className="text-xs text-orange-400 mt-1">
                ⚠️ {31 - newProduct.name.length} characters remaining
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="price" className="text-gray-300">
              Price (ETH) * <span className="text-xs text-gray-500">(supports number words)</span>
            </Label>
            <Input
              id="price"
              value={newProduct.price}
              onChange={(e) => {
                const convertedValue = convertWordsToNumber(e.target.value);
                setNewProduct({ ...newProduct, price: convertedValue });
              }}
              placeholder="0.001 or 'one point zero zero one'"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            {newProduct.price && isNaN(Number(newProduct.price)) && (
              <p className="text-xs text-orange-400 mt-1">
                💡 Try: "zero point zero one" or "one point five"
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="stock" className="text-gray-300">
              Stock Quantity * <span className="text-xs text-gray-500">(supports number words)</span>
            </Label>
            <Input
              id="stock"
              value={newProduct.stock}
              onChange={(e) => {
                const convertedValue = convertWordsToNumber(e.target.value);
                setNewProduct({ ...newProduct, stock: convertedValue });
              }}
              placeholder="100 or 'one hundred'"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            {newProduct.stock && isNaN(Number(newProduct.stock)) && (
              <p className="text-xs text-orange-400 mt-1">
                💡 Try: "ten", "fifty", "one hundred"
              </p>
            )}
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
            <Label className="text-gray-300 mb-3 block">
              Product Image <span className="text-xs text-gray-500">(IPFS)</span>
            </Label>
            
            {/* Upload Button */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isSubmitting}
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading to IPFS...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image to IPFS
                  </>
                )}
              </Button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Manual IPFS Hash Input */}
              <div className="relative">
                <Label htmlFor="image" className="text-gray-400 text-sm">
                  Or enter IPFS hash manually:
                </Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) => handleImageInputChange(e.target.value)}
                  placeholder="QmXxXxXx... or bafybeXxXx..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 mt-1"
                  maxLength={100}
                />
                {newProduct.image && isValidIPFSHash(newProduct.image) && (
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-400 mr-2">✅ Valid IPFS hash</span>
                    <a
                      href={getIPFSUrl(newProduct.image)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on IPFS
                    </a>
                  </div>
                )}
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3">
                  <Label className="text-gray-400 text-sm">Preview:</Label>
                  <div className="mt-2 relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-32 object-cover rounded-md border border-gray-700"
                      onError={() => {
                        setImagePreview("");
                        toast({
                          title: "Image Load Error",
                          description: "Failed to load image from IPFS",
                          variant: "destructive",
                        });
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded px-2 py-1">
                      <span className="text-xs text-white flex items-center">
                        <Image className="h-3 w-3 mr-1" />
                        IPFS
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleAddProduct}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting || isPending || isUploading}
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
              disabled={isSubmitting || isPending || isUploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
