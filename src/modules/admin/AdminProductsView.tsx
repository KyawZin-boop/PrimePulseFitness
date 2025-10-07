import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image?: string;
}

const AdminProductsView = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Premium Whey Protein", category: "Supplements", price: 49.99, stock: 45, sold: 234 },
    { id: "2", name: "Resistance Bands Set", category: "Equipment", price: 29.99, stock: 8, sold: 156 },
    { id: "3", name: "Yoga Mat Pro", category: "Equipment", price: 39.99, stock: 67, sold: 412 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  const handleAddProduct = () => {
    if (!newName || !newPrice || !newStock) {
      toast.error("Please fill all fields");
      return;
    }
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newName,
      category: "General",
      price: parseFloat(newPrice),
      stock: parseInt(newStock),
      sold: 0,
    };
    setProducts([newProduct, ...products]);
    toast.success("Product added!");
    setIsDialogOpen(false);
    setNewName("");
    setNewPrice("");
    setNewStock("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Product Management</h1>
          <p className="text-muted-foreground">Manage store inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a product to your store</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Product name" />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="29.99" />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="100" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <Package className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="font-semibold">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <span className={`font-semibold ${product.stock < 10 ? "text-red-600 flex items-center gap-1" : ""}`}>
                    {product.stock < 10 && <AlertTriangle className="h-4 w-4" />}
                    {product.stock}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sold:</span>
                  <span className="font-semibold">{product.sold}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">Edit Product</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsView;
