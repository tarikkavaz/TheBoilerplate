"use client";
import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { fetchData, SERVER_IP } from "@/utils/api";
import { MenuItem, NavItem, MobileMenuProps } from "@/utils/types";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

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

function Logo() {
  const locale = useLocale();
  return (
    <div className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none select-none">
      <Link href={`/${locale}`} legacyBehavior passHref>
        <div className="text-3xl">Logo</div>
      </Link>
    </div>
  );
}

function LanguageDropdown() {
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

    fetchDataFromApi();
  }, [pathname]);

  const handleLocaleChange = async (nextLocale: string) => {
    setIsPending(true);
    if (slug) {
      if (pathname.includes("/page/") && langSlug) {
        router.replace(`/sayfa/${langSlug}`, { locale: nextLocale });
      } else if (pathname.includes("/sayfa/") && langSlug) {
        router.replace(`/page/${langSlug}`, { locale: nextLocale });
      } else if (pathname.includes("/post/") && langSlug) {
        router.replace(`/yazi/${langSlug}`, { locale: nextLocale });
      } else if (pathname.includes("/yazi/") && langSlug) {
        router.replace(`/post/${langSlug}`, { locale: nextLocale });
      } else if (
        !langSlug &&
        (type === "page" ||
          type === "sayfa" ||
          type === "post" ||
          type === "yazi")
      ) {
        router.replace("/", { locale: nextLocale });
      } else {
        router.replace(pathname, { locale: nextLocale });
      }
    } else {
      router.replace("/", { locale: nextLocale });
    }
    setIsPending(false);
    fetchNavigationData(nextLocale).then((data) => {
      if (data) {
        fetchNavigationData(data.navigations);
      }
    });
  };

  return (
    <NavigationMenu className="pr-20">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("language")}</NavigationMenuTrigger>
          <NavigationMenuContent className="">
            <ul className="grid gap-3 p-6 md:w-[120px]">
              {["en", "tr"].map((cur) => (
                <li key={cur}>
                  <NavigationMenuLink
                    onClick={() => handleLocaleChange(cur)}
                    className="block text-sm p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none cursor-pointer select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    {t("localeLocale", { locale: cur })}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileMenu({
  navigationData: initialNavigationData
}: MobileMenuProps) {
  const [navigationData, setNavigationData] = useState<NavItem[]>(
    initialNavigationData
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Globals");
  const locale = useLocale();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNavigationData(locale);
      if (data) {
        setNavigationData(data.navigations);
      }
    };
    fetchData();
  }, [locale]);
  return (
    <div className="block md:hidden">
      <div>
        <Logo />
      </div>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu</button>
      {isMenuOpen && (
        <div className="flex">
          <NavigationMenu>
            <div className="">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href={`/${locale}`} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {t("homepage")}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
  
                  {navigationData &&
                    navigationData.map((navItem) => (
                      <NavigationMenuItem key={navItem.title}>
                        {navItem.children && navItem.children.length > 0 ? (
                          <>
                            <NavigationMenuTrigger>
                              {navItem.title}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              {/* <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"> */}
                              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                                {navItem.children.map((child) => (
                                  <ListItem
                                    key={child.title}
                                    title={child.title}
                                    href={child.link}
                                  >
                                    {child.description}
                                  </ListItem>
                                ))}
                              </ul>
                            </NavigationMenuContent>
                          </>
                        ) : (
                          <Link href={navItem.link} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                            >
                              {navItem.title}
                            </NavigationMenuLink>
                          </Link>
                        )}
                      </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div>
              <LanguageDropdown />
            </div>
          </NavigationMenu>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [navigationData, setNavigationData] = useState<MenuItem[] | null>(null);
  const locale = useLocale();
  const t = useTranslations("Globals");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNavigationData(locale);
      if (data) {
        setNavigationData(data.navigations);
      }
    };
    fetchData();
  }, [locale]);

  return (
    <Container size="fluid">
      <div className="hidden md:flex items-center justify-between">
        <div>
          <Logo />
        </div>
        <div className="">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href={`/${locale}`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {t("homepage")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {navigationData &&
                navigationData.map((navItem) => (
                  <NavigationMenuItem key={navItem.title}>
                    {navItem.children && navItem.children.length > 0 ? (
                      <>
                        <NavigationMenuTrigger>
                          {navItem.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {/* <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"> */}
                          <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                            {navItem.children.map((child) => (
                              <ListItem
                                key={child.title}
                                title={child.title}
                                href={child.link}
                              >
                                {child.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={navItem.link} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {navItem.title}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div>
          <LanguageDropdown />
        </div>
      </div>

      <MobileMenu navigationData={[]} />
    </Container>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
