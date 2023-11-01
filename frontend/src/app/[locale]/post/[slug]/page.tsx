import { Post, ContentImage, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { fetchData, API_URL } from "@/utils/api";
import { formatDate } from "@/utils/date";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import { badgeVariants } from "@/components/ui/badge"

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslator(params.locale, "Globals");
  const slug = params.slug;
  const post = await getPost(slug);

  const imageUrl = post.image ? post.image : DEFAULT_OG_IMAGE_URL;
  const description = `${post.pageinfo} - ${t("sitedescription")}`;

  return {
    title: `${post.title} | ${t("sitename")}`,
    description: description,
    openGraph: {
      title: `${post.title} | ${t("sitename")}`,
      description: description,
      images: [{ url: imageUrl }]
    }
  };
}

const getPost = async (slug: string): Promise<Post> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/post/${slug}`;
  const post = await fetchData(API_URL, endpoint);
  return post;
};

export default async function Page({
  params: { locale, slug }
}: {
  params: {
    locale: string;
    slug: string;
  };
}) {
  const post = await getPost(slug);
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container className="p-10 mt-16" id="content">
        {post.image && (
          <div className="my-10 relative w-full h-[500px]">
            <Image
              src={post.image}
              priority={true}
              fill={true}
              alt={post.title}
              className=" object-cover"
            />
          </div>
        )}

        <h1 className="mt-12">{post.title}</h1>

        <p className="mb-16 text-sm">
          {t("posted")}: {formatDate(post.date_posted, locale)}
        </p>

        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.images && post.images.length > 0 && (
        <div className="mt-8">
          <GlobalCarousel 
            images={post.images} 
            navigationEnabled={false} 
            className="h-[200px] md:h-[300px] lg:h-[450px] bg-accent" 
          />
        </div>
        )}
        
        <div className="grid grid-cols-4 gap-4 mt-8">
          {post.images &&
            post.images.map((img: ContentImage) => (
              <picture key={img.id}>
                <Image
                  src={img.image}
                  width={500}
                  height={300}
                  alt={img.alt_text}
                />
              </picture>
            ))}
        </div>

        
      </Container>
      <Container>
      {post.categories.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-3 text-base">{t("categories")}:</h3>
              {post.categories.map((category) => (
                <Link key={category.slug} href={`/${locale}/category/${category.slug}`} className={`${badgeVariants({ variant: "default" })} mr-1`}>{category.title}</Link>
              ))}
          </div>
        )}
        {post.tags.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-3 text-base">{t("tags")}:</h3>
            
              {post.tags.map((tag) => (
                <Link key={tag.slug} href={`/${locale}/tag/${tag.slug}`} className={`${badgeVariants({ variant: "secondary" })} mr-1`}>{tag.title}</Link>
              ))}
            
          </div>
        )}
      </Container>
    </>
  );
}
