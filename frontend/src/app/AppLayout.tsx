import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';

/** Global shell: header, page content, footer (with the mandatory legal links). */
export function AppLayout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-line bg-card">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-brand-600">
            {t('app.name')}
          </Link>
          <Link to="/" className="text-sm text-muted hover:text-ink">
            {t('nav.home')}
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-6xl gap-6 px-4 py-4 text-sm text-muted">
          <Link to="/privacy" className="hover:text-ink">
            {t('footer.privacy')}
          </Link>
          <Link to="/terms" className="hover:text-ink">
            {t('footer.terms')}
          </Link>
        </div>
      </footer>
    </div>
  );
}
