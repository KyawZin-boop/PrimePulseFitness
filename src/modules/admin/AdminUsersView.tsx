import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  User as UserIcon,
  Mail,
  Phone,
  MoreVertical,
  Ban,
  CheckCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getAllUsers, suspendUser, activateUser } from "@/api/user";
import { useQueryClient } from "@tanstack/react-query";

const AdminUsersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const usersQuery = getAllUsers.useQuery();

  const suspendMutation = suspendUser.useMutation({
    onSuccess: () => {
      toast.success("User suspended");
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    },
    onError: () => toast.error("Failed to suspend user"),
  });

  const activateMutation = activateUser.useMutation({
    onSuccess: () => {
      toast.success("User activated");
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    },
    onError: () => toast.error("Failed to activate user"),
  });

  const filteredUsers = (usersQuery.data || []).filter(
    (user: any) =>
      (user.name ?? user.fullName ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (user.email ?? "").toLowerCase().includes(searchQuery.toLowerCase())
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
          {usersQuery.isLoading && <div>Loading users...</div>}
          {usersQuery.isError && (
            <div className="text-destructive">Failed to load users</div>
          )}

          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.userID}
                className="flex items-center justify-between rounded-lg border bg-gradient-card p-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
                    {(user.name ?? user.name ?? "").charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {user.name ?? user.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.activeFlag
                            ? "bg-green-500/10 text-green-600"
                            : "bg-gray-500/10 text-gray-600"
                        }`}
                      >
                        {user.activeFlag ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600">
                        {user.role ?? "user"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      {/* {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </span>
                      )} */}
                    </div>
                    {user.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined {new Date(user.createdAt).toLocaleDateString()} •
                        Last active{" "}
                        {user.updatedAt
                          ? new Date(user.updatedAt).toLocaleDateString()
                          : "-"}
                      </p>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/admin/users/${user.userID}`)}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    {user.activeFlag ? (
                      <DropdownMenuItem
                        onClick={() => suspendMutation.mutate(user.userID)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => activateMutation.mutate(user.userID)}
                      >
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
