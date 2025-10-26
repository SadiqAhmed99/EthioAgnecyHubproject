import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ collaborations: [] });
};

export default function CollaborationPage() {
  const { collaborations } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Collaboration Tools">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Collaboration Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Shared Documents</h3>
            <p className="text-gray-500 text-center py-8">No shared documents</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Communication Channels</h3>
            <div className="space-y-3">
              <div className="border rounded p-4">
                <h4 className="font-medium">MOLS Portal</h4>
                <p className="text-sm text-gray-600">Ministry of Labor and Social Affairs</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">Access</button>
              </div>
              <div className="border rounded p-4">
                <h4 className="font-medium">Embassy Portal</h4>
                <p className="text-sm text-gray-600">Ethiopian Embassy Integration</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">Access</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Recent Collaborations</h3>
          {collaborations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent collaborations</p>
          ) : (
            <div className="space-y-3">
              {collaborations.map((collab: any) => (
                <div key={collab.id} className="border rounded p-4">
                  <p className="font-medium">{collab.title}</p>
                  <p className="text-sm text-gray-600">{collab.institution} - {collab.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
