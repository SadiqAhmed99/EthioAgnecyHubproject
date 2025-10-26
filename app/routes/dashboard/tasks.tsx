import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // TODO: Fetch tasks from InsForge
  return json({ tasks: [] });
};

export default function TasksPage() {
  const { tasks } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Task Management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Task Management</h1>
          <p className="text-gray-600">Track and manage your tasks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-gray-700">Pending Tasks</h3>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No pending tasks</p>
              ) : (
                tasks.map((task: any) => (
                  <div key={task.id} className="border-b pb-3">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-blue-700">In Progress</h3>
            <div className="space-y-3">
              <p className="text-gray-500 text-sm">No tasks in progress</p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-green-700">Completed</h3>
            <div className="space-y-3">
              <p className="text-gray-500 text-sm">No completed tasks</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
