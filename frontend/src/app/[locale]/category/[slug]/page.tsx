import { Category, Post, MetadataProps } from "@/utils/types";
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

  const categories = await getCategories();
  const matchedCategory = categories.find((category) => category.slug === slug);
  const title = matchedCategory?.title || "Başlık";
  const t = await getTranslator(locale, "Globals");

  const description = `${title} | ${t("category")} - ${t("sitedescription")}`;
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

const getCategories = async (): Promise<Category[]> => {
  const endpoint = `/api/categories/`;
  return await fetchData(API_URL, endpoint);
};

const getCategoryPosts = async (
  slug: string,
  locale: string
): Promise<Post[]> => {
  const endpoint = `/api/${locale}/categories/${slug}/`;
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
  const posts = await getCategoryPosts(slug, locale);
  const categories = await getCategories();
  const matchedCategory = categories.find((category) => category.slug === slug);
  const title = matchedCategory?.title || "Başlık";
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container className="p-10 mt-16" id="content">
      <h1>
        {t("category")}: <span>{title}</span>
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
