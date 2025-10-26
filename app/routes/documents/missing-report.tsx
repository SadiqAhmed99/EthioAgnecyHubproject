import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ missingDocuments: [] });
};

export default function MissingReportPage() {
  const { missingDocuments } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Missing Documents Report">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Missing Documents Report</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Export Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Missing Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {missingDocuments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No missing documents</td>
                </tr>
              ) : (
                missingDocuments.map((doc: any) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4">{doc.employeeName}</td>
                    <td className="px-6 py-4">{doc.documentType}</td>
                    <td className="px-6 py-4">{doc.requiredDate}</td>
                    <td className="px-6 py-4">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Missing</span>
                    </td>
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
