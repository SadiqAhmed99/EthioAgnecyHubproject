import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";
import { insforgeClient } from "~/lib/insforge.server";
import { notFound } from "remix-utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  if (!id) {
    throw notFound({ message: "Employee not found" });
  }

  try {
    // Fetch employee from InsForge
    const { data: employee, error } = await insforgeClient.database
      .from('employees')
      .select('*, agency:agencies(*), passport:passports(*), skills(*), languages(*)')
      .eq('id', id)
      .single();

    if (error || !employee) {
      throw notFound({ message: "Employee not found" });
    }

    return json({ employee, employeeId: id });
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw notFound({ message: "Employee not found" });
  }
};

export default function EmployeeDetailPage() {
  const { employee, employeeId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/employee-management?edit=${employeeId}`);
  };

  return (
    <AppLayout title="Employee Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Employee Details</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {employee.id}</p>
          </div>
          <button 
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Edit Employee
          </button>
        </div>

        {employee && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Personal Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Full Name:</span>
                  <span>{employee.first_name} {employee.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Date of Birth:</span>
                  <span>{employee.date_of_birth || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Gender:</span>
                  <span>{employee.gender || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span>{employee.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span>{employee.email || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Employment Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Employee ID:</span>
                  <span>{employee.employee_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${employee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {employee.status || 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Agency:</span>
                  <span>{employee.agency?.name || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Registration Date:</span>
                  <span>{employee.created_at ? new Date(employee.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Skills</h3>
              {employee.skills && employee.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill: any) => (
                    <span key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs">
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills listed</p>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Documents</h3>
              {employee.passport ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Passport</span>
                    <button className="text-blue-600 hover:text-blue-800 text-xs">View</button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4 text-lg">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Address:</span>
                  <p className="mt-1">{employee.address || 'Not provided'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Emergency Contact:</span>
                  <p className="mt-1">{employee.emergency_contact || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
