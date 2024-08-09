import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartMainProps} from './Cart';
import {withoutDecimals} from '~/utils';

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page'
      ? 'relative'
      : 'absolute bottom-0 border-t border-black w-full';

  return (
    <div
      aria-labelledby="cart-summary"
      className={`p-4 flex flex-col justify-end gap-6 md:flex-row ${className} items-center`}
    >
      <div className="flex gap-2 h-full">
        <h4 className="font-bold">Total:</h4>
        {cost?.subtotalAmount?.amount ? (
          <span>{`${withoutDecimals(
            cost?.subtotalAmount.amount || '',
          )} kr`}</span>
        ) : (
          '-'
        )}
      </div>
      {children}
    </div>
  );
}
