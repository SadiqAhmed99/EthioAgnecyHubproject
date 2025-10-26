import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";
import { insforgeClient } from "~/lib/insforge.server";
import { notFound } from "remix-utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  if (!id) {
    throw notFound({ message: "Document not found" });
  }

  try {
    const { data: document, error } = await insforgeClient.database
      .from('documents')
      .select('*, employee:employees(*), agency:agencies(*)')
      .eq('id', id)
      .single();

    if (error || !document) {
      throw notFound({ message: "Document not found" });
    }

    return json({ document, documentId: id });
  } catch (error) {
    console.error('Error fetching document:', error);
    throw notFound({ message: "Document not found" });
  }
};

export default function DocumentDetailPage() {
  const { document, documentId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <AppLayout title="Document Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Document Details</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {document.id}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Edit
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
              Download
            </button>
          </div>
        </div>

        {document && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Document Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Type:</span>
                  <span className="capitalize">{document.type || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">File Name:</span>
                  <span>{document.file_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">File Size:</span>
                  <span>{formatFileSize(document.file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    document.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 
                    document.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {document.status || 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Upload Date:</span>
                  <span>{document.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Verification Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Verified:</span>
                  <span>{document.is_verified ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Verified By:</span>
                  <span>{document.verified_by || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Verified Date:</span>
                  <span>{document.verified_at ? new Date(document.verified_at).toLocaleDateString() : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Related Employee:</span>
                  <span>{document.employee?.first_name} {document.employee?.last_name}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4 text-lg">Document Preview</h3>
              <div className="border-2 border-dashed border-gray-300 h-96 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-gray-500">{document.file_name || 'Document preview'}</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                    View Full Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
