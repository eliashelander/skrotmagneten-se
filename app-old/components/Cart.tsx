import {CartForm, Image} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {FetcherWithComponents} from '@remix-run/react';
import {Link} from '@remix-run/react';
import type {
  CartApiQueryFragment,
  MetaobjectUpsellFragment,
  UpsellProductFragment,
} from 'storefrontapi.generated';
import {
  filterOptionsFromDefaultTitle,
  useVariantUrl,
  withoutDecimals,
} from '~/utils';
import {CartSummary} from './CartSummary';
import {FaSquareMinus, FaSquarePlus} from 'react-icons/fa6';
import {IconContext} from 'react-icons';
import Button from './Button';
import {AddToCartButton} from './AddToCartButton';
import {Spinner} from './Spinner';
import {useEffect} from 'react';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  cartUpsellOptions: MetaobjectUpsellFragment[];
  upsellProducts: UpsellProductFragment[];
  layout: 'page' | 'aside';
};

export function CartMain({
  layout,
  cartUpsellOptions,
  upsellProducts,
  cart,
}: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);

  const className = `h-screen border-black overflow-y-auto w-auto ${
    withDiscount ? 'max-h-[calc(100vh - 300px)]' : 'max-h-[calc(100vh - 250px)]'
  }`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails
        cart={cart}
        cartUpsellOptions={cartUpsellOptions}
        upsellProducts={upsellProducts}
        layout={layout}
      />
    </div>
  );
}

