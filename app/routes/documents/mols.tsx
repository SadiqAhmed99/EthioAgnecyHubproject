import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ syncStatus: 'idle', lastSync: null });
};

export default function MOLSPage() {
  const { syncStatus, lastSync } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="MOLS Integration">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">MOLS Integration</h1>
            <p className="text-gray-600">Sync with Ministry of Labor and Social Affairs</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Sync Documents
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Connection Status</h3>
          <div className="space-y-2">
            <p className="text-sm"><span className="font-medium">Status:</span> <span className="text-green-600">Connected</span></p>
            <p className="text-sm"><span className="font-medium">Last Sync:</span> {lastSync || 'Never'}</p>
            <p className="text-sm"><span className="font-medium">Pending Documents:</span> 0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Recent Sync Log</h3>
          <p className="text-gray-500 text-center py-4">No sync log available</p>
        </div>
      </div>
    </AppLayout>
  );
}
