import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package, AlertTriangle, Edit, Trash2, Star, DollarSign, Eye, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { getAllProducts, addNewProduct, updateProduct, deleteProduct } from "@/api/products";
import { getAllCategories } from "@/api/categories";
import { uploadFile } from "@/api/files";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminProductsView = () => {
  const queryClient = useQueryClient();
  
  // API hooks
  const { data: products = [], isLoading: productsLoading, error: productsError } = getAllProducts.useQuery();
  const { data: categories = [] } = getAllCategories.useQuery();
  
  const addProductMutation = addNewProduct.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
      toast.success("Product added successfully!");
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to add product: " + error.message);
    },
  });

  const updateProductMutation = updateProduct.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
      toast.success("Product updated successfully!");
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update product: " + error.message);
    },
  });

  const deleteProductMutation = deleteProduct.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete product: " + error.message);
    },
  });

  const uploadFileMutation = uploadFile.useMutation({
    onSuccess: (imageUrl: string) => {
      setFormData(prev => ({ ...prev, imageUrl }));
      setImagePreview(imageUrl);
      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      toast.error("Failed to upload image: " + error.message);
    },
  });

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

  // Image upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryID: "",
    sellingPrice: "",
    buyingPrice: "",
    stock: "",
    discount: "",
    rating: "",
    imageUrl: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      categoryID: "",
      sellingPrice: "",
      buyingPrice: "",
      stock: "",
      discount: "",
      rating: "",
      imageUrl: "",
    });
    setEditingProduct(null);
    setSelectedFile(null);
    setImagePreview("");
  };

  const handleEdit = (product: ProductType) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      categoryID: product.categoryID,
      sellingPrice: product.sellingPrice.toString(),
      buyingPrice: product.buyingPrice.toString(),
      stock: product.stock.toString(),
      discount: product.discount.toString(),
      rating: product.rating.toString(),
      imageUrl: product.imageUrl || "",
    });
    setImagePreview(product.imageUrl || "");
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.categoryID || !formData.sellingPrice || !formData.buyingPrice || !formData.stock) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      categoryID: formData.categoryID,
      sellingPrice: parseFloat(formData.sellingPrice),
      buyingPrice: parseFloat(formData.buyingPrice),
      stock: parseInt(formData.stock),
      discount: parseFloat(formData.discount || "0"),
      rating: parseFloat(formData.rating || "0"),
      imageUrl: formData.imageUrl,
    };

    if (editingProduct) {
      updateProductMutation.mutate({
        ...payload,
        productID: editingProduct.productID,
      });
    } else {
      addProductMutation.mutate(payload);
    }
  };

  const handleDelete = (productId: string) => {
    deleteProductMutation.mutate(productId);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUpload = () => {
    if (selectedFile) {
      uploadFileMutation.mutate(selectedFile);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    
    // Clear both file inputs
    const fileInputAdd = document.getElementById('image-upload') as HTMLInputElement;
    const fileInputEdit = document.getElementById('image-upload-edit') as HTMLInputElement;
    if (fileInputAdd) fileInputAdd.value = '';
    if (fileInputEdit) fileInputEdit.value = '';
  };

  if (productsLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>Error loading products: {productsError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Product Management</h1>
          <p className="text-muted-foreground">Manage store inventory and products</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a product to your store inventory</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Enter product name" 
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.categoryID} onValueChange={(value) => setFormData({...formData, categoryID: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.categoryID} value={category.categoryID}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Selling Price *</Label>
                <Input 
                  type="number" 
                  value={formData.sellingPrice} 
                  onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} 
                  placeholder="0.00" 
                />
              </div>
              <div className="space-y-2">
                <Label>Buying Price *</Label>
                <Input 
                  type="number" 
                  value={formData.buyingPrice} 
                  onChange={(e) => setFormData({...formData, buyingPrice: e.target.value})} 
                  placeholder="0.00" 
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity *</Label>
                <Input 
                  type="number" 
                  value={formData.stock} 
                  onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                  placeholder="0" 
                />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input 
                  type="number" 
                  value={formData.discount} 
                  onChange={(e) => setFormData({...formData, discount: e.target.value})} 
                  placeholder="0" 
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <Input 
                  type="number" 
                  value={formData.rating} 
                  onChange={(e) => setFormData({...formData, rating: e.target.value})} 
                  placeholder="0.0" 
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="space-y-3">
                  {/* File Upload Section */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="flex-1"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                    {selectedFile && (
                      <Button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploadFileMutation.isPending}
                        className="flex-shrink-0"
                      >
                        {uploadFileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload
                      </Button>
                    )}
                  </div>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Current Image URL Display */}
                  {formData.imageUrl && !imagePreview && (
                    <div className="text-sm text-muted-foreground">
                      Current: <span className="font-mono text-xs">{formData.imageUrl}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Product description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetForm();}}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={addProductMutation.isPending}
              >
                {addProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Enter product name" 
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.categoryID} onValueChange={(value) => setFormData({...formData, categoryID: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.categoryID} value={category.categoryID}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Selling Price *</Label>
              <Input 
                type="number" 
                value={formData.sellingPrice} 
                onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <Label>Buying Price *</Label>
              <Input 
                type="number" 
                value={formData.buyingPrice} 
                onChange={(e) => setFormData({...formData, buyingPrice: e.target.value})} 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <Label>Stock Quantity *</Label>
              <Input 
                type="number" 
                value={formData.stock} 
                onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                placeholder="0" 
              />
            </div>
            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input 
                type="number" 
                value={formData.discount} 
                onChange={(e) => setFormData({...formData, discount: e.target.value})} 
                placeholder="0" 
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <Input 
                type="number" 
                value={formData.rating} 
                onChange={(e) => setFormData({...formData, rating: e.target.value})} 
                placeholder="0.0" 
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="space-y-3">
                {/* File Upload Section */}
                <div className="flex items-center gap-2">
                  <Input
                    id="image-upload-edit"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload-edit')?.click()}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Image
                  </Button>
                  {selectedFile && (
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadFileMutation.isPending}
                      className="flex-shrink-0"
                    >
                      {uploadFileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Upload
                    </Button>
                  )}
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {/* Current Image URL Display */}
                {formData.imageUrl && !imagePreview && (
                  <div className="text-sm text-muted-foreground">
                    Current: <span className="font-mono text-xs">{formData.imageUrl}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Product description"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {setIsEditDialogOpen(false); resetForm();}}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={updateProductMutation.isPending}
            >
              {updateProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.productID} className="shadow-card hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.categoryName}</p>
                  {product.discount > 0 && (
                    <Badge variant="secondary" className="mt-1">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>
                <Package className="h-5 w-5 text-accent flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {product.imageUrl && (
                  <div className="w-full h-32 rounded-md bg-gray-100 flex items-center justify-center mb-3">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const nextElement = target.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden items-center justify-center w-full h-full text-gray-400">
                      <Eye className="h-8 w-8" />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Selling Price:</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">${product.sellingPrice}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Buying Price:</span>
                  <span className="font-medium">${product.buyingPrice}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <span className={`font-semibold flex items-center gap-1 ${product.stock < 10 ? "text-red-600" : "text-gray-900"}`}>
                    {product.stock < 10 && <AlertTriangle className="h-4 w-4" />}
                    {product.stock}
                  </span>
                </div>
                
                {product.rating > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                )}
                
                {product.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{product.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.productID)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={deleteProductMutation.isPending}
                        >
                          {deleteProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first product.</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminProductsView;
