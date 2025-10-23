import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '~/components/ui/LanguageSwitcher';

export async function loader() {
  // You can fetch any data needed for the homepage here
  return json({
    featuredAgencies: 3,
    totalUsers: 1200,
    successfulBookings: 5000
  });
}

export default function Index() {
  const { t } = useTranslation();
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 pb-12 md:pt-16 md:pb-20 lg:pt-20 lg:pb-28 text-center lg:text-left">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div>
                <div className="inline-flex mb-4">
                  <LanguageSwitcher />
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">{t('home.hero_title_1')}</span>
                  <span className="block text-blue-600">{t('home.hero_title_2')}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                  {t('home.hero_description')}
                </p>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      {t('auth.get_started')}
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="/services"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      {t('navigation.services')}
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 lg:relative">
                <div className="mx-auto w-full rounded-lg shadow-xl overflow-hidden lg:absolute lg:inset-y-0 lg:left-0 lg:w-full">
                  <img
                    className="w-full object-cover lg:w-full lg:h-full"
                    src="/app/public/images/hero-image.jpg"
                    alt="EthioAgencyHub Platform"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">{data.featuredAgencies}+</p>
              <p className="mt-2 text-xl text-blue-100">{t('home.featured_agencies')}</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">{data.totalUsers}+</p>
              <p className="mt-2 text-xl text-blue-100">{t('home.total_users')}</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">{data.successfulBookings}+</p>
              <p className="mt-2 text-xl text-blue-100">{t('home.successful_bookings')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              {t('subscription.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
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
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_1')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_2')}</p>
                  </li>
                </ul>
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
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_1')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_2')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_3')}</p>
                  </li>
                </ul>
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
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_1')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_2')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_3')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{t('subscription.feature_4')}</p>
                  </li>
                </ul>
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
      </section>
    </div>
  );
}