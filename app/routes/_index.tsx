import {defer, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {Container} from '~/components/Container';
import {HeroVideo} from '~/components/HeroVideo';
import {Testimonials} from '~/components/Testimonials';
import {HeroImage} from '~/components/HeroImage';
import {withoutDecimals} from '~/utils';

export const meta: MetaFunction = () => {
  return [{title: 'Skrotmagneten | Aldrig mer punka med Skrotmagneten'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  return (
    <div className="home">
      <HeroVideo />
      <Container>
        <ImageText
          imageSrc="https://cdn.shopify.com/s/files/1/0847/4509/3413/files/spik.jpg?v=1702584395"
          title="Tappade nycklar, spik eller annat magnetiskt"
          text="Med starka magneter kan du snabbt och enkelt städa upp allt metallspill och undvika punka på bildäck eller trampa illa och få spik i skon..."
          imageSide="right"
        />
        <ImageText
          imageSrc="https://cdn.shopify.com/s/files/1/0847/4509/3413/files/bekvam-stallmagnet.jpg?v=1702589624"
          title="Bekväm utan ryggont"
          text="Skrotmagneten är enklare att använda än en sopkvast. Slipp böja på ryggen och låt hjulen rulla med lågt motstånd."
          imageSide="left"
        />
        <ImageText
          imageSrc="https://cdn.shopify.com/s/files/1/0847/4509/3413/files/skoning-hovslagare.jpg?v=1702589850"
          title="Enkel och säker hantering"
          text="Du släpper metallen med ett enkelt grepp på skaftet så du slipper ta bort metallen du samlat upp med fingrarna och riskera att skada dig."
          imageSide="right"
        />
        <ImageText
          imageSrc="https://cdn.shopify.com/s/files/1/0847/4509/3413/files/bekvam-stallmagnet.jpg?v=1702589624"
          title="Miljötänk"
          text="Separera all metall från ert skräp och sortera miljövänligt."
          imageSide="left"
        />
        <Testimonials
          testimonials={[
            {
              name: 'Jedhammars Byggtjänst',
              text: 'Den var bättre än jag trodde och den plockar upp spik i gräset bra. Jag har även haft den till att plocka plåtspill efter plåtslagaren.',
            },
          ]}
        />
      </Container>
      <HeroImage />
    </div>
  );
}

const ImageText: React.FC<{
  imageSrc: string;
  text: string;
  title: string;
  imageSide: 'right' | 'left';
}> = ({imageSrc, text, title, imageSide}) => {
  return (
    <div
      className={`flex items-center md:items-start mt-16 gap-16 ${
        imageSide === 'left'
          ? 'flex-col md:flex-row'
          : 'flex-col md:flex-row-reverse'
      }`}
    >
      <div
        className={`flex-1 flex ${
          imageSide === 'left' ? 'flex-end' : 'flex-start'
        }`}
      >
        <img className={`max-h-[550px]`} src={imageSrc} alt="" />
      </div>
      <div className="flex flex-col flex-1 text-center md:text-left justify-center my-auto gap-4">
        <h2 className="font-bold text-2xl">{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
};

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/kategorier/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Rekommenderade produkter</h2>
      <Suspense fallback={<div>Laddar...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/produkter/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <span>{`${withoutDecimals(
                      product.priceRange.minVariantPrice.amount || '',
                    )} kr`}</span>
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
