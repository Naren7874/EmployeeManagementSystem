import EmployeeTaskList from "@/components/EmployeeTaskList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Salary</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-500">
            ₹30,000
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Count</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-blue-500">
            2
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-purple-500">
            2
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On Leave Today</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>Emp1 - Casual Leave</li>
              <li>Emp2 - Casual Leave</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Department Wise Employee Chart</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Replace with actual chart library */}
          <div className="h-[250px] rounded-md bg-gradient-to-br from-blue-700 via-blue-600 to-green-600 flex items-center justify-center text-sm text-white  ">
            Chart Placeholder (e.g., Emp Join, Leaves, Attrition)
          </div>
        </CardContent>
      </Card>

      {/* Task List Always Visible */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeTaskList />
        </CardContent>
      </Card>
    </div>
  );
}
