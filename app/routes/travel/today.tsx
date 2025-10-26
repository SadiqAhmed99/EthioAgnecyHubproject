import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ todaysDepartures: [] });
};

export default function TodaysDeparturesPage() {
  const { todaysDepartures } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Today's Departures">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Today's Departures</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 bg-blue-50 border-b">
            <p className="text-sm font-medium text-blue-900">
              {todaysDepartures.length} departures scheduled for today
            </p>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {todaysDepartures.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No departures today</td>
                </tr>
              ) : (
                todaysDepartures.map((dep: any) => (
                  <tr key={dep.id}>
                    <td className="px-6 py-4">{dep.employeeName}</td>
                    <td className="px-6 py-4">{dep.flightNumber}</td>
                    <td className="px-6 py-4">{dep.departureTime}</td>
                    <td className="px-6 py-4">{dep.destination}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
