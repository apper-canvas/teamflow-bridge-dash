const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'employee_c';

export const employeeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "photoUrl" } },
          { field: { Name: "department" } },
          { field: { Name: "role" } },
          { field: { Name: "hireDate" } },
          { field: { Name: "salary" } },
          { field: { Name: "status" } },
          { field: { Name: "address" } },
          { field: { Name: "emergencyContact" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "ASC" }
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
        console.error("Error fetching employees:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching employees:", error.message);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "photoUrl" } },
          { field: { Name: "department" } },
          { field: { Name: "role" } },
          { field: { Name: "hireDate" } },
          { field: { Name: "salary" } },
          { field: { Name: "status" } },
          { field: { Name: "address" } },
          { field: { Name: "emergencyContact" } }
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
        console.error(`Error fetching employee with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching employee with ID ${id}:`, error.message);
        throw error;
      }
    }
  },

  async create(employeeData) {
    try {
      const params = {
        records: [
          {
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            phone: employeeData.phone,
            photoUrl: employeeData.photoUrl,
            department: employeeData.department,
            role: employeeData.role,
            hireDate: employeeData.hireDate,
            salary: parseFloat(employeeData.salary) || 0,
            status: employeeData.status || "Active",
            address: employeeData.address,
            emergencyContact: employeeData.emergencyContact
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
          console.error(`Failed to create employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create employee record");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating employee:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating employee:", error.message);
        throw error;
      }
    }
  },

  async update(id, employeeData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            phone: employeeData.phone,
            photoUrl: employeeData.photoUrl,
            department: employeeData.department,
            role: employeeData.role,
            hireDate: employeeData.hireDate,
            salary: parseFloat(employeeData.salary) || 0,
            status: employeeData.status,
            address: employeeData.address,
            emergencyContact: employeeData.emergencyContact
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
          console.error(`Failed to update employees ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update employee record");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating employee:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating employee:", error.message);
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
          console.error(`Failed to delete employees ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete employee record");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting employee:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting employee:", error.message);
        throw error;
      }
    }
  },

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "photoUrl" } },
          { field: { Name: "department" } },
          { field: { Name: "role" } },
          { field: { Name: "hireDate" } },
          { field: { Name: "salary" } },
          { field: { Name: "status" } },
          { field: { Name: "address" } },
          { field: { Name: "emergencyContact" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  { fieldName: "firstName", operator: "Contains", values: [query] }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  { fieldName: "lastName", operator: "Contains", values: [query] }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  { fieldName: "email", operator: "Contains", values: [query] }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  { fieldName: "department", operator: "Contains", values: [query] }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  { fieldName: "role", operator: "Contains", values: [query] }
                ],
                operator: "OR"
              }
            ]
          }
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
        console.error("Error searching employees:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error searching employees:", error.message);
        throw error;
      }
    }
  },

  async filterByDepartment(department) {
    try {
      if (!department) {
        return await this.getAll();
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "photoUrl" } },
          { field: { Name: "department" } },
          { field: { Name: "role" } },
          { field: { Name: "hireDate" } },
          { field: { Name: "salary" } },
          { field: { Name: "status" } },
          { field: { Name: "address" } },
          { field: { Name: "emergencyContact" } }
        ],
        where: [
          { FieldName: "department", Operator: "EqualTo", Values: [department] }
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
        console.error("Error filtering employees by department:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error filtering employees by department:", error.message);
        throw error;
      }
    }
  }
};