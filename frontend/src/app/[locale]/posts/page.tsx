import { Post, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { fetchData, API_URL } from "@/utils/api";  // Imported API_URL
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from '@/lib/config';

const getPosts = async (): Promise<Post[]> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/posts/`;
  const posts = await fetchData(API_URL, endpoint);

  return posts;
};

export async function generateMetadata({ params: { locale } }: MetadataProps) {
  const t = await getTranslator(locale, "Globals");

  const description = `${t("posts")} - ${t("sitedescription")}`;
  const pageTitle = `${t("posts")} | ${t("sitename")}`;

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

export default async function Posts({ params: { locale } }: MetadataProps) {
  const posts = await getPosts();
  const t = await getTranslator(locale, "Globals");
  return (
    <Container className="p-10 mt-16" id="content">
      <h1>{t("posts")}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/post/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
