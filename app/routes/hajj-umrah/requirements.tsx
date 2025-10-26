import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ requirements: [] });
};

export default function RequirementsPage() {
  const { requirements } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Requirements Tracking">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Requirements Tracking</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Hajj & Umrah Requirements</h3>
          
          <div className="space-y-4">
            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Valid Passport</h4>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>
              </div>
              <p className="text-sm text-gray-600">Passport must be valid for at least 6 months</p>
            </div>
            
            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Medical Certificate</h4>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>
              </div>
              <p className="text-sm text-gray-600">Up-to-date medical checkup certificate</p>
            </div>
            
            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Visa Application</h4>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>
              </div>
              <p className="text-sm text-gray-600">Completed visa application form</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
