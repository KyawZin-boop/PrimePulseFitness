import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Plus, X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: Date;
  expiryDate?: Date;
  certificateUrl?: string;
}

const TrainerCertificationsView = () => {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      name: "Certified Personal Trainer",
      organization: "National Academy of Sports Medicine (NASM)",
      issueDate: new Date("2023-01-15"),
      expiryDate: new Date("2027-01-15"),
    },
    {
      id: "2",
      name: "Nutrition Coach",
      organization: "Precision Nutrition",
      issueDate: new Date("2023-06-20"),
    },
    {
      id: "3",
      name: "Strength & Conditioning Specialist",
      organization: "National Strength and Conditioning Association (NSCA)",
      issueDate: new Date("2022-09-10"),
      expiryDate: new Date("2025-09-10"),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newIssueDate, setNewIssueDate] = useState("");

  const handleAddCertification = () => {
    if (!newName || !newOrg || !newIssueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: newName,
      organization: newOrg,
      issueDate: new Date(newIssueDate),
    };

    setCertifications([newCert, ...certifications]);
    toast.success("Certification added successfully!");
    setIsDialogOpen(false);
    setNewName("");
    setNewOrg("");
    setNewIssueDate("");
  };

  const handleRemoveCertification = (certId: string) => {
    setCertifications(certifications.filter((c) => c.id !== certId));
    toast.success("Certification removed");
  };

  const isExpiringSoon = (expiryDate?: Date) => {
    if (!expiryDate) return false;
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow && expiryDate > new Date();
  };

  const isExpired = (expiryDate?: Date) => {
    if (!expiryDate) return false;
    return expiryDate < new Date();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Certifications</h1>
          <p className="text-muted-foreground">
            Manage your professional certifications and credentials
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Certification</DialogTitle>
              <DialogDescription>
                Add a new professional certification or credential
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cert-name">Certification Name *</Label>
                <Input
                  id="cert-name"
                  placeholder="e.g., Certified Personal Trainer"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Issuing Organization *</Label>
                <Input
                  id="organization"
                  placeholder="e.g., NASM, ACE, ISSA"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-date">Issue Date *</Label>
                <Input
                  id="issue-date"
                  type="date"
                  value={newIssueDate}
                  onChange={(e) => setNewIssueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCertification}>
                Add Certification
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <Card key={cert.id} className="shadow-card">
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-card flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-accent" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {cert.organization}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Issued: </span>
                        <span className="font-medium">
                          {cert.issueDate.toLocaleDateString()}
                        </span>
                      </div>

                      {cert.expiryDate && (
                        <div>
                          <span className="text-muted-foreground">
                            Expires:{" "}
                          </span>
                          <span
                            className={`font-medium ${
                              isExpired(cert.expiryDate)
                                ? "text-red-600"
                                : isExpiringSoon(cert.expiryDate)
                                ? "text-yellow-600"
                                : ""
                            }`}
                          >
                            {cert.expiryDate.toLocaleDateString()}
                          </span>
                          {isExpiringSoon(cert.expiryDate) && !isExpired(cert.expiryDate) && (
                            <span className="ml-2 text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full">
                              Expiring Soon
                            </span>
                          )}
                          {isExpired(cert.expiryDate) && (
                            <span className="ml-2 text-xs bg-red-500/10 text-red-600 px-2 py-1 rounded-full">
                              Expired
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-3 w-3" />
                        Upload Certificate
                      </Button>
                      {cert.certificateUrl && (
                        <Button variant="outline" size="sm">
                          View Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveCertification(cert.id)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certifications.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Award className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Certifications Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your professional certifications to build client trust
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Certification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerCertificationsView;
