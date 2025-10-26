import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ scheduledTravels: [] });
};

export default function ScheduleTravelPage() {
  const { scheduledTravels } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Schedule Travel">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Schedule Travel</h1>
        
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>Select employee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Flight Number</label>
            <input type="text" className="w-full border rounded-md px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departure Date</label>
              <input type="datetime-local" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Arrival Date</label>
              <input type="datetime-local" className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departure Airport</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Arrival Airport</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Schedule Travel
          </button>
        </form>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Scheduled Travels</h3>
          <p className="text-gray-500 text-center py-4">No scheduled travels</p>
        </div>
      </div>
    </AppLayout>
  );
}
