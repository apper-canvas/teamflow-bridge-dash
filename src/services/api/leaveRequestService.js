const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'LeaveRequest_c';

export const leaveRequestService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "employeeId" } },
          { field: { Name: "startDate" } },
          { field: { Name: "endDate" } },
          { field: { Name: "type" } },
          { field: { Name: "reason" } },
          { field: { Name: "status" } },
          { field: { Name: "approvedBy" } },
          { field: { Name: "requestDate" } }
        ],
        orderBy: [
          { fieldName: "requestDate", sorttype: "DESC" }
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
        console.error("Error fetching leave requests:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching leave requests:", error.message);
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
          { field: { Name: "startDate" } },
          { field: { Name: "endDate" } },
          { field: { Name: "type" } },
          { field: { Name: "reason" } },
          { field: { Name: "status" } },
          { field: { Name: "approvedBy" } },
          { field: { Name: "requestDate" } }
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
        console.error(`Error fetching leave request with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching leave request with ID ${id}:`, error.message);
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
          { field: { Name: "startDate" } },
          { field: { Name: "endDate" } },
          { field: { Name: "type" } },
          { field: { Name: "reason" } },
          { field: { Name: "status" } },
          { field: { Name: "approvedBy" } },
          { field: { Name: "requestDate" } }
        ],
        where: [
          { FieldName: "employeeId", Operator: "EqualTo", Values: [employeeId.toString()] }
        ],
        orderBy: [
          { fieldName: "requestDate", sorttype: "DESC" }
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
        console.error(`Error fetching leave requests for employee ${employeeId}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching leave requests for employee ${employeeId}:`, error.message);
        throw error;
      }
    }
  },

  async getByStatus(status) {
    try {
      if (!status) {
        return await this.getAll();
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "employeeId" } },
          { field: { Name: "startDate" } },
          { field: { Name: "endDate" } },
          { field: { Name: "type" } },
          { field: { Name: "reason" } },
          { field: { Name: "status" } },
          { field: { Name: "approvedBy" } },
          { field: { Name: "requestDate" } }
        ],
        where: [
          { FieldName: "status", Operator: "EqualTo", Values: [status] }
        ],
        orderBy: [
          { fieldName: "requestDate", sorttype: "DESC" }
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
        console.error(`Error fetching leave requests with status ${status}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching leave requests with status ${status}:`, error.message);
        throw error;
      }
    }
  },

  async create(leaveRequestData) {
    try {
      const params = {
        records: [
          {
            employeeId: leaveRequestData.employeeId,
            startDate: leaveRequestData.startDate,
            endDate: leaveRequestData.endDate,
            type: leaveRequestData.type,
            reason: leaveRequestData.reason,
            status: "Pending",
            requestDate: new Date().toISOString(),
            approvedBy: ""
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
          console.error(`Failed to create leave requests ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create leave request record");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating leave request:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating leave request:", error.message);
        throw error;
      }
    }
  },

  async update(id, leaveRequestData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            employeeId: leaveRequestData.employeeId,
            startDate: leaveRequestData.startDate,
            endDate: leaveRequestData.endDate,
            type: leaveRequestData.type,
            reason: leaveRequestData.reason,
            status: leaveRequestData.status,
            approvedBy: leaveRequestData.approvedBy,
            requestDate: leaveRequestData.requestDate
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
          console.error(`Failed to update leave requests ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update leave request record");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating leave request:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating leave request:", error.message);
        throw error;
      }
    }
  },

  async approve(id, approvedBy) {
    try {
      // First get the current record
      const currentRecord = await this.getById(id);
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            employeeId: currentRecord.employeeId,
            startDate: currentRecord.startDate,
            endDate: currentRecord.endDate,
            type: currentRecord.type,
            reason: currentRecord.reason,
            status: "Approved",
            approvedBy: approvedBy,
            requestDate: currentRecord.requestDate
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
          console.error(`Failed to approve leave requests ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to approve leave request");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error approving leave request:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error approving leave request:", error.message);
        throw error;
      }
    }
  },

  async reject(id, approvedBy) {
    try {
      // First get the current record
      const currentRecord = await this.getById(id);
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            employeeId: currentRecord.employeeId,
            startDate: currentRecord.startDate,
            endDate: currentRecord.endDate,
            type: currentRecord.type,
            reason: currentRecord.reason,
            status: "Rejected",
            approvedBy: approvedBy,
            requestDate: currentRecord.requestDate
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
          console.error(`Failed to reject leave requests ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to reject leave request");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error rejecting leave request:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error rejecting leave request:", error.message);
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
          console.error(`Failed to delete leave requests ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete leave request record");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting leave request:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting leave request:", error.message);
        throw error;
      }
    }
  }
};