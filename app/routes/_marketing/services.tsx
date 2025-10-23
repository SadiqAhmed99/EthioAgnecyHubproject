import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export async function loader() {
  return json({
    services: [
      {
        id: 1,
        title: 'Travel Agency Management',
        description: 'Complete travel agency management solution',
        icon: 'globe'
      },
      {
        id: 2,
        title: 'Hajj & Umrah Services',
        description: 'Specialized tools for Hajj and Umrah agencies',
        icon: 'mosque'
      },
      {
        id: 3,
        title: 'Document Management',
        description: 'Secure document processing and storage',
        icon: 'document'
      }
    ]
  });
}

export default function Services() {
  const { t } = useTranslation();
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {t('services.title')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            {t('services.subtitle')}
          </p>
        </div>
        
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-md bg-blue-500 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-300">{service.description}</p>
                  <div className="mt-4">
                    <a href={`/services/${service.id}`} className="text-blue-600 hover:text-blue-500 font-medium">
                      {t('services.learn_more')} &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Subscription Plans Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {t('subscription.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-300">
              {t('subscription.description')}
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Monthly Plan */}
            <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('subscription.monthly')}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">2,500</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-300">ETB</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">/ {t('subscription.month')}</span>
                </div>
                <p className="mt-5 text-lg text-gray-500 dark:text-gray-300">{t('subscription.monthly_description')}</p>
              </div>
              <div className="px-6 pt-6 pb-8">
                <div className="mt-8">
                  <a
                    href="/register?plan=monthly"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {t('subscription.subscribe')}
                  </a>
                </div>
              </div>
            </div>

            {/* Quarterly Plan */}
            <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden border-2 border-blue-500">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('subscription.quarterly')}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">6,500</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-300">ETB</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">/ {t('subscription.quarter')}</span>
                </div>
                <p className="mt-5 text-lg text-gray-500 dark:text-gray-300">{t('subscription.quarterly_description')}</p>
              </div>
              <div className="px-6 pt-6 pb-8">
                <div className="mt-8">
                  <a
                    href="/register?plan=quarterly"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {t('subscription.subscribe')}
                  </a>
                </div>
              </div>
            </div>

            {/* Yearly Plan */}
            <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('subscription.yearly')}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">22,000</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-300">ETB</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">/ {t('subscription.year')}</span>
                </div>
                <p className="mt-5 text-lg text-gray-500 dark:text-gray-300">{t('subscription.yearly_description')}</p>
              </div>
              <div className="px-6 pt-6 pb-8">
                <div className="mt-8">
                  <a
                    href="/register?plan=yearly"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {t('subscription.subscribe')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}