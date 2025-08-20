import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Header from "@/components/organisms/Header";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { attendanceService } from "@/services/api/attendanceService";
import { employeeService } from "@/services/api/employeeService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from "date-fns";

// Safe date parsing utility to prevent date-fns errors
const safeParseDate = (dateValue) => {
  if (!dateValue || dateValue === '' || dateValue === null || dateValue === undefined) {
    return null;
  }
  const parsedDate = new Date(dateValue);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const Attendance = () => {
  const { onMenuClick } = useOutletContext();
  
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("daily");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [attendanceData, employeesData] = await Promise.all([
        attendanceService.getAll(),
        employeeService.getAll()
      ]);
      setAttendance(attendanceData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const getTodayAttendance = () => {
    return attendance.filter(att => {
      const date = safeParseDate(att.date);
      return date && isToday(date);
    });
  };

  const getMonthlyStats = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
const monthlyAttendance = attendance.filter(att => {
      const date = safeParseDate(att.date);
      return date && date >= monthStart && date <= monthEnd;
    });

    const stats = {
      totalDays: eachDayOfInterval({ start: monthStart, end: monthEnd }).length,
      present: monthlyAttendance.filter(att => att.status === "Present").length,
      absent: monthlyAttendance.filter(att => att.status === "Absent").length,
      late: monthlyAttendance.filter(att => att.status === "Late").length,
      halfDay: monthlyAttendance.filter(att => att.status === "Half Day").length
    };

    return stats;
  };

  const getAttendanceByEmployee = () => {
    const employeeAttendance = {};
    
    employees.forEach(emp => {
      employeeAttendance[emp.Id] = {
        employee: emp,
        records: attendance.filter(att => att.employeeId === emp.Id.toString())
      };
    });

    return employeeAttendance;
  };

  if (loading) return <Loading variant="skeleton" className="p-6" />;

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadData}
        className="p-6"
      />
    );
  }

  const todayAttendance = getTodayAttendance();
  const monthlyStats = getMonthlyStats();
  const attendanceByEmployee = getAttendanceByEmployee();

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Attendance"
        onMenuClick={onMenuClick}
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("daily")}
            >
              <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
              Daily
            </Button>
            <Button
              variant={viewMode === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("monthly")}
            >
              <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
              Monthly
            </Button>
          </div>
        }
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {viewMode === "daily" && (
            <>
              {/* Daily Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-600">Present</p>
                      <p className="text-2xl font-bold text-green-600">
                        {todayAttendance.filter(att => att.status === "Present").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-600">Late</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {todayAttendance.filter(att => att.status === "Late").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="XCircle" className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-600">Absent</p>
                      <p className="text-2xl font-bold text-red-600">
                        {todayAttendance.filter(att => att.status === "Absent").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="MinusCircle" className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-600">Half Day</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {todayAttendance.filter(att => att.status === "Half Day").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Attendance List */}
              <div className="bg-white rounded-lg shadow-card border border-secondary-200">
                <div className="p-6 border-b border-secondary-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-secondary-900">
                      Today's Attendance - {format(new Date(), "EEEE, MMMM dd, yyyy")}
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  {todayAttendance.length === 0 ? (
                    <Empty
                      title="No attendance records"
                      description="No attendance has been recorded for today yet."
                      icon="Clock"
                    />
                  ) : (
                    <div className="space-y-4">
                      {todayAttendance.map((record) => {
                        const employee = employees.find(emp => emp.Id.toString() === record.employeeId);
                        if (!employee) return null;

                        return (
                          <div key={record.Id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
                            <div className="flex items-center space-x-4">
                              <Avatar
                                src={employee.photoUrl}
                                name={`${employee.firstName} ${employee.lastName}`}
                              />
                              <div>
                                <p className="font-medium text-secondary-900">
                                  {employee.firstName} {employee.lastName}
                                </p>
                                <p className="text-sm text-secondary-600">{employee.role}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
{record.checkIn && (() => {
                                  const checkInDate = safeParseDate(record.checkIn);
                                  return checkInDate ? (
                                    <p className="text-sm text-secondary-900">
                                      In: {format(checkInDate, "HH:mm")}
                                    </p>
                                  ) : null;
                                })()}
                                {record.checkOut && (() => {
                                  const checkOutDate = safeParseDate(record.checkOut);
                                  return checkOutDate ? (
                                    <p className="text-sm text-secondary-600">
                                      Out: {format(checkOutDate, "HH:mm")}
                                    </p>
                                  ) : null;
                                })()}
                              </div>
                              <StatusBadge status={record.status} type="attendance" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {viewMode === "monthly" && (
            <>
              {/* Monthly Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-600">Present Days</p>
                      <p className="text-2xl font-bold text-green-600">{monthlyStats.present}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-600">Late Days</p>
                      <p className="text-2xl font-bold text-yellow-600">{monthlyStats.late}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="XCircle" className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-600">Absent Days</p>
                      <p className="text-2xl font-bold text-red-600">{monthlyStats.absent}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="MinusCircle" className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-600">Half Days</p>
                      <p className="text-2xl font-bold text-blue-600">{monthlyStats.halfDay}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Attendance Summary */}
              <div className="bg-white rounded-lg shadow-card border border-secondary-200">
                <div className="p-6 border-b border-secondary-200">
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Monthly Summary - {format(selectedDate, "MMMM yyyy")}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
{Object.values(attendanceByEmployee).map(({ employee, records }) => {
                      const monthlyRecords = records.filter(record => {
                        const date = safeParseDate(record.date);
                        return date && date >= startOfMonth(selectedDate) && date <= endOfMonth(selectedDate);
                      });

                      const presentDays = monthlyRecords.filter(r => r.status === "Present").length;
                      const lateDays = monthlyRecords.filter(r => r.status === "Late").length;
                      const absentDays = monthlyRecords.filter(r => r.status === "Absent").length;
                      const halfDays = monthlyRecords.filter(r => r.status === "Half Day").length;

                      return (
                        <div key={employee.Id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar
                              src={employee.photoUrl}
                              name={`${employee.firstName} ${employee.lastName}`}
                            />
                            <div>
                              <p className="font-medium text-secondary-900">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-sm text-secondary-600">{employee.role}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm font-medium text-green-600">{presentDays}</p>
                              <p className="text-xs text-secondary-500">Present</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-yellow-600">{lateDays}</p>
                              <p className="text-xs text-secondary-500">Late</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-red-600">{absentDays}</p>
                              <p className="text-xs text-secondary-500">Absent</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-blue-600">{halfDays}</p>
                              <p className="text-xs text-secondary-500">Half Day</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Attendance;