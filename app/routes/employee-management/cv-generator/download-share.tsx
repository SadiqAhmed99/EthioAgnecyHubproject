import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ cv: null });
};

export default function DownloadSharePage() {
  const { cv } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Export CV">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Export CV</h1>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Download Options</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 flex items-center justify-center gap-2">
                <span>📥</span> Download as PDF
              </button>
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                <span>📄</span> Download as Word
              </button>
              <button className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 flex items-center justify-center gap-2">
                <span>📋</span> Copy to Clipboard
              </button>
            </div>
          </div>

          <hr />

          <div>
            <h3 className="font-semibold mb-4">Share Options</h3>
            <div className="space-y-3">
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200">
                Email CV
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200">
                Generate Shareable Link
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200">
                Print CV
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
