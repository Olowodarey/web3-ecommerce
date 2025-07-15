"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, BarChart3, Package, Users, DollarSign, ShoppingBag, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  sales: number
  image: string
}

interface Sale {
  id: number
  productName: string
  quantity: number
  price: number
  buyer: string
  date: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Digital Art NFT #001",
      price: 0.05,
      description: "Unique digital artwork on Starknet",
      stock: 1,
      sales: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Gaming Token Pack",
      price: 0.1,
      description: "Premium gaming tokens for Web3 games",
      stock: 50,
      sales: 23,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Starknet Merchandise",
      price: 0.03,
      description: "Official Starknet branded items",
      stock: 25,
      sales: 12,
      image: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [sales] = useState<Sale[]>([
    {
      id: 1,
      productName: "Digital Art NFT #001",
      quantity: 1,
      price: 0.05,
      buyer: "0x1234...5678",
      date: "2024-01-15",
    },
    {
      id: 2,
      productName: "Gaming Token Pack",
      quantity: 2,
      price: 0.2,
      buyer: "0x9876...4321",
      date: "2024-01-14",
    },
    {
      id: 3,
      productName: "Starknet Merchandise",
      quantity: 1,
      price: 0.03,
      buyer: "0x5555...7777",
      date: "2024-01-13",
    },
  ])

  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    image: "",
  })

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: Number.parseFloat(newProduct.price),
      description: newProduct.description,
      stock: Number.parseInt(newProduct.stock),
      sales: 0,
      image: newProduct.image || "/placeholder.svg?height=100&width=100",
    }

    setProducts([...products, product])
    setNewProduct({ name: "", price: "", description: "", stock: "", image: "" })
    setIsAddProductOpen(false)
    toast({
      title: "Success",
      description: "Product added successfully",
    })
  }

  const handleUpdateStock = (id: number, newStock: number) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, stock: newStock } : product)))
    toast({
      title: "Success",
      description: "Stock updated successfully",
    })
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id))
    toast({
      title: "Success",
      description: "Product deleted successfully",
    })
  }

  const getTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.price, 0)
  }

  const getTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.quantity, 0)
  }

  const getTotalProducts = () => {
    return products.length
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Clean Background with Subtle Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W3</span>
                </div>
                <span className="text-xl font-bold text-white">Web3 Store</span>
              </Link>
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">Admin Dashboard</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-right">
                <div className="font-medium text-white">Admin Wallet</div>
                <div className="text-gray-400 font-mono text-xs">0x1234...5678</div>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Link href="/" className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Back to Store</span>
                </Link>
              </Button>
              <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                <Wallet className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getTotalRevenue().toFixed(3)} ETH</div>
              <p className="text-xs text-green-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Sales</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getTotalSales()}</div>
              <p className="text-xs text-green-400">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Products</CardTitle>
              <Package className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getTotalProducts()}</div>
              <p className="text-xs text-gray-400">Active products</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Customers</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">156</div>
              <p className="text-xs text-green-400">+23% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-gray-900/50 border-gray-800">
            <TabsTrigger value="products" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
              Products
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
              Sales
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Product Management</CardTitle>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add New Product</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-gray-300">
                            Product Name
                          </Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Enter product name"
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price" className="text-gray-300">
                            Price (ETH)
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.001"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="0.000"
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock" className="text-gray-300">
                            Stock Quantity
                          </Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            placeholder="Enter stock quantity"
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-gray-300">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Enter product description"
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="image" className="text-gray-300">
                            Image URL
                          </Label>
                          <Input
                            id="image"
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            placeholder="Enter image URL (optional)"
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <Button onClick={handleAddProduct} className="w-full bg-orange-500 hover:bg-orange-600">
                          Add Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Image</TableHead>
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Stock</TableHead>
                      <TableHead className="text-gray-300">Sales</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="border-gray-800">
                        <TableCell>
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-white">{product.name}</TableCell>
                        <TableCell className="text-blue-400">{product.price} ETH</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={product.stock}
                              onChange={(e) => handleUpdateStock(product.id, Number.parseInt(e.target.value))}
                              className="w-20 bg-gray-800 border-gray-700 text-white"
                            />
                            <Badge
                              variant={product.stock > 0 ? "default" : "destructive"}
                              className={product.stock > 0 ? "bg-green-600" : ""}
                            >
                              {product.stock > 0 ? "In Stock" : "Out"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">{product.sales}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Sales Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Product</TableHead>
                      <TableHead className="text-gray-300">Quantity</TableHead>
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Buyer</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id} className="border-gray-800">
                        <TableCell className="font-medium text-white">{sale.productName}</TableCell>
                        <TableCell className="text-white">{sale.quantity}</TableCell>
                        <TableCell className="text-blue-400">{sale.price} ETH</TableCell>
                        <TableCell className="font-mono text-sm text-gray-300">{sale.buyer}</TableCell>
                        <TableCell className="text-gray-300">{sale.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
