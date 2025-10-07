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
import { Minus, Plus, ShoppingBag, ShoppingCart, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import type {  CartItem } from "@/types";
import { toast } from "sonner";
import api from "@/api";

const StoreView = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCart, setShowCart] = useState(false);

  const { data: products } = api.products.getAllProducts.useQuery();

  // Mock products - replace with API call
  // const products: Product[] = [
  //   {
  //     id: "prod-1",
  //     name: "Premium Yoga Mat",
  //     description: "Non-slip, eco-friendly yoga mat with extra cushioning for comfort during your practice.",
  //     category: "equipment",
  //     price: 45,
  //     stock: 25,
  //     images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"],
  //     rating: 4.8,
  //   },
  //   {
  //     id: "prod-2",
  //     name: "Adjustable Dumbbells Set",
  //     description: "Space-saving adjustable dumbbells from 5-25 lbs. Perfect for home workouts.",
  //     category: "equipment",
  //     price: 199,
  //     stock: 12,
  //     images: ["https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400"],
  //     rating: 4.9,
  //   },
  //   {
  //     id: "prod-3",
  //     name: "Whey Protein Powder",
  //     description: "25g protein per serving. Available in chocolate, vanilla, and strawberry flavors.",
  //     category: "supplement",
  //     price: 59,
  //     stock: 50,
  //     images: ["https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400"],
  //     rating: 4.6,
  //   },
  //   {
  //     id: "prod-4",
  //     name: "Performance Training Shorts",
  //     description: "Moisture-wicking, lightweight shorts with zippered pockets for active training.",
  //     category: "apparel",
  //     price: 35,
  //     stock: 30,
  //     images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400"],
  //     rating: 4.5,
  //   },
  //   {
  //     id: "prod-5",
  //     name: "Resistance Bands Set",
  //     description: "5-piece resistance band set with varying strengths for full-body workouts.",
  //     category: "equipment",
  //     price: 29,
  //     stock: 40,
  //     images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400"],
  //     rating: 4.7,
  //   },
  //   {
  //     id: "prod-6",
  //     name: "BCAA Recovery Supplement",
  //     description: "Branch-chain amino acids to support muscle recovery and reduce soreness.",
  //     category: "supplement",
  //     price: 39,
  //     stock: 35,
  //     images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400"],
  //     rating: 4.4,
  //   },
  //   {
  //     id: "prod-7",
  //     name: "Compression Tank Top",
  //     description: "Breathable compression fit to enhance performance and support muscles.",
  //     category: "apparel",
  //     price: 42,
  //     stock: 28,
  //     images: ["https://images.unsplash.com/photo-1622445275576-721325763afe?w=400"],
  //     rating: 4.6,
  //   },
  //   {
  //     id: "prod-8",
  //     name: "Gym Towel & Water Bottle Set",
  //     description: "Quick-dry microfiber towel and insulated 24oz water bottle combo.",
  //     category: "accessory",
  //     price: 25,
  //     stock: 60,
  //     images: ["https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400"],
  //     rating: 4.3,
  //   },
  // ];

  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products!.filter((p) => p.categoryName === selectedCategory);

  const addToCart = (product: ProductType) => {
    const existingItem = cart.find((item) => item.productId === product.productID);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.productID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { productId: product.productID, quantity: 1, price: product.sellingPrice }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
    toast.success("Item removed from cart");
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getProductById = (id: string) => products!.find((p) => p.productID === id);

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2 text-accent">Fitness Store</h1>
          <p className="text-muted-foreground">
            Premium equipment, apparel, and supplements
          </p>
        </div>
        <Button
          onClick={() => setShowCart(true)}
          variant="outline"
          className="relative"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart
          {cartItemsCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
              {cartItemsCount}
            </span>
          )}
        </Button>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
        >
          All Products
        </Button>
        <Button
          variant={selectedCategory === "equipment" ? "default" : "outline"}
          onClick={() => setSelectedCategory("equipment")}
        >
          Equipment
        </Button>
        <Button
          variant={selectedCategory === "apparel" ? "default" : "outline"}
          onClick={() => setSelectedCategory("apparel")}
        >
          Apparel
        </Button>
        <Button
          variant={selectedCategory === "supplement" ? "default" : "outline"}
          onClick={() => setSelectedCategory("supplement")}
        >
          Supplements
        </Button>
        <Button
          variant={selectedCategory === "accessory" ? "default" : "outline"}
          onClick={() => setSelectedCategory("accessory")}
        >
          Accessories
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts && filteredProducts.map((product) => (
          <Card
            key={product.productID}
            className="group cursor-pointer shadow-card transition rounded-t-lg hover:shadow-athletic pt-0"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="aspect-square overflow-hidden rounded-t-lg bg-secondary">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
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
              <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-accent">
                  {product.sellingPrice} Kyat
                </span>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
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
        ))}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">
                    {selectedProduct.categoryName}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{selectedProduct.rating}</span>
                    <span className="text-muted-foreground">rating</span>
                  </div>
                </div>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
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
                    <div className="mb-2 text-sm text-muted-foreground">Price</div>
                    <div className="text-4xl font-bold text-accent">
                      ${selectedProduct.sellingPrice}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-secondary/30 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Availability:</span>
                      <span className="font-medium">
                        {selectedProduct.stock > 0
                          ? `${selectedProduct.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
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
                      onClick={() => addToCart(selectedProduct)}
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
          )}
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
            </DialogTitle>
            <DialogDescription>
              {cart.length === 0
                ? "Your cart is empty"
                : `${cartItemsCount} ${cartItemsCount === 1 ? "item" : "items"} in your cart`}
            </DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 opacity-20" />
              <p>No items in cart yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {cart.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={item.productId}
                      className="flex gap-4 rounded-lg border bg-card p-3"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-secondary">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${item.price} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, 1)}
                            disabled={item.quantity >= product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-accent">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="mb-4 flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-accent">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCart(false)}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success("Proceeding to checkout!");
                      setShowCart(false);
                    }}
                    className="flex-1"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreView;
