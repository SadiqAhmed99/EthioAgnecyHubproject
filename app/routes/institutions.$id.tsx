import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  // TODO: Fetch institution by ID from InsForge
  return json({ institution: null, institutionId: id });
};

export default function InstitutionDetailPage() {
  const { institution, institutionId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Institution Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Institution Details</h1>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Edit
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
              Archive
            </button>
          </div>
        </div>

        {institution ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {institution.name}</p>
                <p><span className="font-medium">Type:</span> {institution.type}</p>
                <p><span className="font-medium">Address:</span> {institution.address}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Phone:</span> {institution.phone}</p>
                <p><span className="font-medium">Email:</span> {institution.email}</p>
                <p><span className="font-medium">Contact Person:</span> {institution.contactPerson}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4">Status</h3>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">Active</span>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-center py-8">Loading institution details...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
