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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CreditCard, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import api from "@/api";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const AdminMembershipsManagementView = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPercentage: "",
    duration: "30",
    benefits: "",
    isActive: true,
  });

  const { data: memberships = [], isLoading, refetch } =
    api.membership.getAllMemberships.useQuery();

  const createMutation = api.membership.createMembership?.useMutation();
  const updateMutation = api.membership.updateMembership?.useMutation();
  const deleteMutation = api.membership.deleteMembership?.useMutation();

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      discountPercentage: "",
      duration: "30",
      benefits: "",
      isActive: true,
    });
    setEditingMembership(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.discountPercentage) {
      toast.error("Please fill all required fields");
      return;
    }

    const benefitsArray = formData.benefits
      .split("\n")
      .filter((b) => b.trim())
      .map((b) => b.trim());

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      discountPercentage: parseInt(formData.discountPercentage),
      duration: parseInt(formData.duration),
      benefits: benefitsArray,
      activeFlag: formData.isActive,
    };

    try {
      if (editingMembership) {
        // Update existing membership
        await updateMutation?.mutateAsync({
          ...payload,
          membershipID: editingMembership.membershipID,
        });
        toast.success("Membership updated successfully!");
      } else {
        // Create new membership
        await createMutation?.mutateAsync(payload);
        toast.success("Membership created successfully!");
      }
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save membership");
    }
  };

  const handleEdit = (membership: any) => {
    setEditingMembership(membership);
    setFormData({
      name: membership.name,
      price: membership.price.toString(),
      discountPercentage: membership.discountPercentage.toString(),
      duration: membership.duration.toString(),
      benefits: membership.benefits.join("\n"),
      isActive: membership.isActive,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (membershipID: string) => {
    if (!confirm("Are you sure you want to delete this membership plan?"))
      return;

    try {
      await deleteMutation?.mutateAsync(membershipID);
      toast.success("Membership deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete membership");
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Membership Management</h1>
          <p className="text-muted-foreground">
            Create and manage membership plans with discount benefits
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMembership ? "Edit" : "Create"} Membership Plan
              </DialogTitle>
              <DialogDescription>
                Configure membership tier with pricing and benefits
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Plan Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Gold Membership"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="29.99"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">
                    Discount Percentage <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPercentage: e.target.value,
                      })
                    }
                    placeholder="15"
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentage off at checkout (0-100)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Default: 30 days (1 month)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) =>
                    setFormData({ ...formData, benefits: e.target.value })
                  }
                  placeholder="Enter one benefit per line&#10;15% off on all purchases&#10;Priority email support&#10;Free shipping"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter one benefit per line
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active (visible to users)</Label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMembership ? "Update" : "Create"} Plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {memberships.map((plan) => (
          <Card
            key={plan.membershipID}
            className={`shadow-card ${!plan.activeFlag ? "opacity-60" : ""}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{plan.name}</CardTitle>
                    {!plan.activeFlag && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {plan.activeFlag && (
                      <Badge variant="default" className="bg-green-500">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-accent">
                      ${plan.price}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      / {plan.duration} days
                    </span>
                  </div>
                </div>
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <CardDescription>
                {plan.discountPercentage}% discount on all purchases
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <div className="space-y-3 flex flex-col h-full">
                {/* Benefits */}
                <div className="border-t pt-3 flex-1">
                  <p className="text-sm font-semibold mb-2">Benefits:</p>
                  <ul className="space-y-1">
                    {plan.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-1"
                      >
                        <span>•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-white"
                    onClick={() => handleDelete(plan.membershipID)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {memberships.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CreditCard className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Membership Plans Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first membership plan to offer discounts to users
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMembershipsManagementView;
