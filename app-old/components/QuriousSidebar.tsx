import React, {useEffect, useState} from 'react';
import Button from './Button';
import type {
  SeasonCollectionQuery,
  SeasonProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl, withoutDecimals} from '~/utils';
import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';

interface Props {
  collection: SeasonCollectionQuery['collection'];
}

export const QuriousSidebar = ({collection}: Props) => {
  const [offset, setOffset] = useState('100%');
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        if (offset === '0%') {
          document.body.removeEventListener('mouseout', handleMouseOut);
        } else if (offset === '100%') {
          console.log('RUNNING');
          setOffset('80%');
        }
      }
    };

    if (offset === '100%' && isClosed === false) {
      document.body.addEventListener('mouseout', handleMouseOut);
    }
  }, [offset, isClosed]);

  if (isClosed) return null;

  return (
    <>
      <div
        className={`fixed ${
          offset === '80%' ? 'visible' : 'hidden'
        } top-0 left-0 w-screen h-screen bg-black/50 transition ease-in-out duration-200`}
      ></div>
      <div
        className={`fixed w-screen h-screen z-50 top-0 bg-[#f4f2e9] shadow-xl transition-transform ease-in-out duration-200`}
        style={{transform: `translateX(${offset})`}}
      >
        {offset === '0%' && (
          <button
            className="absolute right-8 top-8"
            onClick={() => setIsClosed(true)}
          >
            &times;
          </button>
        )}
        {offset === '80%' && (
          <div className="absolute flex flex-col w-[20%] h-full items-center justify-center p-4 gap-4">
            <h2 className="text-2xl">
              Nu när det är vinter har vi ett tips...
            </h2>
            <Button
              label="Se tips"
              size="md"
              type="button"
              variant="primary"
              onClick={() => setOffset('0%')}
              fullWidth={true}
            />
          </div>
        )}
        {offset === '0%' && (
          <div className="flex flex-col w-full max-w-xl m-auto h-full justify-center items-center gap-4">
            <h2 className="text-2xl">Säsongstips</h2>
            {collection?.description && <p>{collection?.description}</p>}
            <ProductsGrid products={collection?.products?.nodes ?? []} />
          </div>
        )}
      </div>
    </>
  );
};

function ProductsGrid({products}: {products: SeasonProductFragment[]}) {
  return (
    <div className="flex max-w-[500px] mx-auto md:mx-0 md:max-w-full flex-col md:flex-row gap-4 items-center md:items-start">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: SeasonProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  return (
    <Link
      className="flex-1 max-w-[400px] flex flex-col gap-2"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4 className="text-xl font-bold">{product.title}</h4>
      <span className="text-lg">{`${withoutDecimals(
        product.priceRange.minVariantPrice.amount,
      )} kr`}</span>
      <AddToCartButton
        disabled={product.availableForSale}
        lines={
          product.variants.nodes[0]
            ? [
                {
                  merchandiseId: product.variants.nodes[0].id,
                  quantity: 1,
                },
              ]
            : []
        }
        label={product.availableForSale ? 'Lägg i varukorgen' : 'Slutsåld'}
        variant="primary"
      />
    </Link>
  );
}
