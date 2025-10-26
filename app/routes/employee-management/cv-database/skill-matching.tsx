import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ matches: [] });
};

export default function SkillMatchingPage() {
  const { matches } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Skill Matching">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Skill Matching</h1>
        
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Required Skills</label>
            <input type="text" placeholder="Enter skills separated by commas" className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Experience Level</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>Any</option>
              <option>BEGINNER</option>
              <option>INTERMEDIATE</option>
              <option>ADVANCED</option>
              <option>EXPERT</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Search Matches
          </button>
        </form>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matching Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No matches found</td>
                </tr>
              ) : (
                matches.map((match: any) => (
                  <tr key={match.id}>
                    <td className="px-6 py-4">{match.employeeName}</td>
                    <td className="px-6 py-4">{match.skills.join(', ')}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{match.score}%</span>
                    </td>
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
