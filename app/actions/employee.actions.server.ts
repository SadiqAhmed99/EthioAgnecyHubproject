import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { employeeService } from '~/services/employee/employeeService.server';
import { EmployeeCreateSchema, EmployeeUpdateSchema } from '~/models/schemas/employee.schema';
import { ValidationError } from '~/middleware/errorMiddleware.server';
import { APP_CONSTANTS } from '~/config/constants';

export async function createEmployeeAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    // Validate data
    const validatedData = EmployeeCreateSchema.parse(data);
    
    // Create employee
    const employee = await employeeService.createEmployee(validatedData);
    
    return json({
      success: true,
      message: APP_CONSTANTS.SUCCESS_MESSAGES.EMPLOYEE_CREATED,
      employee,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return json({
        success: false,
        message: error.message,
      }, { status: 400 });
    }
    
    return json({
      success: false,
      message: APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR,
    }, { status: 500 });
  }
}

export async function updateEmployeeAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const employeeId = data.id as string;
    
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }
    
    // Validate data
    const validatedData = EmployeeUpdateSchema.parse(data);
    
    // Update employee
    const employee = await employeeService.updateEmployee(employeeId, validatedData);
    
    return json({
      success: true,
      message: APP_CONSTANTS.SUCCESS_MESSAGES.EMPLOYEE_UPDATED,
      employee,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return json({
        success: false,
        message: error.message,
      }, { status: 400 });
    }
    
    return json({
      success: false,
      message: APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR,
    }, { status: 500 });
  }
}

export async function deleteEmployeeAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const employeeId = formData.get('id') as string;
    
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }
    
    // Delete employee
    await employeeService.deleteEmployee(employeeId);
    
    return json({
      success: true,
      message: APP_CONSTANTS.SUCCESS_MESSAGES.EMPLOYEE_DELETED,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return json({
        success: false,
        message: error.message,
      }, { status: 400 });
    }
    
    return json({
      success: false,
      message: APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR,
    }, { status: 500 });
  }
}

export async function bulkUpdateEmployeesAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const employeeIds = JSON.parse(formData.get('ids') as string) as string[];
    const updateData = JSON.parse(formData.get('data') as string);
    
    if (!employeeIds || !Array.isArray(employeeIds)) {
      throw new ValidationError('Employee IDs are required');
    }
    
    if (!updateData) {
      throw new ValidationError('Update data is required');
    }
    
    // Bulk update employees
    const result = await employeeService.bulkUpdateEmployees(employeeIds, updateData);
    
    return json({
      success: true,
      message: `${employeeIds.length} employees updated successfully`,
      updatedCount: result.count,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return json({
        success: false,
        message: error.message,
      }, { status: 400 });
    }
    
    return json({
      success: false,
      message: APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR,
    }, { status: 500 });
  }
}

export async function updateEmployeeStatusAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const employeeId = formData.get('id') as string;
    const status = formData.get('status') as string;
    
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }
    
    if (!status) {
      throw new ValidationError('Status is required');
    }
    
    // Validate status
    if (!APP_CONSTANTS.STATUSES.EMPLOYEE.includes(status)) {
      throw new ValidationError('Invalid status');
    }
    
    // Update employee status
    const employee = await employeeService.updateEmployeeStatus(employeeId, status);
    
    return json({
      success: true,
      message: `Employee status updated to ${status}`,
      employee,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return json({
        success: false,
        message: error.message,
      }, { status: 400 });
    }
    
    return json({
      success: false,
      message: APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR,
    }, { status: 500 });
  }
}
