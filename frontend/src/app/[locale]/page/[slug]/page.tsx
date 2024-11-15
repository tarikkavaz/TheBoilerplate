import type { Page, ContentImage, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Image from "next/image";
import { fetchData, API_URL } from "@/utils/api"; // Imported API_URL
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import DialogImage from "@/components/DialogImage";
export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations("Globals");
  const page = await getPage(params.slug);

  const imageUrl = page.image ? page.image : DEFAULT_OG_IMAGE_URL;
  const description = `${page.pageinfo} - ${t("sitedescription")}`;

  return {
    title: `${page.title} | ${t("sitename")}`,
    description: description,
    openGraph: {
      title: `${page.title} | ${t("sitename")}`,
      description: description,
      images: [{ url: imageUrl }]
    }
  };
}

const getPage = async (slug: string): Promise<Page> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/page/${slug}`;
  const page = await fetchData(API_URL, endpoint);
  return page;
};

export default async function Page({
  params: { locale, slug }
}: {
  params: {
    locale: string;
    slug: string;
  };
}) {
  const page = await getPage(slug);
  const t = await getTranslations("Globals");

  return (
    <Container className="py-10" id="content">
      {page.image && (
        <div className="my-10 relative w-full h-60 md:h-96">
          <Image
            src={page.image}
            priority={true}
            fill={true}
            alt={page.title}
            className="object-cover"
          />
        </div>
      )}

      <h1>{page.title}</h1>

      <div dangerouslySetInnerHTML={{ __html: page.content }} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {page.images &&
          page.images.map((img: ContentImage) => (
            <DialogImage key={img.id} image={img} />
          ))}
      </div>
    </Container>
  );
}
