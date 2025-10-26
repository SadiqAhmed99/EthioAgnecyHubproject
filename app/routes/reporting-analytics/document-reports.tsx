import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ documents: [] });
};

export default function DocumentReportsPage() {
  const { documents } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Document Reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Document Reports</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Total Documents</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Verified</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Document Status by Type</h3>
          <p className="text-gray-500 text-center py-8">No data available</p>
        </div>
      </div>
    </AppLayout>
  );
}
