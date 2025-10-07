import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const AdminReportsView = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const reportTypes = [
    { id: "1", name: "User Activity Report", description: "User registrations, logins, and engagement" },
    { id: "2", name: "Revenue Report", description: "Detailed revenue breakdown by source" },
    { id: "3", name: "Attendance Report", description: "Class attendance and booking statistics" },
    { id: "4", name: "Trainer Performance", description: "Individual trainer metrics and earnings" },
    { id: "5", name: "Product Sales Report", description: "E-commerce sales and inventory data" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Reports & Exports</h1>
        <p className="text-muted-foreground">Generate and export platform reports</p>
      </div>

      {/* Date Range Selector */}
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-accent mt-1" />
                <div className="flex-1">
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduled Reports */}
      <Card className="shadow-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No scheduled reports configured. Set up automated reporting to receive regular updates.</p>
          <Button size="sm" className="mt-4">Configure Scheduled Reports</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsView;
