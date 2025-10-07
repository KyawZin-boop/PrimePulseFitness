import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

const AdminContentView = () => {
  const contentSections = [
    { id: "1", name: "Homepage Hero", lastUpdated: new Date("2025-09-15"), status: "published" },
    { id: "2", name: "About Us", lastUpdated: new Date("2025-08-20"), status: "published" },
    { id: "3", name: "Terms & Conditions", lastUpdated: new Date("2025-07-10"), status: "published" },
    { id: "4", name: "Privacy Policy", lastUpdated: new Date("2025-07-10"), status: "published" },
    { id: "5", name: "FAQ", lastUpdated: new Date("2025-09-01"), status: "draft" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Content Management</h1>
        <p className="text-muted-foreground">Edit website content and pages</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contentSections.map((section) => (
          <Card key={section.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {section.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${section.status === "published" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                  {section.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-3 w-3 mr-1" />
                  Edit Content
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminContentView;
