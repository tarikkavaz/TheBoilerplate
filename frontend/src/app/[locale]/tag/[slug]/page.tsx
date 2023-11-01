import { Tag, Post, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from 'next/image';
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from '@/lib/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const locale = params.locale;

  const tags = await getTags();
  const matchedTag = tags.find((tag) => tag.slug === slug);
  const title = matchedTag?.title || "Başlık";
  const t = await getTranslator(locale, "Globals");

  const description = `${title} | ${t("tag")} - ${t("sitedescription")}`;
  const pageTitle = `${title} | ${t("sitename")}`;

  return {
    title: pageTitle,
    description: description,
    openGraph: {
      title: pageTitle,
      description: description,
      images: [{ url: DEFAULT_OG_IMAGE_URL }],
    },
  };
}

const getTags = async (): Promise<Tag[]> => {
  const endpoint = `/api/tags/`;
  return await fetchData(API_URL, endpoint);
};

const getTagPosts = async (
  slug: string,
  locale: string
): Promise<Post[]> => {
  const endpoint = `/api/${locale}/tags/${slug}/`;
  const posts = await fetchData(API_URL, endpoint);
  const filteredPosts = posts.filter(
    (post: { lang: string }) => post.lang === locale
  );
  return filteredPosts;
};

export default async function Page({
  params: { locale, slug },
}: {
  params: {
    locale: string;
    slug: string;
  };
}) {
  const posts = await getTagPosts(slug, locale);
  const tags = await getTags();
  const matchedTag = tags.find((tag) => tag.slug === slug);
  const title = matchedTag?.title || "Başlık";
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container className="p-10 mt-16" id="content">
      <h1>
        {t("tag")}: <span>{title}</span>
      </h1>
      <div className="grid grid-flow-col grid-cols-3 gap-4">
          {posts.map((post) => (
              <>
                <Card key={post.id}>
                <Link href={`/post/${post.slug}`}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.pageinfo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={post.image ? post.image : "/placeholder.jpg"}
                        priority={true}
                        fill={true}
                        alt={post.title}
                        className=" object-cover"
                      />
                    </div>
                  </CardContent>
                  </Link>
                </Card>
              </>
          ))}
        </div>
    </Container>
    </>
  );
}
