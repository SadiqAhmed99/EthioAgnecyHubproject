import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ visaApplications: [] });
};

export default function VisaPage() {
  const { visaApplications } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Visa Processing">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Visa Processing</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visaApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No visa applications</td>
                </tr>
              ) : (
                visaApplications.map((visa: any) => (
                  <tr key={visa.id}>
                    <td className="px-6 py-4">{visa.employeeName}</td>
                    <td className="px-6 py-4">{visa.country}</td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{visa.status}</span>
                    </td>
                    <td className="px-6 py-4">{visa.date}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
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
