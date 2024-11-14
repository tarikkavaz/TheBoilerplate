"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Globe } from "lucide-react";import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { fetchData, SERVER_IP } from "@/utils/api";

/* fetchNavigationData */
async function fetchNavigationData(locale: string) {
  try {
    const endpoint = `/api/menuitems/`;
    const response = await fetchData(SERVER_IP, endpoint);
    const filteredData = response.filter((item: any) => item.lang === locale);
    return { navigations: filteredData };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
/* end fetchNavigationData */

export default function LocaleSwitcher() {
  const t = useTranslations("Globals");
  const [isPending, setIsPending] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [langSlug, setLangSlug] = useState("");
  const [slug, setSlug] = useState("");
  let [type, setType] = useState("");

  useEffect(() => {
    const pathParts = pathname.split("/");
    const slug = pathParts.filter((part) => part !== "").pop() || "";
    setSlug(slug);
    fetchDataFromApi();
  }, [pathname]);

  async function fetchDataFromApi() {
    const nextLocale = locale;
    if (pathname.includes("/page/") || pathname.includes("/sayfa/")) {
      type = "page";
      setType(type);
    } else if (pathname.includes("/post/") || pathname.includes("/yazi/")) {
      type = "post";
      setType(type);
    } else {
      type = "";
      setType(type);
    }

    if (type) {
      const endpoint = `/api/${nextLocale}/${type}/${slug}`;

      try {
        const data = await fetchData(SERVER_IP, endpoint);
        const langSlug = data.langslug;
        setLangSlug(langSlug);
      } catch (error) {
        console.error("Error!:", error);
      }
    }
  }

  const handleLocaleChange = async (nextLocale: string) => {
    setIsPending(true);
    if (slug) {
      if (pathname.includes("/page/") && langSlug && locale !== nextLocale) {
        router.replace(`/${nextLocale}/page/${langSlug}`);
      } else if (
        pathname.includes("/sayfa/") &&
        langSlug &&
        locale !== nextLocale
      ) {
        router.replace(`/${nextLocale}/page/${langSlug}`);
      } else if (
        pathname.includes("/post/") &&
        langSlug &&
        locale !== nextLocale
      ) {
        router.replace(`/${nextLocale}/post/${langSlug}`);
      } else if (
        pathname.includes("/yazi/") &&
        langSlug &&
        locale !== nextLocale
      ) {
        router.replace(`/${nextLocale}/post/${langSlug}`);
      } else if (
        locale !== nextLocale &&
        !langSlug &&
        (type === "page" ||
          type === "sayfa" ||
          type === "post" ||
          type === "yazi")
      ) {
        router.replace(`/${nextLocale}`);
      } else {
        router.replace(`/${nextLocale}`);
      }
    } else {
      router.replace(`/${nextLocale}`);
    }
    setIsPending(false);
    fetchNavigationData(nextLocale).then((data) => {
      if (data) {
        fetchNavigationData(data.navigations);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />            <span className="sr-only">Toggle Language</span>
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