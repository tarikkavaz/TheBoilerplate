import {
  Homepage,
  MetadataProps,
  HomeProps,
  ContentImage,
} from "@/utils/types";
import Container from "@/components/ui/Container";
import HomeCarousel from "@/components/HomeCarousel";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL, SERVER_IP } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Loader2 } from "lucide-react";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";

import { Metadata, ResolvingMetadata } from "next";

const getHomepage = async (): Promise<Homepage[]> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/homepage/`;
  const posts = await fetchData(API_URL, endpoint);
  return posts;
};

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslator(params.locale, "Globals");
  const posts = await getHomepage();
  const firstPost = posts[0];

  const firstImageUrl =
    firstPost.images && firstPost.images[0]
      ? firstPost.images[0].image
      : DEFAULT_OG_IMAGE_URL;

  const description = `${firstPost.pageinfo} - ${t("sitedescription")}`;
  const title = `${firstPost.title} | ${t("sitename")}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: firstImageUrl }],
    },
  };
}

export default async function Posts({ params: { locale } }: HomeProps) {
  const posts = await getHomepage();
  const homepage = posts[0];
  const t = await getTranslator(locale, "Globals");
  return (
    <>
      <Container size="fluid">
        <HomeCarousel homepage={homepage} />
      </Container>
      <Container className="p-10 mt-16" id="content">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {homepage.images &&
            homepage.images.map((image: ContentImage) => (
              <picture key={image.id}>
                <Image
                  src={image.image}
                  priority={true}
                  width={500}
                  height={300}
                  alt={image.alt_text}
                  className="bg-slate-500"
                />
              </picture>
            ))}
        </div>
        <h1>{homepage.title}</h1>
        {/* <div className="flex flex-wrap gap-4 p-4 my-16 rounded bg-slate-300"> */}
        <div className="flex-wrap hidden gap-4 p-4 my-16 rounded bg-slate-300">
          <Button className="">{t("button")}</Button>
          <Button className="" variant="secondary">
            {t("button")}
          </Button>
          <Button className="" variant="destructive">
            {t("button")}
          </Button>
          <Button className="" variant="outline">
            {t("button")}
          </Button>
          <Button className="" variant="ghost">
            {t("button")}
          </Button>
          <Button className="" variant="link">
            {t("button")}
          </Button>
          <Button>
            <Mail className="w-4 h-4 mr-2" /> {t("button")}
          </Button>
          <Button disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("wait")}
          </Button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: homepage.content }} />
        <hr className="h-0.5 my-10 bg-indigo-900" />
        <h2 className="mt-16">{t("posts")}</h2>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {homepage.posts &&
            homepage.posts.map((post) => (
              <div key={post.id}>
                <Link
                  href={`/post/${post.slug}`}
                  className="flex flex-col gap-3"
                >
                  <h5>{post.title}</h5>
                  <picture>
                    <Image
                      src={post.image ? post.image : "/placeholder.jpg"}
                      width={500}
                      height={250}
                      alt={post.title}
                      className="bg-slate-500"
                    />
                  </picture>

                  <div dangerouslySetInnerHTML={{ __html: post.pageinfo }} />
                </Link>
              </div>
            ))}
        </div>
      </Container>
      <Container>
        <HomeCarousel homepage={homepage} />
      </Container>
      <div className="bg-red-700 dark:bg-lime-500">TEST_CSSVariables_TRUE</div>
    </>
  );
}
