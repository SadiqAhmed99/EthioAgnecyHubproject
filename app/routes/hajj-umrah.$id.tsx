import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";
import { insforgeClient } from "~/lib/insforge.server";
import { notFound } from "remix-utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  if (!id) {
    throw notFound({ message: "Pilgrimage record not found" });
  }

  try {
    const { data: pilgrimage, error } = await insforgeClient.database
      .from('hajj_umrah')
      .select('*, employee:employees(*)')
      .eq('id', id)
      .single();

    if (error || !pilgrimage) {
      throw notFound({ message: "Pilgrimage record not found" });
    }

    return json({ pilgrimage, pilgrimageId: id });
  } catch (error) {
    console.error('Error fetching pilgrimage:', error);
    throw notFound({ message: "Pilgrimage record not found" });
  }
};

export default function PilgrimageDetailPage() {
  const { pilgrimage, pilgrimageId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Pilgrimage Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pilgrimage Details</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {pilgrimage.id}</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Edit
          </button>
        </div>

        {pilgrimage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Pilgrim Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Employee Name:</span>
                  <span>{pilgrimage.employee?.first_name} {pilgrimage.employee?.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Pilgrimage Type:</span>
                  <span className="capitalize">{pilgrimage.type || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Year:</span>
                  <span>{pilgrimage.year || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Group Number:</span>
                  <span>{pilgrimage.group_number || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Status Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Current Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    pilgrimage.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                    pilgrimage.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pilgrimage.status || 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Registration Date:</span>
                  <span>{pilgrimage.registration_date ? new Date(pilgrimage.registration_date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Departure Date:</span>
                  <span>{pilgrimage.departure_date ? new Date(pilgrimage.departure_date).toLocaleDateString() : 'Not scheduled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Return Date:</span>
                  <span>{pilgrimage.return_date ? new Date(pilgrimage.return_date).toLocaleDateString() : 'Not scheduled'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4 text-lg">Documents & Requirements</h3>
              <p className="text-gray-500 text-sm mb-4">Required documents checklist:</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${pilgrimage.passport_provided ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {pilgrimage.passport_provided ? '✓' : '○'} Passport
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${pilgrimage.visa_provided ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {pilgrimage.visa_provided ? '✓' : '○'} Visa
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${pilgrimage.certificate_provided ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {pilgrimage.certificate_provided ? '✓' : '○'} Certificate
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
