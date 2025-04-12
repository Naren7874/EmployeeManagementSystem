import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  
  export default function EmployeeTaskList() {
    const data = [
      {
        title: "Profile Verification",
        section: "HR",
        status: "In Process",
        target: 12,
        limit: 10,
        reviewer: "Aman Singh",
      },
      {
        title: "Payroll Setup",
        section: "Finance",
        status: "Done",
        target: 22,
        limit: 15,
        reviewer: "Priya Sharma",
      },
      {
        title: "Workstation Allocation",
        section: "IT",
        status: "In Process",
        target: 5,
        limit: 10,
        reviewer: "N/A",
      },
      {
        title: "Leave Policy Update",
        section: "HR",
        status: "Done",
        target: 14,
        limit: 20,
        reviewer: "Esha Roy",
      },
      {
        title: "Exit Interview Planning",
        section: "Admin",
        status: "Pending",
        target: 10,
        limit: 8,
        reviewer: "",
      },
    ];
  
    const getStatusBadge = (status) => {
      switch (status) {
        case "Done":
          return <Badge variant="default">Done</Badge>;
        case "In Process":
          return <Badge variant="secondary">In Process</Badge>;
        case "Pending":
          return <Badge variant="outline">Pending</Badge>;
        default:
          return <Badge variant="ghost">{status}</Badge>;
      }
    };
  
    return (
      <div className="mt-6 border rounded-md overflow-hidden bg-muted">
        <Table>
          <TableHeader className="bg-muted-foreground/10">
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Reviewer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.section}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{item.target}</TableCell>
                <TableCell>{item.limit}</TableCell>
                <TableCell>
                  {item.reviewer ? (
                    item.reviewer
                  ) : (
                    <Select>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Assign reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Esha">Esha Roy</SelectItem>
                        <SelectItem value="Aman">Aman Singh</SelectItem>
                        <SelectItem value="Priya">Priya Sharma</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        {/* Optional Pagination Controls */}
        <div className="flex justify-between items-center p-4 text-muted-foreground text-xs">
          <span>Rows per page: 10</span>
          <div className="space-x-2">
            <Button size="sm" variant="ghost">«</Button>
            <Button size="sm" variant="ghost">1</Button>
            <Button size="sm" variant="ghost">»</Button>
          </div>
        </div>
      </div>
    );
  }
  