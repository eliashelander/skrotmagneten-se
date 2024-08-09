import type {FetcherWithComponents} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import Button from './Button';

export function AddToCartButton({
  analytics,
  label,
  disabled,
  lines,
  onClick,
  variant,
}: {
  analytics?: unknown;
  label: string;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
  variant: 'primary' | 'secondary';
}) {
  return (
    <CartForm
      route="/varukorg"
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const loading = fetcher.state !== 'idle';
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <Button
              type="submit"
              variant={variant}
              label={label}
              disabled={disabled ?? loading}
              onClick={onClick}
              loading={loading}
              size="md"
            />
          </>
        );
      }}
    </CartForm>
  );
}
