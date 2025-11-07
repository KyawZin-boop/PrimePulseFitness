import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { createOrder } from "@/api/orders";
import { uploadFile } from "@/api/files";
import useAuth from "@/hooks/useAuth";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronRight, Crown } from "lucide-react";

type CartProduct = {
  productID: string;
  quantity: number;
  price: number;
};

const CheckoutView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);
  const { userCredentials } = useAuth();

  // Get user's active membership for discount
  const { data: userMembership } = api.membership.getUserMembership.useQuery(
    userCredentials?.userId || ""
  );

  // Calculate discount based on membership (only for approved memberships)
  const membershipDiscount = 
    userMembership?.activeFlag && userMembership?.status === "approved"
      ? userMembership.discountPercentage
      : 0;
  const subtotal = cart.totalPrice;
  const discountAmount = (subtotal * membershipDiscount) / 100;
  const finalTotal = subtotal - discountAmount;

  if (cart.items.length === 0) {
    return (
      <div className="p-6 pt-24 max-w-3xl mx-auto text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate("/shop")}>Go to Shop</Button>
      </div>
    );
  }

  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  //   const [note, setNote] = useState<string>("");

  const uploadMutation = uploadFile.useMutation();

  const orderMutation = createOrder.useMutation({
    onSuccess: () => {
      toast.success("Order placed successfully");
      // clear cart and navigate
      dispatch(clearCart());
      navigate(`/shop`);
    },
    onError: () => {
      toast.error("Failed to place order. Please try again.");
    },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setReceiptFile(f);
      setReceiptPreview(URL.createObjectURL(f));
    }
  };

  const onEditReceipt = () => {
    // trigger file input click to allow re-select
    fileRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiptFile) {
      toast.error("Please upload a receipt photo.");
      return;
    }

    try {
      const uploadedUrl = await uploadMutation.mutateAsync(receiptFile);

      const products = cart.items.map<CartProduct>((it) => ({
        productID: it.productID,
        quantity: it.quantity,
        price: it.discountedPrice,
      }));

      const payload: CreateOrderPayload = {
        userID: userCredentials?.userId ?? "",
        totalAmount: finalTotal, // Use discounted total
        quantity: cart.totalItems,
        imageUrl: uploadedUrl,
        products,
      };

      orderMutation.mutate(payload);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload receipt or create order.");
    }
  };

  return (
    <div className="p-6 pt-24 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 flex items-center justify-between">
        Checkout
        <span
          className="py-5 flex items-center text-sm text-accent cursor-pointer"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping <ChevronRight className="w-4 h-4" />
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="payment-method">
              <SelectValue placeholder="Select a payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash on Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="receipt-upload">
            Upload receipt <span className="text-red-500">*</span>(required)
          </Label>
          <Card className="mt-2">
            <CardContent className="flex items-center gap-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="sr-only"
                id="receipt-upload"
              />

              {!receiptPreview ? (
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Upload a photo of your payment receipt (JPG, PNG).
                  </p>
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline_athletic"
                      onClick={() => fileRef.current?.click()}
                    >
                      Choose file
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 items-center w-full">
                  <img
                    src={receiptPreview}
                    alt="receipt"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {receiptFile?.name ?? "Receipt image"}
                      </div>
                      <div>
                        <Button
                          size="sm"
                          variant="outline_athletic"
                          type="button"
                          onClick={onEditReceipt}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Preview of uploaded receipt. Re-upload to change the
                      image.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* <div>
          <label className="block font-medium">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 w-full border border-1 px-3 py-2 rounded-xl"
          />
        </div> */}

        {/* Membership Discount Info */}
        {userMembership?.activeFlag && (
          <Card className="border-accent/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <Crown className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {userMembership.membershipName} Membership
                    </p>
                    <Badge className="bg-accent">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {membershipDiscount}% discount applied to your order
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="border rounded p-3">
          <h3 className="font-semibold">Order summary</h3>
          <div className="mt-2">
            {cart.items.map((it) => (
              <div key={it.productID} className="flex justify-between py-1">
                <div>
                  {it.name} x {it.quantity}
                </div>
                <div>${(it.discountedPrice * it.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="flex justify-between mt-2 pt-2 border-t">
              <div className="text-muted-foreground">Subtotal</div>
              <div>${subtotal.toFixed(2)}</div>
            </div>
            {membershipDiscount > 0 && (
              <div className="flex justify-between text-accent">
                <div>Membership Discount ({membershipDiscount}%)</div>
                <div>-${discountAmount.toFixed(2)}</div>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
              <div>Total</div>
              <div className="text-accent">${finalTotal.toFixed(2)}</div>
            </div>
            {membershipDiscount > 0 && (
              <p className="text-xs text-muted-foreground mt-2 text-right">
                You saved ${discountAmount.toFixed(2)} with your membership!
              </p>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant="athletic"
            size="lg"
            disabled={Boolean(
              (uploadMutation as any).isLoading ||
                (orderMutation as any).isLoading
            )}
          >
            {(orderMutation as any).isLoading
              ? "Placing order..."
              : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutView;
