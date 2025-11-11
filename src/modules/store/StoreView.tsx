import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { addToCart } from "@/store/slices/cartSlice";

const StoreView = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showLoginConfirm, setShowLoginConfirm] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<ProductType | null>(
    null
  );

  const { data: products } = api.products.getAllProducts.useQuery();
  const { data: categories } = api.categories.getAllCategories.useQuery();

  const addToCartParam = searchParams.get("addToCart");

  useEffect(() => {
    if (addToCartParam && isAuthenticated && products) {
      const product = products.find((p) => p.productID === addToCartParam);
      if (product) {
        dispatch(
          addToCart({
            productID: product.productID,
            name: product.name,
            imageUrl: product.imageUrl,
            sellingPrice: product.sellingPrice,
            discount: product.discount,
            stock: product.stock,
          })
        );
        toast.success(`${product.name} added to cart!`);
      }
      navigate("/shop", { replace: true });
    }
  }, [addToCartParam, isAuthenticated, products, dispatch, navigate]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products?.filter((p) => p.categoryName === selectedCategory);

  const handleAddToCart = (product: ProductType) => {
    if (!isAuthenticated) {
      setPendingProduct(product);
      setShowLoginConfirm(true);
      return;
    }
    dispatch(
      addToCart({
        productID: product.productID,
        name: product.name,
        imageUrl: product.imageUrl,
        sellingPrice: product.sellingPrice,
        discount: product.discount,
        stock: product.stock,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2 text-accent">Fitness Store</h1>
          <p className="text-muted-foreground">
            Premium equipment, apparel, and supplements
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
        >
          All Products
        </Button>
        {categories?.map((category) => {
          return (
            <Button
              key={category.categoryID}
              variant={
                selectedCategory === category.categoryName
                  ? "default"
                  : "outline"
              }
              onClick={() => setSelectedCategory(category.categoryName)}
            >
              {category.categoryName}
            </Button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts?.map((product) => {
          const discountedPrice = product.sellingPrice * (1 - product.discount / 100);
          return (
            <Card
              key={product.productID}
              className="group cursor-pointer shadow-card transition rounded-t-lg hover:shadow-athletic pt-0"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-square overflow-hidden rounded-t-lg bg-secondary relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                {product.discount > 0 && (
                  <span className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium capitalize">
                    {product.categoryName}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-1 text-lg">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-bold text-accent">
                      ${discountedPrice.toFixed(2)}
                    </div>
                    {product.discount > 0 && (
                      <div className="text-sm text-muted-foreground line-through">
                        ${product.sellingPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {product.stock} in stock
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedProduct &&
            (() => {
              const discountedPrice =
                selectedProduct.sellingPrice *
                (1 - selectedProduct.discount / 100);
              return (
                <>
                  <DialogHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">
                        {selectedProduct.categoryName}
                      </span>
                      {selectedProduct.discount > 0 && (
                        <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          -{selectedProduct.discount}%
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">
                          {selectedProduct.rating}
                        </span>
                        <span className="text-muted-foreground">rating</span>
                      </div>
                    </div>
                    <DialogTitle className="text-2xl">
                      {selectedProduct.name}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedProduct.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg border bg-gradient-card p-4">
                        <div className="mb-2 text-sm text-muted-foreground">
                          Price
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-accent">
                            ${discountedPrice.toFixed(2)}
                          </div>
                          {selectedProduct.discount > 0 && (
                            <>
                              <div className="text-lg text-muted-foreground line-through">
                                ${selectedProduct.sellingPrice.toFixed(2)}
                              </div>
                              <div className="text-sm text-green-600 font-medium">
                                Save ${(selectedProduct.sellingPrice - discountedPrice).toFixed(2)} ({selectedProduct.discount}% off)
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border bg-secondary/30 p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Availability:
                          </span>
                          <span className="font-medium">
                            {selectedProduct.stock > 0
                              ? `${selectedProduct.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Category:
                          </span>
                          <span className="font-medium capitalize">
                            {selectedProduct.categoryName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="font-medium">
                            {selectedProduct.rating} / 5.0
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(selectedProduct)}
                          disabled={selectedProduct.stock === 0}
                          className="flex-1"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedProduct(null)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* Login Confirmation Dialog */}
      <Dialog open={showLoginConfirm} onOpenChange={setShowLoginConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to add items to your cart. Would you like
              to login now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (pendingProduct) {
                  navigate(
                    `/auth/login?redirect=/store&addToCart=${pendingProduct.productID}`
                  );
                }
                setShowLoginConfirm(false);
                setPendingProduct(null);
              }}
            >
              Yes, Login
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowLoginConfirm(false);
                setPendingProduct(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreView;
