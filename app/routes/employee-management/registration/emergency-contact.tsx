import { Form, useLoaderData, useActionData, useNavigation } from '@remix-run/react';
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { APP_CONSTANTS } from '~/config/constants';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  
  return json({
    user,
    countries: APP_CONSTANTS.COUNTRIES,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    // Validate passport information
    const validatedData = {
      passportNumber: data.passportNumber as string,
      passportIssueDate: new Date(data.passportIssueDate as string),
      passportExpiry: new Date(data.passportExpiry as string),
      nationality: data.nationality as string,
      placeOfIssue: data.placeOfIssue as string,
    };
    
    return json({
      success: true,
      data: validatedData,
      nextStep: 'emergency-contact',
    });
  } catch (error) {
    return json({
      success: false,
      message: error instanceof Error ? error.message : 'Validation failed',
    }, { status: 400 });
  }
}

export default function PassportInformationStep() {
  const { user, countries } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Step 2: Passport Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter the employee's passport details.
        </p>
      </div>

      {/* Error Message */}
      {actionData && !actionData.success && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="text-sm text-red-800">
            {actionData.message}
          </div>
        </div>
      )}

      {/* Form */}
      <Form method="post" className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Passport Number */}
          <div>
            <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700">
              Passport Number *
            </label>
            <input
              type="text"
              name="passportNumber"
              id="passportNumber"
              required
              placeholder="ET1234567"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label htmlFor="passportIssueDate" className="block text-sm font-medium text-gray-700">
              Issue Date *
            </label>
            <input
              type="date"
              name="passportIssueDate"
              id="passportIssueDate"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="passportExpiry" className="block text-sm font-medium text-gray-700">
              Expiry Date *
            </label>
            <input
              type="date"
              name="passportExpiry"
              id="passportExpiry"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Nationality */}
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Nationality *
            </label>
            <select
              name="nationality"
              id="nationality"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Nationality</option>
              {Object.values(countries).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Place of Issue */}
          <div className="sm:col-span-2">
            <label htmlFor="placeOfIssue" className="block text-sm font-medium text-gray-700">
              Place of Issue *
            </label>
            <input
              type="text"
              name="placeOfIssue"
              id="placeOfIssue"
              required
              placeholder="Addis Ababa"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Previous Step
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Next Step'}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
