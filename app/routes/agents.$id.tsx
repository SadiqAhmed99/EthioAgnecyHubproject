import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";
import { insforgeClient } from "~/lib/insforge.server";
import { notFound } from "remix-utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  if (!id) {
    throw notFound({ message: "Agent not found" });
  }

  try {
    const { data: agent, error } = await insforgeClient.database
      .from('agents')
      .select('*, user:users(*)')
      .eq('id', id)
      .single();

    if (error || !agent) {
      throw notFound({ message: "Agent not found" });
    }

    return json({ agent, agentId: id });
  } catch (error) {
    console.error('Error fetching agent:', error);
    throw notFound({ message: "Agent not found" });
  }
};

export default function AgentDetailPage() {
  const { agent, agentId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Agent Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Agent Details</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {agent.id}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Edit
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
              Deactivate
            </button>
          </div>
        </div>

        {agent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Personal Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Full Name:</span>
                  <span>{agent.first_name} {agent.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span>{agent.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span>{agent.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Role:</span>
                  <span className="capitalize">{agent.role || 'Agent'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Specialization:</span>
                  <span className="capitalize">{agent.specialization || 'Not specified'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Performance Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    agent.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    agent.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status || 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Total Processed:</span>
                  <span>{agent.total_processed || 0} clients</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Success Rate:</span>
                  <span>{agent.success_rate || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Join Date:</span>
                  <span>{agent.created_at ? new Date(agent.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4 text-lg">Recent Activity</h3>
              <p className="text-gray-500 text-sm">No recent activity recorded</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
