import { Page, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from 'next/image';
import { fetchData, API_URL } from "@/utils/api";  // Imported API_URL
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from '@/lib/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const getPages = async (): Promise<Page[]> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/pages/`;
  const pages = await fetchData(API_URL, endpoint);

  return pages;
};

export async function generateMetadata({ params: { locale } }: MetadataProps) {
  const t = await getTranslator(locale, "Globals");

  const description = `${t("pages")} - ${t("sitedescription")}`;
  const pageTitle = `${t("pages")} | ${t("sitename")}`;

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

export default async function Pages({ params: { locale } }: MetadataProps) {
  const pages = await getPages();
  const t = await getTranslator(locale, "Globals");
  return (
    <>
      <Container className="p-10 mt-16">
        <h1>{t("pages")}</h1>
        <div className="grid grid-flow-col grid-cols-3 gap-4">
          {pages.map((page) => (
              <>
                <Card key={page.id}>
                <Link href={`/page/${page.slug}`}>
                  <CardHeader>
                    <CardTitle>{page.title}</CardTitle>
                    <CardDescription>{page.pageinfo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                  {page.image && (
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={page.image}
                        priority={true}
                        fill={true}
                        alt={page.title}
                        className=" object-cover"
                      />
                    </div>
                  )}
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
