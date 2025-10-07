import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {  Search, User, Mail, Phone, MoreVertical, Ban, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "trainer" | "admin";
  status: "active" | "inactive" | "suspended";
  joinedDate: Date;
  lastActive: Date;
}

const AdminUsersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      role: "user",
      status: "active",
      joinedDate: new Date("2025-01-15"),
      lastActive: new Date("2025-10-05"),
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "+1 (555) 234-5678",
      role: "user",
      status: "active",
      joinedDate: new Date("2025-02-20"),
      lastActive: new Date("2025-10-04"),
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@example.com",
      role: "trainer",
      status: "active",
      joinedDate: new Date("2024-11-10"),
      lastActive: new Date("2025-10-05"),
    },
  ]);

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: "suspended" as const } : u)));
    toast.success("User suspended");
  };

  const handleActivateUser = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: "active" as const } : u)));
    toast.success("User activated");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage platform users and their accounts
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Users List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border bg-gradient-card p-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-500/10 text-green-600"
                            : user.status === "suspended"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-gray-500/10 text-gray-600"
                        }`}
                      >
                        {user.status}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600">
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined {user.joinedDate.toLocaleDateString()} • Last active{" "}
                      {user.lastActive.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    {user.status === "active" ? (
                      <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activate User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersView;
