import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ verifications: [] });
};

export default function CrossMatchPage() {
  const { verifications } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Document Verification">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Document Verification</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Pending Verification</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Verified Today</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <input type="text" placeholder="Search documents..." className="flex-1 border rounded-md px-3 py-2" />
              <select className="border rounded-md px-3 py-2">
                <option>All Types</option>
                <option>PASSPORT</option>
                <option>NATIONAL_ID</option>
                <option>BIRTH_CERTIFICATE</option>
              </select>
            </div>

            {verifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No documents to verify</p>
            ) : (
              <div className="space-y-4">
                {verifications.map((ver: any) => (
                  <div key={ver.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{ver.employeeName} - {ver.documentType}</h4>
                        <p className="text-sm text-gray-600">Uploaded: {ver.uploadDate}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                        Verify
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm">
                        Reject
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm">
                        View
                      </button>
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
