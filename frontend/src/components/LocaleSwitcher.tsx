"use client";

import { ChangeEvent, useTransition, useState, useEffect } from "react";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { fetchData } from "@/utils/api"; // Import fetchData function

export default function LocaleSwitcher() {
  const t = useTranslations("Globals");
  const [isPending, startTransition] = useTransition();
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
    // console.log("slug>>>:", slug);

    async function fetchDataFromApi() {
      const nextLocale = locale;
      // let type = "";
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
          const data = await fetchData(endpoint);
          const langSlug = data.langslug;
          setLangSlug(langSlug);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }

    fetchDataFromApi(); // Call the fetchDataFromApi function
  }, [pathname]);

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    console.log("langSlug:", langSlug);
    startTransition(() => {
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
    });
  }

  return (
    <label
      className={clsx(
        "relative text-gray-400",
        isPending && "transition-opacity [&:disabled]:opacity-30"
      )}
    >
      <p className="sr-only">{t("localeLable")}</p>
      <select
        className="inline-flex py-3 pl-2 pr-6 bg-transparent appearance-none"
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {["en", "tr"].map((cur) => (
          <option key={cur} value={cur}>
            {t("localeLocale", { locale: cur })}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute top-[8px] right-2">⌄</span>
    </label>
  );
}
