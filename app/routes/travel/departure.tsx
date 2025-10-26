import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ departures: [] });
};

export default function DeparturePage() {
  const { departures } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Departure Preparation">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Departure Preparation</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Preparation Checklist</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Documents verified and ready</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Ticket issued and confirmed</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Employee briefed on travel details</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Emergency contact information verified</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Medical clearance obtained</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Final confirmation sent to employee</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Scheduled Departures</h3>
          {departures.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No departures scheduled</p>
          ) : (
            <div className="space-y-3">
              {departures.map((dep: any) => (
                <div key={dep.id} className="border rounded p-4">
                  <p className="font-medium">{dep.employeeName}</p>
                  <p className="text-sm text-gray-600">{dep.flightNumber} - {dep.departureTime}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
