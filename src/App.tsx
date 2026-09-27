import { Footer, Header } from './components';
import { Home } from './Home';
import { NotFound, Privacy, Support, Terms } from './Legal';
import { type PageId, resolvePage } from './site';

export { resolvePage };

const VIEWS: Record<PageId, () => React.JSX.Element> = {
  home: Home,
  privacy: Privacy,
  terms: Terms,
  support: Support,
  notFound: NotFound,
};

export function App({ page }: { page: PageId }) {
  const View = VIEWS[page];
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header home={page === 'home'} />
      <View />
      <Footer />
    </>
  );
}
