import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ tickets: [] });
};

export default function SupportPage() {
  const { tickets } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Support Tools">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Support Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">📞 Help Center</h3>
            <p className="text-sm text-gray-600 mb-4">Access documentation and guides</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Visit Help Center
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">💬 Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Get instant support from our team</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Start Chat
            </button>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">🎫 Submit Ticket</h3>
            <p className="text-sm text-gray-600 mb-4">Report issues or request features</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Create Ticket
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Recent Support Tickets</h3>
          {tickets.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tickets yet</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket: any) => (
                <div key={ticket.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-gray-500">{ticket.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{ticket.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
