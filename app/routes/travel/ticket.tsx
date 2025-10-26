import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ tickets: [] });
};

export default function TicketPage() {
  const { tickets } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Ticket Management">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Ticket Management</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No tickets found</td>
                </tr>
              ) : (
                tickets.map((ticket: any) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4">{ticket.employeeName}</td>
                    <td className="px-6 py-4">{ticket.ticketNumber}</td>
                    <td className="px-6 py-4">{ticket.route}</td>
                    <td className="px-6 py-4">{ticket.date}</td>
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
