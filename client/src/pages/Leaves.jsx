import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Dummy leave data
const dummyLeaves = [
  {
    id: 1,
    employeeName: "John Doe",
    leaveType: "Sick Leave",
    startDate: "2023-10-15",
    endDate: "2023-10-17",
    reason: "Flu",
    status: "Approved",
    userId: 1,
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    leaveType: "Vacation",
    startDate: "2023-11-01",
    endDate: "2023-11-07",
    reason: "Family trip",
    status: "Pending",
    userId: 2,
  },
  {
    id: 3,
    employeeName: "Mike Johnson",
    leaveType: "Personal Leave",
    startDate: "2023-10-20",
    endDate: "2023-10-20",
    reason: "Doctor appointment",
    status: "Rejected",
    userId: 3,
  },
];

const Leaves = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState(dummyLeaves);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || { role: "Employee" });
  const isAdmin = user.role === "Admin";

  // Filter leaves for employees
  const userLeaves = isAdmin
    ? leaves
    : leaves.filter((leave) => leave.userId === user.id);

  const leaveTypes = [
    "Sick Leave",
    "Vacation",
    "Personal Leave",
    "Maternity/Paternity",
    "Bereavement",
  ];

  const statusColors = {
    Approved: "bg-green-500",
    Rejected: "bg-red-500",
    Pending: "bg-yellow-500",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeave = {
      id: leaves.length + 1,
      employeeName: user.name || "Current User",
      ...formData,
      status: "Pending",
      userId: user.id || 1,
    };
    setLeaves([...leaves, newLeave]);
    setIsDialogOpen(false);
    setFormData({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  const handleStatusChange = (id, status) => {
    setLeaves(
      leaves.map((leave) => (leave.id === id ? { ...leave, status } : leave))
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-medium">
            {isAdmin ? "Leave Management" : "My Leaves"}
          </CardTitle>
          {!isAdmin && (
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Apply for Leave
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Employee</TableHead>}
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} className="text-center">
                    No leaves found
                  </TableCell>
                </TableRow>
              ) : (
                userLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    {isAdmin && <TableCell>{leave.employeeName}</TableCell>}
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{formatDate(leave.startDate)}</TableCell>
                    <TableCell>{formatDate(leave.endDate)}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[leave.status]}>
                        {leave.status}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        {leave.status === "Pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusChange(leave.id, "Approved")
                              }
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusChange(leave.id, "Rejected")
                              }
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select
                value={formData.leaveType}
                onValueChange={(value) =>
                  setFormData({ ...formData, leaveType: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                  className=" dark:text-white text-black [color-scheme:auto] dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                  className=" dark:text-white text-black [color-scheme:auto] dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leaves;
