import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { getUserWishlist, removeFromWishlist } from "@/api/wishlist";

const WishlistView = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userCredentials } = useAuth();
  const navigate = useNavigate();

  const { data: wishlist, refetch: refetchWishlist } = getUserWishlist.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  const removeFromWishlistMutation = removeFromWishlist.useMutation({
    onSuccess: () => {
      toast.success("Removed from wishlist");
      refetchWishlist();
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });

  const handleRemoveFromWishlist = (itemId: string) => {
    if (!userCredentials) return;
    removeFromWishlistMutation.mutate({
      userId: userCredentials.userId,
      itemId,
    });
  };

  const handleAddToCart = (product: any) => {
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

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Wishlist</h2>
          <p className="text-muted-foreground mb-6">
            Please login to view your wishlist
          </p>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </div>
    );
  }

  const wishlistProducts = wishlist?.filter((item) => item.product) || [];

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8">
        <h1 className="text-heading mb-2 text-accent">My Wishlist</h1>
        <p className="text-muted-foreground">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Save items you love for later
          </p>
          <Button onClick={() => navigate("/shop")}>Browse Products</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((item) => {
            const product = item.product!;
            const discountedPrice =
              product.sellingPrice * (1 - (product.discount || 0) / 100);
            
            return (
              <Card
                key={item.wishlistID}
                className="group shadow-card transition rounded-t-lg hover:shadow-athletic"
              >
                <div className="aspect-square overflow-hidden rounded-t-lg bg-secondary relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition group-hover:scale-105 cursor-pointer"
                    onClick={() => navigate(`/shop`)}
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                      -{product.discount}%
                    </span>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 left-2 h-8 w-8 rounded-full shadow-lg"
                    onClick={() => handleRemoveFromWishlist(item.itemID)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
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
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      {product.stock} in stock
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistView;
