import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatusBadge from "@/components/molecules/StatusBadge";
import { employeeService } from "@/services/api/employeeService";
import { attendanceService } from "@/services/api/attendanceService";
import { leaveRequestService } from "@/services/api/leaveRequestService";
import { format, startOfMonth, endOfMonth, isToday } from "date-fns";

// Safe date parsing utility to prevent date-fns errors
const safeParseDate = (dateValue) => {
  if (!dateValue || dateValue === '' || dateValue === null || dateValue === undefined) {
    return null;
  }
  const parsedDate = new Date(dateValue);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const Dashboard = () => {
  const { onMenuClick } = useOutletContext();
  
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    presentToday: 0,
    pendingLeaveRequests: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [employeesData, attendanceData, leaveRequestsData] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getAll(),
        leaveRequestService.getAll()
      ]);

      setEmployees(employeesData);
      setAttendance(attendanceData);
      setLeaveRequests(leaveRequestsData);

      // Calculate stats
const activeEmployees = employeesData.filter(emp => emp.status === "Active").length;
      const todayAttendance = attendanceData.filter(att => {
        const date = safeParseDate(att.date);
        return date && isToday(date);
      });
      const presentToday = todayAttendance.filter(att => att.status === "Present" || att.status === "Late").length;
      const pendingRequests = leaveRequestsData.filter(req => req.status === "Pending").length;

      setStats({
        totalEmployees: employeesData.length,
        activeEmployees,
        presentToday,
        pendingLeaveRequests: pendingRequests
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: "join",
      message: "Amanda Taylor joined Engineering department",
      time: "2 hours ago",
      icon: "UserPlus",
      color: "text-green-600 bg-green-100"
    },
    {
      id: 2,
      type: "leave",
      message: "Michael Chen requested vacation leave",
      time: "4 hours ago",
      icon: "Calendar",
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: 3,
      type: "update",
      message: "Sarah Johnson updated her profile",
      time: "6 hours ago",
      icon: "Edit",
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: 4,
      type: "attendance",
      message: "David Wilson marked absent due to illness",
      time: "1 day ago",
      icon: "Clock",
      color: "text-orange-600 bg-orange-100"
    }
  ];

  if (loading) return <Loading variant="skeleton" className="p-6" />;

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadDashboardData}
        className="p-6"
      />
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Dashboard"
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Employees</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {stats.totalEmployees}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="UserCheck" className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Active Employees</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    {stats.activeEmployees}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Present Today</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {stats.presentToday}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Pending Requests</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                    {stats.pendingLeaveRequests}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-card border border-secondary-200">
              <div className="p-6 border-b border-secondary-200">
                <h2 className="text-lg font-semibold text-secondary-900">Recent Activities</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                        <ApperIcon name={activity.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-secondary-900">{activity.message}</p>
                        <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Attendance */}
            <div className="bg-white rounded-lg shadow-card border border-secondary-200">
              <div className="p-6 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-secondary-900">Today's Attendance</h2>
                  <span className="text-sm text-secondary-500">
                    {format(new Date(), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {attendance
.filter(att => {
                      const date = safeParseDate(att.date);
                      return date && isToday(date);
                    })
                    .slice(0, 5)
                    .map((att) => {
                      const employee = employees.find(emp => emp.Id.toString() === att.employeeId);
                      if (!employee) return null;
                      
                      return (
                        <div key={att.Id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar
                              src={employee.photoUrl}
                              name={`${employee.firstName} ${employee.lastName}`}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-medium text-secondary-900">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-xs text-secondary-500">{employee.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={att.status} type="attendance" />
                            {att.checkIn && (
<span className="text-xs text-secondary-500">
                                {(() => {
                                  const checkInDate = safeParseDate(att.checkIn);
                                  return checkInDate ? format(checkInDate, "HH:mm") : "--:--";
                                })()}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Pending Leave Requests */}
          {stats.pendingLeaveRequests > 0 && (
            <div className="bg-white rounded-lg shadow-card border border-secondary-200">
              <div className="p-6 border-b border-secondary-200">
                <h2 className="text-lg font-semibold text-secondary-900">Pending Leave Requests</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {leaveRequests
                    .filter(req => req.status === "Pending")
                    .slice(0, 3)
                    .map((request) => {
                      const employee = employees.find(emp => emp.Id.toString() === request.employeeId);
                      if (!employee) return null;

                      return (
                        <div key={request.Id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar
                              src={employee.photoUrl}
                              name={`${employee.firstName} ${employee.lastName}`}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-medium text-secondary-900">
                                {employee.firstName} {employee.lastName}
                              </p>
<p className="text-xs text-secondary-600">
                                {request.type} • {(() => {
                                  const startDate = safeParseDate(request.startDate);
                                  const endDate = safeParseDate(request.endDate);
                                  if (startDate && endDate) {
                                    return `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`;
                                  }
                                  return "Invalid dates";
                                })()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="accent" size="sm">
                              <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm">
                              <ApperIcon name="X" className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;