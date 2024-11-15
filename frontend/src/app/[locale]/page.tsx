import {
  Homepage,
  MetadataProps,
  HomeProps,
  ContentImage,
} from "@/utils/types";
import Container from "@/components/ui/Container";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import { Metadata, ResolvingMetadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DialogImage from "@/components/DialogImage";

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
  const t = await getTranslations("Globals");
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
  const t = await getTranslations("Globals");
  return (
    <>
      <Container size="full">
        <GlobalCarousel 
          images={homepage.images || []} 
          className="h-[200px] md:h-[300px] lg:h-[450px] bg-accent" 
        />
      </Container>
      <Container className="px-10 mt-16" id="content">
        <h1>{homepage.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: homepage.content }} />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {homepage.images &&
            homepage.images.map((image: ContentImage) => (
              <DialogImage key={image.id} image={image} />
            ))}
        </div>
        <hr className="h-0.5 my-10 bg-accent" />
      </Container>
      <Container>
      <h2 className="mt-16">{t("posts")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {homepage.posts &&
            homepage.posts.map((post) => (
              <Card key={post.id}>
                <Link href={`/post/${post.slug}`}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.pageinfo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-32">
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
            ))}
          </div>
      </Container>
    </>
  );
}
