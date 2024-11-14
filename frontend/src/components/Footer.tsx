"use client";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import { useTranslations } from "next-intl";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { fetchData, SERVER_IP } from "@/utils/api";
import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Youtube,
} from "lucide-react";

interface SocialLinks {
  [key: string]: string;
}

export default function Footer() {
  const t = useTranslations("Globals");
  const date = new Date();
  const year = date.getFullYear();
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const endpoint = `/api/social/`;
        const response = await fetchData(SERVER_IP, endpoint);
        if (response && response.length > 0) {
          const data = response[0];
          setSocialLinks(data);
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    }
    fetchSocialLinks();
  }, []);

  const socialIcons: { [key: string]: React.ReactNode } = {
    facebook: <Facebook className="h-6 w-6" aria-hidden="true" />,
    instagram: <Instagram className="h-6 w-6" aria-hidden="true" />,
    twitter: <Twitter className="h-6 w-6" aria-hidden="true" />,
    github: <Github className="h-6 w-6" aria-hidden="true" />,
    youtube: <Youtube className="h-6 w-6" aria-hidden="true" />,
  };
  const navigation = {
    solutions: [
      { name: "Marketing", href: "#" },
      { name: "Analytics", href: "#" },
      { name: "Commerce", href: "#" },
      { name: "Insights", href: "#" },
    ],
    support: [
      { name: "Pricing", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Guides", href: "#" },
      { name: "API Status", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Jobs", href: "#" },
      { name: "Press", href: "#" },
      { name: "Partners", href: "#" },
    ],
    legal: [
      { name: "Claim", href: "#" },
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
    ],
  };

  return (
    <footer
      className="bg-background text-foreground relative border-t border-border"
      aria-labelledby="footer-heading"
    >
      <div className="overflow-hidden absolute z-10 w-full h-full">
        <div className="animate-bg-light w-full h-[2000px] absolute top-0 left-0 opacity-5 bg-left"></div>
        <div className="animate-bg-light w-full h-[2000px] absolute top-0 right-0 opacity-50 bg-right"></div>
      </div>
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <Container size="default" className="pb-16 pt-16 relative z-20">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8 ">
          <div className="space-y-8">
            <p className=" text-3xl font-medium ">{t("sitename")}</p>

            <p className="text-sm leading-6">{t("sitedescription")}</p>
            <div className="flex space-x-6">
              {Object.keys(socialLinks)
                .filter(
                  (key) =>
                    key !== "id" && key !== "order" && socialLinks[key]
                )
                .map((key) => (
                  <a
                    key={key}
                    href={socialLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:text-gray-400"
                  >
                    <span className="sr-only">{key}</span>
                    {socialIcons[key.toLowerCase()]}
                  </a>
                ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-inherit">
                  Solutions
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-inherit">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-inherit">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-inherit">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-border pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 ">
            &copy; {year} {t("sitename")}, {t("copyright")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
