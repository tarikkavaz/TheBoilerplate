import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  defaultLocale: "en",
  locales: ["en", "tr"],
  pathnames: {
    "/home": {
      en: "/home",
      tr: "/anasayfa",
    },
    "/posts": {
      en: "/posts",
      tr: "/yazilar",
    },
    "/post/[slug]": {
      en: "/post/[slug]",
      tr: "/yazi/[slug]",
    },

    "/pages": {
      en: "/pages",
      tr: "/sayfalar",
    },
    "/page/[slug]": {
      en: "/page/[slug]",
      tr: "/sayfa/[slug]",
    },

    "/tag": {
      en: "/tag",
      tr: "/etiket",
    },
    "/tag/[slug]": {
      en: "/tag/[slug]",
      tr: "/etiket/[slug]",
    },

    "/category": {
      en: "/category",
      tr: "/kategori",
    },
    "/category/[slug]": {
      en: "/category/[slug]",
      tr: "/kategori/[slug]",
    },
  },
  localePrefix: "always",
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
