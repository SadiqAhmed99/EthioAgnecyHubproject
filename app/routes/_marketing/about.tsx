import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export async function loader() {
  return json({
    foundedYear: 2022,
    teamMembers: 15
  });
}

export default function About() {
  const { t } = useTranslation();
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {t('about.title')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            {t('about.subtitle')}
          </p>
        </div>
        
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('about.our_story')}
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
                {t('about.story_content', { year: data.foundedYear })}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('about.our_mission')}
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
                {t('about.mission_content')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            {t('about.our_team')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-300 text-center">
            {t('about.team_description', { count: data.teamMembers })}
          </p>
          
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Team members would be dynamically loaded here */}
            <div className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden">
                <img
                  src="/app/public/images/team/ceo.jpg"
                  alt="CEO"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Abebe Kebede</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">CEO & Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}