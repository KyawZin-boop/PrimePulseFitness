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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Loader2, Shield, Sparkles, Star, Upload } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import api from "@/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";

const MembershipView = () => {
  const { userCredentials } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<any>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  // Get all available membership plans
  const { data: memberships = [], isLoading: loadingPlans } =
    api.membership.getAllMemberships.useQuery();

  // Get user's current membership
  const { data: userMembership, isLoading: loadingUserMembership } =
    api.membership.getUserMembership.useQuery(userCredentials?.userId || "");

  const uploadMutation = api.files.uploadFile.useMutation();
  const purchaseMutation = api.membership.purchaseMembership.useMutation();

  const handlePurchaseClick = (plan: any) => {
    if (!userCredentials?.userId) {
      toast.error("Please log in to purchase a membership");
      return;
    }

    // Check if user has an existing membership
    if (userMembership) {
      if (userMembership.status === "pending") {
        toast.error("You already have a pending membership request. Please wait for admin approval.");
        return;
      }
      if (userMembership.status === "approved" && userMembership.activeFlag) {
        toast.error("You already have an active membership. Please wait until it expires before purchasing a new one.");
        return;
      }
    }

    setSelectedPlanForPurchase(plan);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setReceiptFile(f);
      setReceiptPreview(URL.createObjectURL(f));
    }
  };

  const onEditReceipt = () => {
    fileRef.current?.click();
  };

  const handleConfirmPurchase = async () => {
    if (!receiptFile) {
      toast.error("Please upload a payment receipt");
      return;
    }

    if (!userCredentials?.userId || !selectedPlanForPurchase) {
      return;
    }

    try {
      // Upload receipt image first
      const uploadedUrl = await uploadMutation.mutateAsync(receiptFile);

      // Then submit purchase request
      purchaseMutation.mutate(
        {
          userID: userCredentials.userId,
          membershipID: selectedPlanForPurchase.membershipID,
          receiptImageUrl: uploadedUrl,
        },
        {
          onSuccess: () => {
            toast.success("Membership purchase request submitted! Waiting for admin approval.");
            queryClient.invalidateQueries({
              queryKey: ["getUserMembership", userCredentials?.userId],
            });
            queryClient.invalidateQueries({
              queryKey: ["getUserById", userCredentials?.userId],
            });
            // Reset dialog
            setSelectedPlanForPurchase(null);
            setReceiptFile(null);
            setReceiptPreview(null);
          },
          onError: () => {
            toast.error("Failed to submit membership purchase. Please try again.");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload receipt or submit purchase.");
    }
  };

  const handleCancelPurchase = () => {
    setSelectedPlanForPurchase(null);
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("bronze") || name.includes("basic")) return Shield;
    if (name.includes("silver")) return Star;
    if (name.includes("gold")) return Crown;
    if (name.includes("platinum") || name.includes("elite")) return Sparkles;
    return Shield;
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("bronze") || name.includes("basic"))
      return "from-orange-500/20 to-orange-600/10";
    if (name.includes("silver")) return "from-gray-400/20 to-gray-500/10";
    if (name.includes("gold")) return "from-yellow-500/20 to-yellow-600/10";
    if (name.includes("platinum") || name.includes("elite"))
      return "from-purple-500/20 to-purple-600/10";
    return "from-accent/20 to-accent/10";
  };

  if (loadingPlans || loadingUserMembership) {
    return (
      <div className="container mx-auto py-8 px-4 pt-24">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  const isActiveMember = userMembership?.activeFlag && userMembership?.status === "approved";
  const hasPendingRequest = userMembership?.status === "pending";
  const hasRejectedRequest = userMembership?.status === "rejected";
  const currentMembershipId = userMembership?.membershipID;

  return (
    <div className="container mx-auto py-8 px-4 pt-24">
      <div className="mb-12 text-center">
        <h1 className="text-heading mb-4">Membership Plans</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose a membership plan and get exclusive discounts on all product
          purchases. Unlock premium benefits today!
        </p>
      </div>

      {/* Current Membership Status */}
      {isActiveMember && userMembership && (
        <Card className="mb-8 shadow-card border-green-500/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Crown className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Active Membership: {userMembership.membershipName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userMembership.discountPercentage}% discount on all
                    purchases • Valid until{" "}
                    {new Date(userMembership.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-500">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Membership Request */}
      {hasPendingRequest && userMembership && (
        <Card className="mb-8 shadow-card border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-yellow-600">
                    Membership Request Pending
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userMembership.membershipName} • Your payment receipt is being reviewed by our admin team
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                Pending Approval
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejected Membership Request */}
      {hasRejectedRequest && userMembership && (
        <Card className="mb-8 shadow-card border-red-500/50 bg-red-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <Crown className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-red-600">
                    Membership Request Rejected
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userMembership.membershipName} • Your request was not approved. You can purchase a new membership plan below.
                  </p>
                </div>
              </div>
              <Badge variant="destructive">
                Rejected
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Membership Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memberships
          .filter((plan) => plan.activeFlag)
          .sort((a, b) => a.price - b.price)
          .map((plan) => {
            const Icon = getPlanIcon(plan.name);
            const isCurrentPlan = currentMembershipId === plan.membershipID;

            return (
              <Card
                key={plan.membershipID}
                className={`shadow-card relative overflow-hidden ${
                  isCurrentPlan ? "border-accent/50 border-2" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getPlanColor(
                    plan.name
                  )} opacity-50`}
                />

                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-full bg-accent/10">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    {isCurrentPlan && (
                      <Badge className="bg-accent">Current Plan</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold text-accent">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      / {plan.duration} days
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    Save {plan.discountPercentage}% on all product purchases
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-4 flex flex-col h-full">
                  {/* Discount Highlight */}
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="font-semibold text-accent text-center">
                      {plan.discountPercentage}% Checkout Discount
                    </p>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-2 flex-1">
                    {plan.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Purchase Button */}
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "athletic"}
                    disabled={isCurrentPlan || (hasPendingRequest && !hasRejectedRequest) || (isActiveMember && !hasRejectedRequest)}
                    onClick={() => handlePurchaseClick(plan)}
                  >
                    {isCurrentPlan && isActiveMember
                      ? "Current Plan"
                      : hasPendingRequest
                      ? "Pending Approval"
                      : isActiveMember
                      ? "Already a Member"
                      : "Purchase Plan"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Purchase Dialog with Receipt Upload */}
      <Dialog open={!!selectedPlanForPurchase} onOpenChange={(open) => !open && handleCancelPurchase()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase {selectedPlanForPurchase?.name} Membership</DialogTitle>
            <DialogDescription>
              Upload your payment receipt to complete the purchase. Admin will review and approve your membership.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Plan Summary */}
            <Card className="border-accent/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-lg">{selectedPlanForPurchase?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPlanForPurchase?.discountPercentage}% discount on all purchases
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-accent">${selectedPlanForPurchase?.price}</p>
                    <p className="text-xs text-muted-foreground">for {selectedPlanForPurchase?.duration} days</p>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Benefits included:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {selectedPlanForPurchase?.benefits?.slice(0, 3).map((benefit: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-accent" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                    {selectedPlanForPurchase?.benefits?.length > 3 && (
                      <p className="text-xs text-muted-foreground ml-5">
                        +{selectedPlanForPurchase.benefits.length - 3} more benefits
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Receipt Upload */}
            <div>
              <Label htmlFor="receipt-upload">
                Upload Payment Receipt <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Please transfer ${selectedPlanForPurchase?.price} to our account and upload the receipt
              </p>
              <Card className="mt-2">
                <CardContent className="p-4">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="sr-only"
                    id="receipt-upload"
                  />

                  {!receiptPreview ? (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                      <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Upload a photo of your payment receipt (JPG, PNG)
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-center">
                      <img
                        src={receiptPreview}
                        alt="receipt"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">
                            {receiptFile?.name ?? "Receipt image"}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={onEditReceipt}
                          >
                            Change
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Preview of uploaded receipt
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancelPurchase}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleConfirmPurchase}
                disabled={!receiptFile || (uploadMutation as any).isPending || (purchaseMutation as any).isPending}
              >
                {(uploadMutation as any).isPending || (purchaseMutation as any).isPending
                  ? "Submitting..."
                  : "Submit Purchase"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Section */}
      <div className="mt-12 p-6 rounded-lg bg-muted/30 border">
        <h3 className="font-semibold mb-2">How Membership Works</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            • Choose a membership plan that fits your fitness journey and budget
          </li>
          <li>
            • Enjoy automatic discounts applied at checkout on all product
            purchases
          </li>
          <li>• Membership is valid for the specified duration from purchase</li>
          <li>• Upgrade or renew your membership anytime</li>
          <li>
            • All benefits are active immediately after successful purchase
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MembershipView;
