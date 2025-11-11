import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  CreditCard,
  Receipt
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import api from "@/api";

const AdminMembershipRequestsView = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Get all user memberships (includes all statuses: pending, approved, rejected)
  const { data: memberships = [], isLoading, refetch } =
    api.membership.getAllUserMemberships.useQuery();

  const changeStatus = api.membership.changeMembershipStatus.useMutation();

  const handleApprove = async (userMembershipId: string) => {
    try {
      await changeStatus.mutateAsync({ userMembershipId, status: "approved" });
      toast.success("Membership approved successfully!");
      refetch();
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Failed to approve membership");
    }
  };

  const handleReject = async (userMembershipId: string) => {
    try {
      await changeStatus.mutateAsync({ userMembershipId, status: "rejected" });
      toast.success("Membership request rejected");
      refetch();
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Failed to reject membership");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
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

  const pendingRequests = memberships.filter((m: any) => m.status === "pending");
  const processedRequests = memberships.filter((m: any) => m.status !== "pending");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Membership Purchase Requests</h1>
        <p className="text-muted-foreground">
          Review and approve user membership purchase requests
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {memberships.filter((m: any) => m.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {memberships.filter((m: any) => m.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Approval</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingRequests.map((request: any) => (
              <Card key={request.userMembershipID} className="shadow-card border-yellow-500/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.membershipName}</CardTitle>
                      <CardDescription className="mt-1">
                        Requested by: {request.userName}
                      </CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-accent">${request.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {request.discountPercentage}% discount benefit
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Receipt className="h-3 w-3 mr-1" />
                      View Receipt
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApprove(request.userMembershipID)}
                      disabled={changeStatus.isPending}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(request.userMembershipID)}
                      disabled={changeStatus.isPending}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pendingRequests.length === 0 && (
        <Card className="shadow-card mb-8">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Pending Requests</h3>
            <p className="text-muted-foreground text-center">
              All membership purchase requests have been processed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Request History</h2>
          <div className="space-y-3">
            {processedRequests.slice(0, 10).map((request: any) => (
              <Card key={request.userMembershipID} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-semibold">{request.membershipName}</p>
                        <p className="text-sm text-muted-foreground">User: {request.userName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-accent">${request.price}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Receipt Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              Review the payment receipt for {selectedRequest?.membershipName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Request Details */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User Name:</span>
                  <span className="font-medium">{selectedRequest?.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plan:</span>
                  <span className="font-medium">{selectedRequest?.membershipName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-accent">${selectedRequest?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Discount:</span>
                  <span className="font-medium">{selectedRequest?.discountPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Requested:</span>
                  <span className="font-medium">
                    {selectedRequest && new Date(selectedRequest.createdAt).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Receipt Image */}
            {selectedRequest?.receiptImageUrl && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Payment Receipt</Label>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <img
                    src={selectedRequest.receiptImageUrl}
                    alt="Payment receipt"
                    className="w-full h-auto max-h-96 object-contain rounded-md"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedRequest?.status === "pending" && (
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedRequest.userMembershipID)}
                  disabled={changeStatus.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedRequest.userMembershipID)}
                  disabled={changeStatus.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembershipRequestsView;
