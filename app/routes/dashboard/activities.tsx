import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // TODO: Fetch recent activities from InsForge
  return json({ activities: [] });
};

export default function ActivitiesPage() {
  const { activities } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Recent Activities">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Recent Activities</h1>
          <p className="text-gray-600">View recent system activities</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="font-semibold mb-4">Activity Log</h3>
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity: any) => (
                  <div key={activity.id} className="border-b pb-3 flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
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
