import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
  MetaobjectUpsellFragment,
  UpsellProductFragment,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  cartUpsellOptions: MetaobjectUpsellFragment[];
  upsellProducts: UpsellProductFragment[];
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({
  cart,
  cartUpsellOptions,
  upsellProducts,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <>
      <CartAside
        cart={cart}
        cartUpsellOptions={cartUpsellOptions}
        upsellProducts={upsellProducts}
      />
      <MobileMenuAside menu={header?.menu} shop={header?.shop} />
      <div className="flex flex-col min-h-screen">
        {header && (
          <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
        )}
        <main>{children}</main>
        <Suspense>
          <Await resolve={footer}>
            {(footer) => <Footer menu={footer?.menu} shop={header?.shop} />}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

function CartAside({
  cart,
  cartUpsellOptions,
  upsellProducts,
}: {
  cart: LayoutProps['cart'];
  cartUpsellOptions: LayoutProps['cartUpsellOptions'];
  upsellProducts: LayoutProps['upsellProducts'];
}) {
  return (
    <Aside id="varukorg-sida" heading="Varukorg">
      <Suspense fallback={<p>Laddar varukorg ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return (
              <CartMain
                cart={cart}
                layout="aside"
                cartUpsellOptions={cartUpsellOptions}
                upsellProducts={upsellProducts}
              />
            );
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function MobileMenuAside({
  menu,
  shop,
}: {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}) {
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Aside id="mobile-menu-aside" heading="Meny">
        <HeaderMenu
          menu={menu}
          viewport="mobile"
          primaryDomainUrl={shop.primaryDomain.url}
        />
      </Aside>
    )
  );
}
