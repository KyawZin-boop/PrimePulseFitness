import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2, Crown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import api from "@/api";
import { Badge } from "@/components/ui/badge";

const CartView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userCredentials } = useAuth();
  const { items, totalItems, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  // Get user's membership for discount preview
  const { data: userMembership } = api.membership.getUserMembership.useQuery(
    userCredentials?.userId || ""
  );

  const membershipDiscount = userMembership?.activeFlag
    ? userMembership.discountPercentage
    : 0;
  const discountAmount = (totalPrice * membershipDiscount) / 100;
  const estimatedTotal = totalPrice - discountAmount;

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const item = items.find((cartItem) => cartItem.productID === productId);
    if (!item) {
      return;
    }

    const nextQuantity = item.quantity + delta;

    if (nextQuantity <= 0) {
      dispatch(updateQuantity({ productID: productId, quantity: 0 }));
      toast.success("Item removed from cart");
      return;
    }

    if (nextQuantity > item.stock) {
      return;
    }

    dispatch(updateQuantity({ productID: productId, quantity: nextQuantity }));
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading mb-2 flex items-center gap-2 text-accent">
            <ShoppingBag className="h-6 w-6" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {totalItems === 0
              ? "Your cart is empty"
              : `${totalItems} ${totalItems === 1 ? "item" : "items"} ready for checkout`}
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleContinueShopping}>
              Continue Shopping
            </Button>
            <Button onClick={handleCheckout}>Proceed to Checkout</Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card/30 p-12 text-center text-muted-foreground">
          <ShoppingCart className="mb-4 h-16 w-16 opacity-30" />
          <p className="text-lg font-medium">No items in cart yet</p>
          <p className="mb-6 text-sm">
            Browse the shop to discover products that match your goals.
          </p>
          <Button onClick={handleContinueShopping}>Go to Shop</Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productID}
                className="flex flex-col gap-4 rounded-lg border bg-card/80 p-4 shadow-sm transition hover:shadow-md md:flex-row"
              >
                <div className="h-36 w-full overflow-hidden rounded-lg bg-secondary md:h-32 md:w-32">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg font-semibold leading-tight">
                        {item.name}
                      </h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromCart(item.productID)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ${item.discountedPrice.toFixed(2)} each
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.stock} in stock
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleUpdateQuantity(item.productID, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleUpdateQuantity(item.productID, 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-lg font-bold text-accent">
                      ${(item.discountedPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <p className="text-sm text-muted-foreground">
                Review your cart before completing your purchase.
              </p>
            </div>

            {/* Membership Discount Info */}
            {userMembership?.activeFlag && (
              <div className="rounded-lg bg-accent/10 p-3 border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-sm text-accent">
                    {userMembership.membershipName}
                  </span>
                  <Badge className="bg-accent text-xs">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {membershipDiscount}% discount will be applied at checkout
                </p>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              {membershipDiscount > 0 && (
                <div className="flex items-center justify-between text-accent">
                  <span>Membership Discount ({membershipDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-semibold">Estimated Total</span>
                <span className="text-xl font-bold text-accent">
                  ${estimatedTotal.toFixed(2)}
                </span>
              </div>
              {!userMembership?.activeFlag && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    Want to save on every purchase?
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/membership")}
                    className="w-full"
                  >
                    <Crown className="h-3 w-3 mr-2" />
                    View Memberships
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleCheckout}>Checkout</Button>
              <Button variant="outline" onClick={handleContinueShopping}>
                Continue Shopping
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartView;
