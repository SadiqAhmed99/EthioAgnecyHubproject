import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ agent: null });
};

export default function AgentDetailPage() {
  const { agent } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Agent Details">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Add Agent</h1>
        
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded-md px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" className="w-full border rounded-md px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>AGENT</option>
              <option>MANAGER</option>
              <option>ADMIN</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Agency</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>Select agency</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Agent
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
