import {Await, NavLink, useLocation} from '@remix-run/react';
import {Suspense} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import {Image} from '@shopify/hydrogen';
import {Container} from './Container';
import {FaCartShopping} from 'react-icons/fa6';
import {TopBar} from './TopBar';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  const location = useLocation();

  const isHome = location.pathname === '/';

  const headerStyle = isHome
    ? 'bg-black md:bg-transparent md:-mb-[104px]'
    : 'bg-black';

  return (
    <header>
      <TopBar />
      <div className={`w-full ${headerStyle}`}>
        <Container>
          <div className={`flex items-center sticky py-0 px-4 h-16 top-0 z-40`}>
            <NavLink prefetch="intent" to="/" style={activeLinkStyleLight} end>
              {shop.brand?.logo?.image ? (
                <div className="w-48 sm:w-60 md:w-72">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0847/4509/3413/files/white-png.png?v=1723215017"
                    alt={shop.name}
                  />
                </div>
              ) : (
                <strong>{shop.name}</strong>
              )}
            </NavLink>
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
            />
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </div>
        </Container>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <div className="px-4">
      <nav className={`${className}`} role="navigation">
        {viewport === 'mobile' && (
          <NavLink
            end
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyleDark}
            to="/"
          >
            Hem
          </NavLink>
        )}
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;
          if (item.url.includes('blogg')) return null;
          if (item.url.includes('hastprodukter')) return null;

          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className="header-menu-item"
              end
              key={item.id}
              onClick={closeAside}
              prefetch="intent"
              style={
                viewport === 'mobile'
                  ? activeLinkStyleDark
                  : activeLinkStyleLight
              }
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

function HeaderCtas({cart}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas text-white" role="navigation">
      <HeaderMenuMobileToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <a href="#varukorg-sida">
      <div className="flex justify-center items-center gap-2">
        {<FaCartShopping />} <span className="hidden md:block">Varukorg</span>{' '}
        {count}
      </div>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/kategorier',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogg/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policyer',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/sidor/about',
      items: [],
    },
  ],
};

function activeLinkStyleDark({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

function activeLinkStyleLight({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
