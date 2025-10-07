import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, Send, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  recipients: string;
  recipientCount: number;
  sentDate: string;
  status: "sent" | "scheduled" | "draft";
}

const AdminNotificationsView = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const notifications: Notification[] = [
    {
      id: "1",
      title: "New Year Special Offer",
      message: "Get 30% off on all memberships this month!",
      recipients: "All Users",
      recipientCount: 1247,
      sentDate: "2024-01-01",
      status: "sent",
    },
    {
      id: "2",
      title: "Maintenance Notice",
      message: "Platform will be under maintenance on Jan 20th from 2-4 AM.",
      recipients: "All Users",
      recipientCount: 1247,
      sentDate: "2024-01-18",
      status: "scheduled",
    },
    {
      id: "3",
      title: "New Trainer Welcome",
      message: "Please welcome our new trainer, Sarah Williams!",
      recipients: "Active Members",
      recipientCount: 892,
      sentDate: "2024-01-12",
      status: "sent",
    },
    {
      id: "4",
      title: "Payment Reminder",
      message: "Your membership renewal is due in 3 days.",
      recipients: "Expiring Soon",
      recipientCount: 47,
      sentDate: "2024-01-15",
      status: "sent",
    },
    {
      id: "5",
      title: "Valentine's Day Promo",
      message: "Special couples packages available this February!",
      recipients: "All Users",
      recipientCount: 1247,
      sentDate: "2024-02-01",
      status: "draft",
    },
  ];

  const handleSendNotification = () => {
    toast.success("Notification sent successfully!");
    setShowCreateDialog(false);
  };

  const stats = {
    totalSent: notifications.filter((n) => n.status === "sent").length,
    scheduled: notifications.filter((n) => n.status === "scheduled").length,
    drafts: notifications.filter((n) => n.status === "draft").length,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Send announcements to users
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Enter notification title" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter notification message"
                />
              </div>
              <div className="space-y-2">
                <Label>Recipients</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>All Users</option>
                  <option>Active Members</option>
                  <option>Trainers Only</option>
                  <option>Expired Memberships</option>
                  <option>New Users (Last 30 days)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Send Type</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Send Immediately</option>
                  <option>Schedule for Later</option>
                  <option>Save as Draft</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSendNotification}>
                  Send Notification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Send className="h-4 w-4" />
              Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalSent}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.scheduled}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.drafts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">
                      {notification.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.status === "sent"
                          ? "bg-green-100 text-green-700"
                          : notification.status === "scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {notification.status}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{notification.message}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {notification.recipients} ({notification.recipientCount}{" "}
                        users)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {notification.status === "scheduled"
                          ? `Scheduled for ${notification.sentDate}`
                          : notification.status === "sent"
                          ? `Sent on ${notification.sentDate}`
                          : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {notification.status === "draft" && (
                    <Button size="sm">Edit</Button>
                  )}
                  {notification.status === "scheduled" && (
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminNotificationsView;
