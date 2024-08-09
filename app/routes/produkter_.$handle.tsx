import {Suspense} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
  MetaobjectFragment,
  UpsellProductFragment,
} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

import {
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
} from '@shopify/hydrogen';
import type {
  Maybe,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl, useVariantUrl, withoutDecimals} from '~/utils';
import {Container} from '~/components/Container';
import {ProductImages} from '~/components/ProductImages';
import {AddToCartButton} from '~/components/AddToCartButton';

interface UpsellProduct {
  product: UpsellProductFragment;
  description: string | undefined;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Stallmagneten | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error(
      'Förväntade att produktens hantering skulle vara definierad',
    );
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  const technicalDetailsId =
    product?.metafields.find(
      (metafield) => metafield?.key == 'technical_details',
    )?.value ?? null;

  const upsellIds =
    product?.metafields
      .find((metafield) => metafield?.key == 'cart_upsells')
      ?.value.replace(/[\[\]"]+/g, '')
      ?.split(',') ?? null;

  const upsellsMetaobjects = upsellIds
    ? ((
        await Promise.all(
          upsellIds.map(async (id) => {
            const upsell = await storefront.query(META_OBJECT_QUERY, {
              variables: {
                id,
              },
            });
            return upsell;
          }),
        )
      )
        .map((upsell) => upsell?.metaobject)
        .filter((upsell) => upsell !== undefined) as MetaobjectFragment[])
    : [];

  const upsellProductIds = upsellsMetaobjects.map(
    (upsell) =>
      upsell?.fields.find((field) => field.key === 'product')?.value as string,
  );

  const upsellProducts: UpsellProduct[] = (
    await storefront.query(UPSELL_PRODUCTS_QUERY, {
      variables: {
        first: 10,
      },
    })
  ).products.nodes
    .filter((product) => upsellProductIds.includes(product.id))
    .map((product) => {
      return {
        product,
        description:
          upsellsMetaobjects
            .find(
              (upsell) =>
                upsell?.fields.find((field) => field.key === 'product')
                  ?.value === product.id,
            )
            ?.fields.find((field) => field.key === 'description')?.value ??
          undefined,
      };
    });

  const technicalDetails = technicalDetailsId
    ? await storefront.query(META_OBJECT_QUERY, {
        variables: {
          id: technicalDetailsId,
        },
      })
    : null;

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variants, technicalDetails, upsellProducts});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants, technicalDetails, upsellProducts} =
    useLoaderData<typeof loader>();
  const {selectedVariant} = product;

  return (
    <Container>
      {/* <div className="product"> */}
      <div className="flex flex-col md:flex-row gap-16 my-16">
        {/* <ProductImageOld image={selectedVariant?.image} /> */}
        <div className="flex-1">
          <ProductImages images={product.images.nodes} />
        </div>
        <div className="flex-1">
          <ProductMain
            selectedVariant={selectedVariant}
            product={product}
            variants={variants}
            technicalDetails={technicalDetails?.metaobject || null}
          />
        </div>
      </div>
      {upsellProducts.length > 0 && (
        <div className="flex flex-col gap-8 pb-16">
          <h2 className="text-2xl font-bold">Kompletterande produkter</h2>
          <Upsells products={upsellProducts as UpsellProduct[]} />
        </div>
      )}
    </Container>
  );
}

function Upsells({products: upsells}: {products: UpsellProduct[]}) {
  if (upsells.length === 0) {
    return null;
  }

  return (
    <div className="flex mx-auto md:mx-0 md:max-w-full flex-col md:flex-row gap-4 items-center md:items-start">
      {upsells.map((uppsell) => (
        <UpsellProduct key={uppsell.product.id} upsell={uppsell} />
      ))}
    </div>
  );
}

