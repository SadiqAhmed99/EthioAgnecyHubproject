import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ audits: [] });
};

export default function AuditPage() {
  const { audits } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Audit Trail">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Audit Trail</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {audits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No audit logs</td>
                </tr>
              ) : (
                audits.map((audit: any) => (
                  <tr key={audit.id}>
                    <td className="px-6 py-4">{audit.userName}</td>
                    <td className="px-6 py-4">{audit.action}</td>
                    <td className="px-6 py-4">{audit.entity}</td>
                    <td className="px-6 py-4">{audit.timestamp}</td>
                    <td className="px-6 py-4">{audit.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
