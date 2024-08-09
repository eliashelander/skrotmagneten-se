import {json, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Pagination, getPaginationVariables, Image} from '@shopify/hydrogen';
import {Container} from '~/components/Container';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import Button from '~/components/Button';

export const meta: MetaFunction = () => {
  return [{title: `Stallmagneten | Blogg`}];
};

export const loader = async ({
  request,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 3,
  });

  const {articles} = await storefront.query(BLOGS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  });

  return json({articles});
};

export default function Blogs() {
  const {articles} = useLoaderData<typeof loader>();

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-4xl">Bloggposter</h1>
        <div className="py-8">
          <Pagination connection={articles}>
            {({nodes, isLoading, PreviousLink, NextLink}) => {
              return (
                <div className="flex flex-col items-center justify-center w-full gap-8">
                  <PreviousLink>
                    {isLoading ? 'Laddar...' : <span>↑ Ladda föregående</span>}
                  </PreviousLink>
                  <div className="flex flex-wrap w-full gap-8">
                    {nodes.map((article, index) => {
                      return (
                        <ArticleItem
                          article={article}
                          key={article.id}
                          loading={index < 2 ? 'eager' : 'lazy'}
                        />
                      );
                    })}
                  </div>
                  <NextLink>
                    {isLoading ? (
                      'Laddar...'
                    ) : (
                      <Button
                        label="Ladda fler ↓"
                        size="md"
                        type="button"
                        variant="secondary"
                      />
                    )}
                  </NextLink>
                </div>
              );
            }}
          </Pagination>
        </div>
      </div>
    </Container>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <div
      className="flex basis-[100%] md:basis-[calc(33.3%-24px)]"
      key={article.id}
    >
      <Link
        className="flex flex-col gap-2 flex-1"
        to={`/blogg/${article.handle}`}
        prefetch="intent"
      >
        {article.image && (
          <div className="aspect-[1/1] block">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="1/1"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover h-full"
            />
          </div>
        )}
        <h3 className="text-2xl">{article.title}</h3>
      </Link>
    </div>
  );
}

const ARTICLE_ITEM_FRAGMENT = `#graphql
fragment ArticleItem on Article {
  author: authorV2 {
    name
  }
  contentHtml
  handle
  id
  image {
    id
    altText
    url
    width
    height
  }
  publishedAt
  title
  blog {
    handle
  }
}
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Articles(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ...ArticleItem
      }
    }
  }
  ${ARTICLE_ITEM_FRAGMENT}
` as const;
