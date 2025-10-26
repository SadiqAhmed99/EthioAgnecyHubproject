import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ employees: [] });
};

export default function PilgrimDetailPage() {
  const { employees } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Pilgrim Registration">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Register Pilgrim</h1>
        
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>Select employee</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pilgrimage Type</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>HAJJ</option>
              <option>UMRAH</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input type="number" className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Group Number</label>
            <input type="text" className="w-full border rounded-md px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departure Date</label>
              <input type="date" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Return Date</label>
              <input type="date" className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Register Pilgrim
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
