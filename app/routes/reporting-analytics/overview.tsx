import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ stats: {} });
};

export default function AnalyticsOverviewPage() {
  const { stats } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Analytics Dashboard">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Total Employees</h3>
            <p className="text-3xl font-bold mt-2">0</p>
            <p className="text-xs text-gray-500 mt-1">No change from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Active Documents</h3>
            <p className="text-3xl font-bold mt-2">0</p>
            <p className="text-xs text-gray-500 mt-1">No change from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Pending Reviews</h3>
            <p className="text-3xl font-bold mt-2">0</p>
            <p className="text-xs text-gray-500 mt-1">No change from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
            <p className="text-3xl font-bold mt-2">0%</p>
            <p className="text-xs text-gray-500 mt-1">No change from last month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Activity chart</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Performance Trends</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Trends chart</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
