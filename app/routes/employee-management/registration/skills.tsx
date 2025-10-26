import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ skills: [] });
};

export default function SkillsRegistrationPage() {
  const { skills } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Skills Registration">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Skills & Qualifications</h1>
          <p className="text-gray-600">Add employee skills and certifications</p>
        </div>

        <form className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skill Category</label>
              <select className="w-full border rounded-md px-3 py-2">
                <option>DOMESTIC_WORK</option>
                <option>CONSTRUCTION</option>
                <option>HEALTHCARE</option>
                <option>EDUCATION</option>
                <option>TECHNICAL</option>
                <option>PROFESSIONAL</option>
                <option>OTHER</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Skill Name</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Proficiency Level</label>
              <select className="w-full border rounded-md px-3 py-2">
                <option>BEGINNER</option>
                <option>INTERMEDIATE</option>
                <option>ADVANCED</option>
                <option>EXPERT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <input type="number" className="w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Certification (optional)</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Skill
              </button>
              <a
                href="/employee-management/registration/review"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Continue
              </a>
            </div>
          </div>
        </form>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Added Skills</h3>
          {skills.length === 0 ? (
            <p className="text-gray-500">No skills added yet</p>
          ) : (
            <div className="space-y-2">
              {skills.map((skill: any) => (
                <div key={skill.id} className="border-b pb-2">
                  <p className="font-medium">{skill.name}</p>
                  <p className="text-sm text-gray-500">{skill.level} - {skill.experience} years</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
