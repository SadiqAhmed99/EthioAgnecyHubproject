import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ documents: [] });
};

export default function DocumentationPage() {
  const { documents } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Hajj & Umrah Documentation">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Documentation Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Required Documents</h3>
          
          <div className="space-y-4">
            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Valid Passport</h4>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Upload
                </button>
              </div>
              <p className="text-sm text-gray-600">Passport must be valid for at least 6 months from travel date</p>
              <p className="text-xs text-gray-500 mt-1">Status: Pending</p>
            </div>

            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Medical Certificate</h4>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Upload
                </button>
              </div>
              <p className="text-sm text-gray-600">Up-to-date medical checkup with vaccination records</p>
              <p className="text-xs text-gray-500 mt-1">Status: Pending</p>
            </div>

            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Visa Application</h4>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Upload
                </button>
              </div>
              <p className="text-sm text-gray-600">Completed visa application with all required information</p>
              <p className="text-xs text-gray-500 mt-1">Status: Pending</p>
            </div>

            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Travel Insurance</h4>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Upload
                </button>
              </div>
              <p className="text-sm text-gray-600">Comprehensive travel insurance coverage</p>
              <p className="text-xs text-gray-500 mt-1">Status: Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📌 All documents must be submitted at least 60 days before departure date.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
