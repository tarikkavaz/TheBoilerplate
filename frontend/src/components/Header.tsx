"use client";
import * as React from "react";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import { fetchData, SERVER_IP } from "@/utils/api";
import { MenuItem, NavItem } from "@/utils/types";
import { useLocale, useTranslations } from "next-intl";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";

import Navigation from "@/components/Navigation";

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
/* Logo */
function Logo() {
  const locale = useLocale();
  return (
    <>
      <div className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none select-none">
        <Link href={`/${locale}`} legacyBehavior passHref>
          <div className="text-3xl">Logo</div>
        </Link>
      </div>
    </>
  );
}
/* end Logo */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  /* scrolling */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  /* scrolling */
  return (
    <>
      <Container
        size="fluid"
        className={`bg-white/[.09] dark:bg-black/[.09] text-black dark:text-white w-full h-50 fixed z-50 flex items-center justify-between backdrop-blur-md backdrop-opacity-100 ${
          isScrolled
            ? "scrolled border-b border-slate-100/[.3] "
            : "border-b-0 border-transparent"
        }`}
        // style={{ background: "var(--popover-foreground)" }}
      >
        <div>
          <Logo />
        </div>
        <div>
          <Navigation links={navigationData || []} />
        </div>
        <div className="flex gap-2">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </Container>
    </>
  );
}
