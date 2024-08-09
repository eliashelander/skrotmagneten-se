import {json, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {Container} from '~/components/Container';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Stallmagneten | ${data?.article.title ?? ''} bloggpost`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {articleHandle} = params;

  if (!articleHandle) {
    throw new Response('Hittades inte', {status: 404});
  }

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {articleHandle},
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return json({article});
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml} = article;

  return (
    <Container>
      <div className="py-8">
        {image && (
          <div className="aspect-[16/9] w-full block">
            <Image
              alt={image.altText || article.title}
              aspectRatio="16:9"
              data={image}
              loading="eager"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="prose sm:prose-sm md:prose-md lg:prose-lg xl:prose-xl 5xl:prose-2xl py-8">
          <h1>{title}</h1>
        </div>
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="prose sm:prose-sm md:prose-md lg:prose-lg xl:prose-xl 5xl:prose-2xl text-black"
        />
      </div>
    </Container>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: "blogg") {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
