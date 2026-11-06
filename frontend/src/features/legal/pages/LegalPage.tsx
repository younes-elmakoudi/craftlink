import { useTranslation } from 'react-i18next';

/** Shared layout of the Privacy Policy and Terms of Service pages. */
export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t } = useTranslation('legal');
  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold">{t(`${kind}.title`)}</h1>
      <p className="rounded-card border border-line bg-card p-4 text-muted">{t(`${kind}.todo`)}</p>
    </article>
  );
}
