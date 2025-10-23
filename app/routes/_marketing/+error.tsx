import { useRouteError } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export default function MarketingError() {
  const error = useRouteError();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          {t('errors.something_went_wrong')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {error instanceof Error ? error.message : t('errors.unknown_error')}
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {t('navigation.back_to_home')}
        </a>
      </div>
    </div>
  );
}