function CartDetails({
  layout,
  cartUpsellOptions,
  upsellProducts,
  cart,
}: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div>
      <CartLines lines={cart?.lines} layout={layout} />
      <CartUpsell
        cartUpsellOptions={cartUpsellOptions}
        upsellProducts={upsellProducts}
        itemsInCart={cart?.lines.nodes}
        layout={layout}
      />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartUpsell({
  cartUpsellOptions,
  upsellProducts,
  itemsInCart,
  layout,
}: {
  cartUpsellOptions: CartMainProps['cartUpsellOptions'];
  upsellProducts: CartMainProps['upsellProducts'];
  itemsInCart: CartApiQueryFragment['lines']['nodes'] | undefined;
  layout: CartMainProps['layout'];
}) {
  if (!cartUpsellOptions?.length) return null;

  if (!itemsInCart) return null;

  const filteredOptions = cartUpsellOptions.filter((upsell) => {
    const selfProductId = upsell.fields.find(
      (field) => field.key === 'self_product',
    );

    const upsellProductId = upsell.fields.find(
      (field) => field.key === 'product',
    );

    const upsellItemExistsForCurrentLineItem = itemsInCart.some(
      (item) => item.merchandise.product.id === selfProductId?.value,
    );

    const upsellItemNotAlreadyInCart = !itemsInCart.some(
      (item) => item.merchandise.product.id === upsellProductId?.value,
    );
    return upsellItemExistsForCurrentLineItem && upsellItemNotAlreadyInCart;
  });

  if (filteredOptions.length === 0) return null;

  return (
    <div className="p-5" aria-labelledby="cart-upsell">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Rekommenderade produkter för dig</h3>
        <ul className="flex flex-col gap-4">
          {filteredOptions.map((option) => {
            const optionProductId = option.fields.find(
              (field) => field.key === 'product',
            );
            const upsellProduct = upsellProducts.find(
              (product) => product.id === optionProductId?.value,
            );

            if (!upsellProduct) return null;

            const upsellDescription = option.fields.find(
              (field) => field.key === 'description',
            )?.value;

            return (
              <div
                className="flex flex-col gap-4"
                key={`${option.id}_${upsellProduct.id}`}
              >
                {upsellDescription && <p>{upsellDescription}</p>}
                <li className="flex gap-4 border-b border-black/20 pb-4">
                  {upsellProduct.featuredImage && (
                    <Image
                      alt={upsellProduct.title}
                      aspectRatio="1/1"
                      data={upsellProduct.featuredImage}
                      height={100}
                      loading="lazy"
                      width={100}
                    />
                  )}
                  <div className="flex flex-col justify-between">
                    <Link
                      prefetch="intent"
                      to={upsellProduct.handle}
                      onClick={() => {
                        if (layout === 'aside') {
                          // close the drawer
                          window.location.href = upsellProduct.handle;
                        }
                      }}
                    >
                      <p>
                        <strong>{upsellProduct.title}</strong>
                      </p>
                    </Link>
                    <span className="text-lg">{`${withoutDecimals(
                      upsellProduct.priceRange.minVariantPrice.amount,
                    )} kr`}</span>
                    <div>
                      <AddToCartButton
                        disabled={false}
                        lines={[
                          {
                            merchandiseId: upsellProduct.variants.nodes[0].id,
                            quantity: 1,
                          },
                        ]}
                        label="Lägg i varukorgen"
                        variant="primary"
                      />
                    </div>
                  </div>
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div className="p-5 flex flex-col gap-4" aria-labelledby="cart-lines">
      {lines.nodes.length > 0 && (
        <h3 className="text-xl font-bold">Valda produkter</h3>
      )}
      <ul className="flex flex-col gap-4">
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  const filteredOptions = filterOptionsFromDefaultTitle(selectedOptions);

  return (
    <li key={id} className="flex gap-4 border-b border-black/20 pb-4">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}

      <div className="flex flex-col justify-between">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              // close the drawer
              window.location.href = lineItemUrl;
            }
          }}
        >
          <p>
            <strong>{product.title}</strong>
          </p>
        </Link>
        <CartLinePrice line={line} as="span" />
        <ul>
          {filteredOptions.map((option) => (
            <li key={option.name}>
              <small>
                {option.name}: {option.value}
              </small>
            </li>
          ))}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex items-center justify-center">
      <Button
        label="Fortsätt till Kassan &rarr;"
        type="button"
        variant="primary"
        to={checkoutUrl}
        loading={false}
        size="md"
      />
    </div>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/varukorg"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <Button
            label="Ta bort"
            type="submit"
            variant="secondary"
            loading={fetcher.state !== 'idle'}
            size="sm"
          />
        );
      }}
    </CartForm>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center">
      <small className="text-base mr-4">Antal: {quantity}</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Minska antal"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
          className="disabled:opacity-50 disabled:cursor-not-allowed h-5 flex items-center mr-1"
        >
          <IconContext.Provider value={{className: 'h-5 w-5'}}>
            <FaSquareMinus />
          </IconContext.Provider>
        </button>
      </CartLineUpdateButton>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Öka antal"
          name="increase-quantity"
          value={nextQuantity}
          className="disabled:opacity-50 disabled:cursor-not-allowed h-5 flex items-center mr-4"
        >
          <IconContext.Provider value={{className: 'h-5 w-5'}}>
            <FaSquarePlus />
          </IconContext.Provider>
        </button>
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} />
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return <span>{`${withoutDecimals(moneyV2.amount || '')} kr`}</span>;
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div className="px-5" hidden={hidden}>
      <br />
      <p>
        Det ser ut som att du inte har lagt till något ännu, låt oss komma
        igång!
      </p>
      <br />
      <Link
        to="/produkter"
        onClick={() => {
          if (layout === 'aside') {
            // window.location.href = '/produkter';
            history.go(-1);
          }
        }}
      >
        <Button
          label="Fortsätt handla →"
          type="button"
          variant="secondary"
          loading={false}
          size="md"
        />
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="flex items-center justify-center">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Rabatter</dt>
          <UpdateDiscountForm>
            <div className="flex items-center mt-1">
              <code>{codes?.join(', ')}</code>
              <button>Ta bort</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            className="rounded-md"
            type="text"
            name="discountCode"
            placeholder="Rabattkod"
          />
          <Button
            label="Applicera"
            type="submit"
            variant="secondary"
            loading={false}
            size="md"
          />
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/varukorg"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        return fetcher.state !== 'idle' ? <Spinner /> : <>{children}</>;
      }}
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/varukorg"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        return fetcher.state !== 'idle' ? <Spinner /> : <>{children}</>;
      }}
    </CartForm>
  );
}
