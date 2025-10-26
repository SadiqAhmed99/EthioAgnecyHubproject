import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  // TODO: Fetch travel record by ID from InsForge
  return json({ travel: null, travelId: id });
};

export default function TravelDetailPage() {
  const { travel, travelId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Travel Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Travel Details</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Edit
          </button>
        </div>

        {travel ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Employee Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Employee:</span> {travel.employeeName}</p>
                <p><span className="font-medium">Status:</span> {travel.status}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Flight Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Flight Number:</span> {travel.flightNumber}</p>
                <p><span className="font-medium">Departure Date:</span> {travel.departureDate}</p>
                <p><span className="font-medium">Arrival Date:</span> {travel.arrivalDate}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Departure</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Airport:</span> {travel.departureAirport}</p>
                <p><span className="font-medium">Time:</span> {travel.departureTime}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Arrival</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Airport:</span> {travel.arrivalAirport}</p>
                <p><span className="font-medium">Time:</span> {travel.arrivalTime}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-center py-8">Loading travel details...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
