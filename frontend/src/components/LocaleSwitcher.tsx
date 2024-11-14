"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchData, SERVER_IP } from "@/utils/api";

interface RouteSegmentMap {
  [locale: string]: {
    [key: string]: string;
  };
}

interface FetchDataResponse {
  id: string;
  langslug: string;
  slug: string;
  lang: string;
  [key: string]: any;
}

export default function LocaleSwitcher() {
  const t = useTranslations("Globals");
  const [isPending, setIsPending] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [langSlug, setLangSlug] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("");

  const routeSegmentMap: RouteSegmentMap = {
    en: {
      posts: "posts",
      pages: "pages",
      post: "post",
      page: "page",
    },
    tr: {
      posts: "yazilar",
      pages: "sayfalar",
      post: "yazi",
      page: "sayfa",
    },
  };

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const currentSlug = pathParts[pathParts.length - 1] || "";
    setSlug(currentSlug);
    fetchDataFromApi(currentSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  async function fetchDataFromApi(currentSlug: string) {
    const pathParts = pathname.split("/").filter(Boolean);
    let currentType = "";

    if (pathParts.includes("page") || pathParts.includes("sayfa")) {
      currentType = "page";
    } else if (pathParts.includes("post") || pathParts.includes("yazi")) {
      currentType = "post";
    } else {
      currentType = "";
    }
    setType(currentType);

    if (currentType && currentSlug) {
      const endpoint = `/api/${currentType}s/`;

      try {
        const dataList: FetchDataResponse[] = await fetchData(SERVER_IP, endpoint);
        const dataCurrent = dataList.find(
          (item) => item.slug === currentSlug && item.lang === locale
        );
        if (dataCurrent && dataCurrent.langslug) {
          setLangSlug(dataCurrent.langslug);
        }
      } catch (error) {
        console.error("Error!:", error);
      }
    }
  }

  const handleLocaleChange = async (nextLocale: string) => {
    setIsPending(true);

    const pathParts = pathname.split("/").filter(Boolean);

    let newPathParts: string[] = [];
    let currentType = "";
    let currentSlug = "";
    let slugIndex = -1;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];

      if (i === 0 && (part === "en" || part === "tr")) {
        // Replace the locale part
        newPathParts.push(nextLocale);
      } else {
        let mappedPart = part;

        // Map the route segment to target locale
        const routeValues = Object.values(routeSegmentMap[locale]);

        if (routeValues.includes(part)) {
          // Get the route key
          const routeKey = Object.keys(routeSegmentMap[locale]).find(
            (key) => routeSegmentMap[locale][key] === part
          );

          if (routeKey) {
            currentType = routeKey; // e.g., 'post' or 'page'

            // Get the mapped route segment in the next locale
            mappedPart = routeSegmentMap[nextLocale][routeKey];
          }
        } else if (currentType) {
          // This is the slug
          currentSlug = part;
          slugIndex = newPathParts.length;
        }

        newPathParts.push(mappedPart);
      }
    }

    // Fetch the corresponding langSlug for the nextLocale
    if (currentSlug && currentType) {
      try {
        const typeToEndpoint: { [key: string]: string } = {
          post: "posts",
          page: "pages",
        };

        const endpointCurrent = `/api/${typeToEndpoint[currentType]}/`;
        const dataList: FetchDataResponse[] = await fetchData(SERVER_IP, endpointCurrent);

        // Find the item with slug === currentSlug and lang === locale
        const dataCurrent = dataList.find(
          (item) => item.slug === currentSlug && item.lang === locale
        );

        if (dataCurrent && dataCurrent.langslug) {
          const newLangSlug = dataCurrent.langslug;

          // Replace the slug part in newPathParts
          if (slugIndex !== -1) {
            newPathParts[slugIndex] = newLangSlug;
          }
        } else {
          console.error(`Translation for locale ${nextLocale} not found.`);
          // Redirect to the home page of the next locale
          newPathParts = [nextLocale];
        }
      } catch (error) {
        console.error("Error fetching data for current slug:", error);
      }
    }

    // Construct the new pathname
    const newPathname = "/" + newPathParts.join("/");

    // Redirect to the new path
    router.replace(newPathname);

    setIsPending(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
            <span className="sr-only">Toggle Language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {["en", "tr"].map((cur) => (
            <span key={cur}>
              <DropdownMenuItem
                onClick={() => {
                  if (locale !== cur) {
                    handleLocaleChange(cur);
                  }
                }}
              >
                {t("localeLocale", { locale: cur })}
              </DropdownMenuItem>
            </span>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
