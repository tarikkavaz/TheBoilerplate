"use client";
import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import { fetchData, SERVER_IP } from "@/utils/api";
import {
  MenuItem,
  MobileMenuOpenProps
} from "@/utils/types";
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
function Logo({ mobileMenuOpen, setMobileMenuOpen }: MobileMenuOpenProps) {
  const locale = useLocale();
  const handleLogoClick = () => {
    setMobileMenuOpen(false);
  };
  return (
    <>
      <Link
        href={`/${locale}`}
        className="text-3xl block p-3 space-y-1 leading-none no-underline rounded-md outline-none select-none"
        onClick={handleLogoClick}
      >
        Logo
      </Link>
    </>
  );
}

/* end Logo */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      if (scrollY > 10) {
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
        as="header"
        size="fluid"
        className={`bg-background/[.8] text-foreground w-full h-50 fixed z-50 flex items-center justify-between backdrop-blur-md backdrop-opacity-100 ${
          isScrolled
            ? "scrolled border-b border-[hsl(var(--border))]"
            : "border-b-0 border-transparent"
        }`}
        // style={{ background: "var(--popover-foreground)" }}
      >
        <div>
          <Logo
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </div>
        <div>
          <Navigation
            links={navigationData || []}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </div>
        <div className="flex gap-2">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </Container>
    </>
  );
}
