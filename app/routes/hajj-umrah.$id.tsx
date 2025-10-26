import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  // TODO: Fetch pilgrimage record by ID from InsForge
  return json({ pilgrimage: null, pilgrimageId: id });
};

export default function PilgrimageDetailPage() {
  const { pilgrimage, pilgrimageId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Pilgrimage Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pilgrimage Details</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Edit
          </button>
        </div>

        {pilgrimage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Pilgrim Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Employee:</span> {pilgrimage.employeeName}</p>
                <p><span className="font-medium">Type:</span> {pilgrimage.type}</p>
                <p><span className="font-medium">Year:</span> {pilgrimage.year}</p>
                <p><span className="font-medium">Group Number:</span> {pilgrimage.groupNumber}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Status</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Current Status:</span> {pilgrimage.status}</p>
                <p><span className="font-medium">Registration Date:</span> {pilgrimage.registrationDate}</p>
                <p><span className="font-medium">Departure Date:</span> {pilgrimage.departureDate || 'Not scheduled'}</p>
                <p><span className="font-medium">Return Date:</span> {pilgrimage.returnDate || 'Not scheduled'}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4">Documents</h3>
              <p className="text-gray-500 text-sm">No documents uploaded</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-center py-8">Loading pilgrimage details...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
