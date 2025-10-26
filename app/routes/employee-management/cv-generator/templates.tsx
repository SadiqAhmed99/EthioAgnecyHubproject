import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ templates: [
    { id: '1', name: 'Modern Professional', category: 'Professional' },
    { id: '2', name: 'Classic Traditional', category: 'Traditional' },
    { id: '3', name: 'Creative Portfolio', category: 'Creative' },
    { id: '4', name: 'Simple Clean', category: 'Minimal' },
  ]});
};

export default function TemplatesPage() {
  const { templates } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="CV Templates">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">CV Templates</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template: any) => (
            <div key={template.id} className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">Preview</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.category}</p>
                <button className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
