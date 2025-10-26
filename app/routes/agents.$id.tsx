import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  // TODO: Fetch agent by ID from InsForge
  return json({ agent: null, agentId: id });
};

export default function AgentDetailPage() {
  const { agent, agentId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Agent Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Agent Details</h1>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Edit
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Deactivate
            </button>
          </div>
        </div>

        {agent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {agent.name}</p>
                <p><span className="font-medium">Email:</span> {agent.email}</p>
                <p><span className="font-medium">Phone:</span> {agent.phone}</p>
                <p><span className="font-medium">Role:</span> {agent.role}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Performance Stats</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Total Processed:</span> {agent.totalProcessed || 0}</p>
                <p><span className="font-medium">Success Rate:</span> {agent.successRate || 0}%</p>
                <p><span className="font-medium">Join Date:</span> {agent.joinDate}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-center py-8">Loading agent details...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
