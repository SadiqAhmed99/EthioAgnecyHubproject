import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ agents: [] });
};

export default function OnboardingPage() {
  const { agents } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Agent Onboarding">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Agent Onboarding</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Onboarding Checklist</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Create agent account</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Assign role and permissions</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Provide system access credentials</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Schedule training session</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Review system documentation</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Complete onboarding survey</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">New Agents</h3>
          {agents.length === 0 ? (
            <p className="text-gray-500">No new agents</p>
          ) : (
            <div className="space-y-2">
              {agents.map((agent: any) => (
                <div key={agent.id} className="border rounded p-3">
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-gray-500">Joined: {agent.joinDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
