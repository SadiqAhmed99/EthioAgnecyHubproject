import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ exports: [] });
};

export default function ExportPage() {
  const { exports: exportList } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Data Export">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Data Export</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Export Options</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700">
                Export Employee Data
              </button>
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700">
                Export Document Data
              </button>
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700">
                Export Travel Records
              </button>
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700">
                Export Financial Reports
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Export History</h3>
            {exportList.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No exports yet</p>
            ) : (
              <div className="space-y-2">
                {exportList.map((exp: any) => (
                  <div key={exp.id} className="border rounded p-3">
                    <p className="font-medium text-sm">{exp.type}</p>
                    <p className="text-xs text-gray-500">{exp.date} - {exp.size}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Exported data includes all information as of the export date. Files are automatically
            deleted after 7 days for security purposes.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
