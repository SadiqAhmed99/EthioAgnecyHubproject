import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";
import { insforgeClient } from "~/lib/insforge.server";
import { notFound } from "remix-utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  if (!id) {
    throw notFound({ message: "Travel record not found" });
  }

  try {
    const { data: travel, error } = await insforgeClient.database
      .from('travels')
      .select('*, employee:employees(*)')
      .eq('id', id)
      .single();

    if (error || !travel) {
      throw notFound({ message: "Travel record not found" });
    }

    return json({ travel, travelId: id });
  } catch (error) {
    console.error('Error fetching travel record:', error);
    throw notFound({ message: "Travel record not found" });
  }
};

export default function TravelDetailPage() {
  const { travel, travelId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Travel Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Travel Details</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {travel.id}</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Edit
          </button>
        </div>

        {travel && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Employee Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Employee Name:</span>
                  <span>{travel.employee?.first_name} {travel.employee?.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    travel.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    travel.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {travel.status || 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Booking Reference:</span>
                  <span>{travel.booking_reference || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Flight Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Flight Number:</span>
                  <span>{travel.flight_number || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Airline:</span>
                  <span>{travel.airline || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Travel Date:</span>
                  <span>{travel.travel_date ? new Date(travel.travel_date).toLocaleDateString() : 'Not scheduled'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Departure</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Airport:</span>
                  <span>{travel.departure_airport || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Time:</span>
                  <span>{travel.departure_time || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Date:</span>
                  <span>{travel.departure_date ? new Date(travel.departure_date).toLocaleDateString() : 'Not scheduled'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Arrival</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Airport:</span>
                  <span>{travel.arrival_airport || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Time:</span>
                  <span>{travel.arrival_time || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Date:</span>
                  <span>{travel.arrival_date ? new Date(travel.arrival_date).toLocaleDateString() : 'Not scheduled'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4 text-lg">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Purpose:</span>
                  <p className="mt-1">{travel.purpose || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Notes:</span>
                  <p className="mt-1">{travel.notes || 'No notes'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
