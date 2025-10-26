import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  // TODO: Fetch document by ID from InsForge
  return json({ document: null, documentId: id });
};

export default function DocumentDetailPage() {
  const { document, documentId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Document Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Document Details</h1>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Edit
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Download
            </button>
          </div>
        </div>

        {document ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Document Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Type:</span> {document.type}</p>
                <p><span className="font-medium">Name:</span> {document.name}</p>
                <p><span className="font-medium">File Size:</span> {document.fileSize}</p>
                <p><span className="font-medium">Status:</span> {document.status}</p>
                <p><span className="font-medium">Upload Date:</span> {document.uploadedAt}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Verification Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Verified:</span> No</p>
                <p><span className="font-medium">Verified By:</span> -</p>
                <p><span className="font-medium">Verified Date:</span> -</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4">Document Preview</h3>
              <div className="border-2 border-dashed border-gray-300 h-96 flex items-center justify-center">
                <p className="text-gray-500">Document preview will be displayed here</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-center py-8">Loading document...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
