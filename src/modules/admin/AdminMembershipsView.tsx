import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, CreditCard, Users } from "lucide-react";
import { toast } from "sonner";

interface Membership {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
  subscribers: number;
}

const AdminMembershipsView = () => {
  const [memberships, setMemberships] = useState<Membership[]>([
    { id: "1", name: "Basic", price: 29, duration: "monthly", benefits: ["Access to gym", "1 class per week"], subscribers: 245 },
    { id: "2", name: "Premium", price: 79, duration: "monthly", benefits: ["Unlimited classes", "1 PT session/month", "Nutrition plan"], subscribers: 128 },
    { id: "3", name: "Elite", price: 149, duration: "monthly", benefits: ["All Premium features", "4 PT sessions/month", "Priority booking"], subscribers: 67 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const handleAddMembership = () => {
    if (!newName || !newPrice) {
      toast.error("Please fill all fields");
      return;
    }
    const newMembership: Membership = {
      id: `mem-${Date.now()}`,
      name: newName,
      price: parseFloat(newPrice),
      duration: "monthly",
      benefits: [],
      subscribers: 0,
    };
    setMemberships([...memberships, newMembership]);
    toast.success("Membership created!");
    setIsDialogOpen(false);
    setNewName("");
    setNewPrice("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Membership Plans</h1>
          <p className="text-muted-foreground">Manage subscription tiers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Create Plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Membership Plan</DialogTitle>
              <DialogDescription>Add a new membership tier</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Premium" />
              </div>
              <div className="space-y-2">
                <Label>Monthly Price ($)</Label>
                <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="79" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMembership}>Create Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {memberships.map((plan) => (
          <Card key={plan.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-3xl font-bold mt-2">${plan.price}<span className="text-sm text-muted-foreground">/mo</span></p>
                </div>
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{plan.subscribers} active subscribers</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm font-semibold mb-2">Benefits:</p>
                  <ul className="space-y-1">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {benefit}</li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" size="sm" className="w-full">Edit Plan</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminMembershipsView;
