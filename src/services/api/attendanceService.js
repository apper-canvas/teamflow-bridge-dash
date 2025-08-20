const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'Attendance_c';

export const attendanceService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "employeeId" } },
          { field: { Name: "date" } },
          { field: { Name: "checkIn" } },
          { field: { Name: "checkOut" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance records:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance records:", error.message);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "employeeId" } },
          { field: { Name: "date" } },
          { field: { Name: "checkIn" } },
          { field: { Name: "checkOut" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching attendance record with ID ${id}:`, error.message);
        throw error;
      }
    }
  },

  async getByEmployeeId(employeeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "employeeId" } },
          { field: { Name: "date" } },
          { field: { Name: "checkIn" } },
          { field: { Name: "checkOut" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ],
        where: [
          { FieldName: "employeeId", Operator: "EqualTo", Values: [employeeId.toString()] }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance records for employee ${employeeId}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching attendance records for employee ${employeeId}:`, error.message);
        throw error;
      }
    }
  },

  async getByDate(date) {
    try {
      const targetDate = new Date(date).toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "employeeId" } },
          { field: { Name: "date" } },
          { field: { Name: "checkIn" } },
          { field: { Name: "checkOut" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ],
        where: [
          { FieldName: "date", Operator: "EqualTo", Values: [targetDate] }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance records for date ${date}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching attendance records for date ${date}:`, error.message);
        throw error;
      }
    }
  },

  async create(attendanceData) {
    try {
      const params = {
        records: [
          {
            employeeId: attendanceData.employeeId,
            date: attendanceData.date,
            checkIn: attendanceData.checkIn,
            checkOut: attendanceData.checkOut,
            status: attendanceData.status,
            notes: attendanceData.notes || ""
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance records ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create attendance record");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating attendance record:", error.message);
        throw error;
      }
    }
  },

  async update(id, attendanceData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            employeeId: attendanceData.employeeId,
            date: attendanceData.date,
            checkIn: attendanceData.checkIn,
            checkOut: attendanceData.checkOut,
            status: attendanceData.status,
            notes: attendanceData.notes
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update attendance records ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update attendance record");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating attendance record:", error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete attendance records ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete attendance record");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting attendance record:", error.message);
        throw error;
      }
    }
  }
};