import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  // TODO: Fetch employee by ID from InsForge
  return json({ employee: null, employeeId: id });
};

export default function EmployeeDetailPage() {
  const { employee, employeeId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Employee Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employee Details</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Edit Employee
          </button>
        </div>

        {employee ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {employee.name}</p>
                <p><span className="font-medium">Date of Birth:</span> {employee.dateOfBirth}</p>
                <p><span className="font-medium">Gender:</span> {employee.gender}</p>
                <p><span className="font-medium">Phone:</span> {employee.phone}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Employment Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Employee ID:</span> {employee.employeeId}</p>
                <p><span className="font-medium">Status:</span> {employee.status}</p>
                <p><span className="font-medium">Agency:</span> {employee.agency}</p>
                <p><span className="font-medium">Registration Date:</span> {employee.registrationDate}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Skills</h3>
              <p className="text-gray-500 text-sm">No skills listed</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Documents</h3>
              <p className="text-gray-500 text-sm">No documents uploaded</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-center py-8">Loading employee details...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
