import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ results: [] });
};

export default function SearchPage() {
  const { results } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Advanced Search">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Advanced Search</h1>
        
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full border rounded-md px-3 py-2">
                <option>Any</option>
                <option>DOMESTIC_WORK</option>
                <option>CONSTRUCTION</option>
                <option>HEALTHCARE</option>
                <option>EDUCATION</option>
                <option>TECHNICAL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proficiency</label>
              <select className="w-full border rounded-md px-3 py-2">
                <option>Any</option>
                <option>BEGINNER</option>
                <option>INTERMEDIATE</option>
                <option>ADVANCED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="w-full border rounded-md px-3 py-2">
                <option>Any</option>
                <option>REGISTERED</option>
                <option>READY_FOR_DEPLOYMENT</option>
                <option>DEPLOYED</option>
              </select>
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Search
          </button>
        </form>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Search Results</h3>
          {results.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No results found</p>
          ) : (
            <div className="space-y-3">
              {results.map((result: any) => (
                <div key={result.id} className="border rounded p-4">
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-600">{result.skills}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {result.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
