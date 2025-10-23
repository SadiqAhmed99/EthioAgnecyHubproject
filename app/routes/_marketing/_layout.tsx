import React from 'react';
import { Outlet } from '@remix-run/react';
import LanguageSwitcher from '~/components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function MarketingLayout() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/app/public/images/logo.svg"
                  alt="EthioAgencyHub"
                />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  EthioAgencyHub
                </span>
              </div>
              <nav className="ml-6 flex space-x-8">
                <a
                  href="/"
                  className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  {t('navigation.home')}
                </a>
                <a
                  href="/about"
                  className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  {t('navigation.about')}
                </a>
                <a
                  href="/services"
                  className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  {t('navigation.services')}
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {t('auth.sign_in')}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <img
                className="h-8 w-auto"
                src="/app/public/images/logo.svg"
                alt="EthioAgencyHub"
              />
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} EthioAgencyHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}