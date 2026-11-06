import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation();
  return (
    <section className="space-y-3 py-10 text-center">
      <h1 className="text-4xl font-bold">{t('home.title')}</h1>
      <p className="text-muted">{t('home.subtitle')}</p>
    </section>
  );
}