function UpsellProduct({upsell}: {upsell: UpsellProduct}) {
  const variant = upsell.product.variants.nodes[0];
  const variantUrl = useVariantUrl(
    upsell.product.handle,
    variant.selectedOptions,
  );

  return (
    <div
      className="flex-1 flex flex-col sm:flex-row gap-4"
      key={upsell.product.id}
    >
      <Link className="flex flex-col" prefetch="intent" to={variantUrl}>
        {upsell.product.featuredImage && (
          <Image
            alt={upsell.product.featuredImage.altText || upsell.product.title}
            aspectRatio="1/1"
            data={upsell.product.featuredImage}
            loading="lazy"
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-contain aspect-square h-full max-w-[200px]"
          />
        )}
      </Link>
      <div className="flex flex-col gap-2 max-w-[500px]">
        <Link className="flex flex-col" prefetch="intent" to={variantUrl}>
          <h4 className="text-xl font-bold">{upsell.product.title}</h4>
        </Link>
        <span className="text-lg">{`${withoutDecimals(
          upsell.product.priceRange.minVariantPrice.amount,
        )} kr`}</span>
        <p>{upsell.description}</p>
        <AddToCartButton
          disabled={!upsell.product.availableForSale}
          lines={
            upsell.product.variants.nodes[0]
              ? [
                  {
                    merchandiseId: upsell.product.variants.nodes[0].id,
                    quantity: 1,
                  },
                ]
              : []
          }
          label={
            upsell.product.availableForSale ? 'Lägg i varukorgen' : 'Slutsåld'
          }
          variant="secondary"
        />
      </div>
    </div>
  );
}

function TechnicalDetails({
  technicalDetails,
}: {
  technicalDetails: MetaobjectFragment | null;
}) {
  if (!technicalDetails) {
    return null;
  }
  return (
    <div>
      {technicalDetails.fields.map((field) => (
        <TechnicalDetailRow
          key={field.key}
          fieldKey={field.key}
          value={field.value}
        />
      ))}
    </div>
  );
}

function TechnicalDetailRow({
  fieldKey,
  value,
}: {
  fieldKey: string;
  value: Maybe<string> | undefined;
}) {
  if (typeof value !== 'string') {
    return null;
  }

  let label = 'Detalj';

  switch (fieldKey) {
    case 'bredd_mellan_hjulen':
      label = 'Bredd mellan hjulen';
      break;
    case 'hjul_i_diameter':
      label = 'Hjul i diameter';
      break;
    case 'material':
      label = 'Material';
      break;
    case 'teleskopskaft':
      label = 'Teleskopskaft';
      break;
  }
  return (
    <div className="border-b-black/10 border-b py-1">
      <div className="flex justify-between">
        <span className="flex-1">{label}:</span>
        <span className="flex-1">{value}</span>
      </div>
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
  technicalDetails,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
  technicalDetails: MetaobjectFragment | null;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-bold">{title}</h1>
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="Det uppstod ett problem vid inläsning av produktvarianter"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <br />
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <br />
      <TechnicalDetails technicalDetails={technicalDetails} />
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="text-2xl">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Rabatt</p>
          <br />
          <div className="flex gap-2">
            {selectedVariant ? (
              <span>{`${withoutDecimals(
                selectedVariant?.price?.amount || '',
              )} kr`}</span>
            ) : null}
            <s>
              <span className="line-through">
                {`${withoutDecimals(
                  selectedVariant?.compareAtPrice?.amount || '',
                )} kr`}
              </span>
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && (
          <span>{`${withoutDecimals(
            selectedVariant?.price?.amount || '',
          )} kr`}</span>
        )
      )}
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#varukorg-sida';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
        label={
          selectedVariant?.availableForSale ? 'Lägg i varukorgen' : 'Slutsåld'
        }
        variant="primary"
      />
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

const META_OBJECT_FRAGMENT = `#graphql
  fragment Metaobject on Metaobject {
    id
    fields {
      key
      value
    }
  }
` as const;

const META_OBJECT_QUERY = `#graphql
query MetaObject(
  $country: CountryCode
  $language: LanguageCode
  $id: ID!
  ) @inContext(country: $country, language: $language) {
    metaobject(id: $id) {
      ...Metaobject
    }
  }
  ${META_OBJECT_FRAGMENT}
` as const;

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 10) {
      nodes {
        __typename
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      values
    }
    metafields(identifiers:[{namespace:"custom", key:"technical_details"}, {namespace:"custom", key:"cart_upsells"}]) {
      key
      value
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;

const UPSELL_PRODUCTS_FRAGMENT = `#graphql
  fragment UpsellProduct on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
        id
      }
    }
  }
` as const;

const UPSELL_PRODUCTS_QUERY = `#graphql
  ${UPSELL_PRODUCTS_FRAGMENT}
  query UpsellProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
    ) {
      nodes {
          ...UpsellProduct
      }
    }
  }
` as const;
