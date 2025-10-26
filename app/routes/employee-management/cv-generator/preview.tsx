import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ cv: null });
};

export default function PreviewPage() {
  const { cv } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="CV Preview">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">CV Preview</h1>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Download PDF
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Edit
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
          <div className="border-2 border-dashed border-gray-300 h-96 flex items-center justify-center">
            <p className="text-gray-500">CV Preview will be displayed here</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <a href="/employee-management/cv-generator/templates" className="text-blue-600 hover:text-blue-800">
            ← Back to Templates
          </a>
          <a href="/employee-management/cv-generator/download-share" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Continue →
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
