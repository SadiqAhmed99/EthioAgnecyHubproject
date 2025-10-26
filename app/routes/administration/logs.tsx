import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ logs: [] });
};

export default function LogsPage() {
  const { logs } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="System Logs">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">System Logs</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex gap-2">
            <select className="border rounded-md px-3 py-2 text-sm">
              <option>All Logs</option>
              <option>Errors</option>
              <option>Warnings</option>
              <option>Info</option>
            </select>
            <input type="date" className="border rounded-md px-3 py-2 text-sm" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
              Filter
            </button>
          </div>
          
          <div className="p-6">
            {logs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No logs available</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log: any) => (
                  <div key={log.id} className="border-b pb-3">
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full mt-2 ${
                        log.level === 'error' ? 'bg-red-500' : 
                        log.level === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{log.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.timestamp} - {log.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
