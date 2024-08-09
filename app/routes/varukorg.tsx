import {Await, type MetaFunction} from '@remix-run/react';
import {Suspense, useEffect} from 'react';
import type {CartQueryData} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import type {ActionFunctionArgs} from '@netlify/remix-runtime';
import {json} from '@netlify/remix-runtime';
import {CartMain} from '~/components/Cart';
import {useRootLoaderData} from '~/root';
import {Container} from '~/components/Container';

export const meta: MetaFunction = () => {
  return [{title: `Stallmagneten | Varukorg`}];
};

export async function action({request, context}: ActionFunctionArgs) {
  const {session, cart} = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('Ingen åtgärd angiven');
  }

  let status = 200;
  let result: CartQueryData;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
        customerAccessToken: customerAccessToken?.accessToken,
      });
      break;
    }
    default:
      throw new Error(`${action} åtgärd för varukorgen är inte definierad`);
  }

  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const rootData = useRootLoaderData();
  const cartPromise = rootData.cart;
  const {cartUpsellOptions} = rootData;
  const {upsellProducts} = rootData;

  return (
    <Container>
      <div className="py-8">
        <h1 className="px-4 text-3xl">Varukorg</h1>
        <Suspense fallback={<p>Laddar varukorg ...</p>}>
          <Await
            resolve={cartPromise}
            errorElement={<div>Ett problem uppstod</div>}
          >
            {(cart) => {
              return (
                <CartMain
                  layout="page"
                  cart={cart}
                  cartUpsellOptions={cartUpsellOptions}
                  upsellProducts={upsellProducts}
                />
              );
            }}
          </Await>
        </Suspense>
      </div>
    </Container>
  );
}
