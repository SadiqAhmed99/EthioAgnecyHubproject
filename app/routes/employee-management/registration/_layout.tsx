import { Outlet, useLoaderData, useActionData, Form, useNavigation } from '@remix-run/react';
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { employeeService } from '~/services/employee/employeeService.server';
import { EmployeeCreateSchema } from '~/models/schemas/employee.schema';
import { APP_CONSTANTS } from '~/config/constants';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  
  // Get regions for dropdown
  const regions = APP_CONSTANTS.ETHIOPIAN_REGIONS;
  
  return json({
    user,
    regions,
  });
}

export async function action({ request }: ActionFunctionArgs) {
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
    return json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create employee',
    }, { status: 400 });
  }
}

export default function EmployeeRegistrationLayout() {
  const { user, regions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Registration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Register new employees with comprehensive information collection.
        </p>
      </div>

      {/* Success/Error Messages */}
      {actionData && (
        <div className={`rounded-md p-4 ${
          actionData.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className={`text-sm ${
            actionData.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {actionData.message}
          </div>
        </div>
      )}

      {/* Registration Wizard */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Registration Wizard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete all steps to register a new employee.
          </p>
        </div>
        
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
