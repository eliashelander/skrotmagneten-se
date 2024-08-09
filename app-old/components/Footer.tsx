import {NavLink} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import {Container} from './Container';

export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: HeaderQuery['shop']}) {
  return (
    <footer className="footer">
      {menu && shop?.primaryDomain?.url && (
        <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
      )}
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <Container>
      <div className="flex text-white py-16">
        <div className="flex flex-col flex-1 gap-2">
          <h3 className="text-2xl mb-4">Kundtjänst</h3>
          <a className="text-lg" href="mailto:hej@stallmagneten.se">
            hej@stallmagneten.se
          </a>
          <p className="text-lg">
            Bridget Hovslagare AB
            <br />
            Organisationsnummer: 559127-3973
          </p>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl mb-4">Läs mer</h3>
          <nav className="flex flex-col gap-2" role="navigation">
            {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
              if (!item.url) return null;
              // if the url is internal, we strip the domain
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;
              const isExternal = !url.startsWith('/');
              return isExternal ? (
                <a
                  className="text-lg"
                  href={url}
                  key={item.id}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.title}
                </a>
              ) : (
                <NavLink
                  end
                  key={item.id}
                  prefetch="intent"
                  style={activeLinkStyle}
                  to={url}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex py-4 gap-4 text-white/80">
        <span>© 2023 Stallmagneten</span>
        <span>|</span>
        <span>
          Hemsida skapad och underhålls av{' '}
          <a target="blank_" href="https://stablepeak.se">
            StablePeak
          </a>
        </span>
      </div>
    </Container>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: '',
  items: [],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
    fontSize: '1.125rem',
  };
}
