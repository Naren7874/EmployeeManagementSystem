import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Search } from "lucide-react";
import apiReq from "@/lib/apiReq";
import toast from "react-hot-toast";
import EmployeeForm from "./EmployeeForm.jsx"; // You'll need to create this component

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiReq.get("/Employee", {
        params: {
          search: searchQuery,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });
      setEmployees(response.data);
      // If your backend returns total count, use that instead
      // setPagination(prev => ({...prev, totalCount: response.data.totalCount}));
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery, pagination.pageIndex]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on new search
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      const toastId = toast.loading("Deleting employee...");
      await apiReq.delete(`/Employee/${id}`);
      toast.success("Employee deleted successfully", { id: toastId });
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const toastId = toast.loading(
        currentEmployee ? "Updating employee..." : "Adding employee..."
      );

      if (currentEmployee) {
        await apiReq.put(`/Employee/${currentEmployee.id}`, formData);
        toast.success("Employee updated successfully", { id: toastId });
      } else {
        await apiReq.post("/Employee", formData);
        toast.success("Employee added successfully", { id: toastId });
      }

      setIsFormOpen(false);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      console.error("Error saving employee:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-medium">Employees</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9 w-[200px] sm:w-[300px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button size="sm" onClick={handleAddEmployee}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    <TableCell>{employee.department?.name || "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/employees/${employee.id}`)
                            }
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(0, prev.pageIndex - 1),
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.pageIndex + 1} {/* Display as 1-based */}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={employees.length < pagination.pageSize}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Form Modal/Dialog */}
      {isFormOpen && (
        <EmployeeForm
          employee={currentEmployee}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default EmployeeList;
