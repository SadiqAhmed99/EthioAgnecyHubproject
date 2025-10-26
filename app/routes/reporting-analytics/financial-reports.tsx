import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ financials: {} });
};

export default function FinancialReportsPage() {
  const { financials } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Financial Reports">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2">ETB 0</p>
            <p className="text-xs text-green-600 mt-1">↗ 0% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
            <p className="text-3xl font-bold mt-2">ETB 0</p>
            <p className="text-xs text-red-600 mt-1">↘ 0% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
            <p className="text-3xl font-bold mt-2">ETB 0</p>
            <p className="text-xs text-blue-600 mt-1">= 0% margin</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Pending Payments</h3>
            <p className="text-3xl font-bold mt-2">ETB 0</p>
            <p className="text-xs text-yellow-600 mt-1">Awaiting collection</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Financial Overview</h3>
          <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Financial charts will be displayed here</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
