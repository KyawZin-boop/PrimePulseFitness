import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  User as UserIcon,
  Mail,
  Calendar,
  MoreVertical,
  Ban,
  CheckCircle,
  Users,
  UserCheck,
  UserX,
  Loader2,
  Dumbbell,
  Utensils,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getAllUsers, suspendUser, activateUser } from "@/api/user";
import { useQueryClient } from "@tanstack/react-query";

const AdminUsersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const usersQuery = getAllUsers.useQuery();

  const suspendMutation = suspendUser.useMutation({
    onSuccess: () => {
      toast.success("User suspended successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    },
    onError: () => toast.error("Failed to suspend user"),
  });

  const activateMutation = activateUser.useMutation({
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    },
    onError: () => toast.error("Failed to activate user"),
  });

  const users = usersQuery.data || [];
  
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && user.activeFlag) ||
      (filterStatus === "inactive" && !user.activeFlag);
    
    return matchesSearch && matchesStatus;
  });

  const activeUsersCount = users.filter(u => u.activeFlag).length;
  const inactiveUsersCount = users.filter(u => !u.activeFlag).length;
  const subscribedUsersCount = users.filter(u => u.subscriptionStatus).length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage platform users and their accounts
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{activeUsersCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsersCount}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Subscribed</p>
                <p className="text-2xl font-bold text-blue-600">{subscribedUsersCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("active")}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("inactive")}
          >
            Suspended
          </Button>
        </div>
      </div>

      {/* Users List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usersQuery.isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <span className="ml-2">Loading users...</span>
            </div>
          )}
          
          {usersQuery.isError && (
            <div className="text-center py-8 text-destructive">
              Failed to load users. Please try again.
            </div>
          )}

          {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your criteria.
            </div>
          )}

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.userID}
                className="flex items-center justify-between rounded-lg border bg-gradient-card p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
                    <AvatarFallback className="bg-accent text-white font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <Badge
                        variant={user.activeFlag ? "default" : "secondary"}
                        className={user.activeFlag ? "bg-green-500" : "bg-gray-500"}
                      >
                        {user.activeFlag ? "Active" : "Suspended"}
                      </Badge>
                      {user.subscriptionStatus && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                          {user.subscriptionPlan || "Subscribed"}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      {user.age && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {user.age} years
                        </span>
                      )}
                      {user.gender && (
                        <span className="capitalize">{user.gender}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                      {user.assignedWorkoutPlan?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Dumbbell className="h-3 w-3" />
                          {user.assignedWorkoutPlan.length} Workout Plan{user.assignedWorkoutPlan.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {user.assignedDietPlan?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Utensils className="h-3 w-3" />
                          {user.assignedDietPlan.length} Diet Plan{user.assignedDietPlan.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
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
                    <DropdownMenuItem
                      onClick={() => navigate(`/admin/users/${user.userID}`)}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.activeFlag ? (
                      <DropdownMenuItem
                        onClick={() => suspendMutation.mutate(user.userID)}
                        disabled={suspendMutation.isPending}
                        className="text-red-600"
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => activateMutation.mutate(user.userID)}
                        disabled={activateMutation.isPending}
                        className="text-green-600"
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
