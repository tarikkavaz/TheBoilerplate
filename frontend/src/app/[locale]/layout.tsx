import clsx from "clsx";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslator } from "next-intl/server";
import { Layout } from "@/utils/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";

const locales = ["en", "tr"];

const inter = Inter({ subsets: ["latin"] });

export async function getMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslator(locale, "Globals");

  const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_LOCAL!),
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en",
        "tr-TR": "/tr",
      },
    },
    title: {
      template: `%s | ${t("sitename")}`,
      default: t("sitename"),
    },
    openGraph: {
      url: process.env.NEXT_PUBLIC_LOCAL!,
      images: "/og-image.jpg",
      title: {
        template: `%s | ${t("sitename")}`,
        default: t("sitename"),
      },
      description: t("sitedescription"),
    },
  };

  return metadata;
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Layout) {
  const messages = await getMessages(locale);
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.some((cur) => cur === locale);
  if (!isValidLocale) notFound();
  return (
    <>
      <html lang={locale} suppressHydrationWarning>
        <head />
        <body
          className={clsx(
            inter.className,
            "flex h-screen flex-col justify-between"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Header />
              <main className="flex-1 mt-[60px] mb-20">{children}</main>
              <Footer />
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
