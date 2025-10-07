import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Mail, CreditCard, Globe } from "lucide-react";
import { toast } from "sonner";

const AdminSettingsView = () => {
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">System Settings</h1>
        <p className="text-muted-foreground">Configure platform settings</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input defaultValue="PrimePulse Fitness" />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" defaultValue="support@primepulse.com" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-6 (Central Time)</option>
                  <option>UTC-7 (Mountain Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SMTP Server</Label>
              <Input defaultValue="smtp.gmail.com" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>SMTP Username</Label>
                <Input type="email" placeholder="noreply@primepulse.com" />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input type="number" defaultValue="587" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Stripe API Key</Label>
              <Input type="password" placeholder="sk_test_..." />
            </div>
            <div className="space-y-2">
              <Label>Stripe Publishable Key</Label>
              <Input placeholder="pk_test_..." />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Base URL</Label>
              <Input defaultValue="https://api.primepulse.com" />
            </div>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input type="password" placeholder="Enter API key" />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSaveSettings} className="w-full md:w-auto">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsView;
