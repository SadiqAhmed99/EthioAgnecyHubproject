import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // TODO: Fetch analytics data from InsForge
  return json({ trends: [] });
};

export default function TrendsPage() {
  const { trends } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Analytics & Trends">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Trends</h1>
          <p className="text-gray-600">Track key metrics and performance trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chart placeholders */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Employee Registration Trend</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart will be rendered here</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Document Verification Rate</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart will be rendered here</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Travel Departures</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart will be rendered here</p>
            </div>
          </div>
        </div>

        {/* Additional analytics sections */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Monthly Overview</h3>
          <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Monthly analytics chart</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
