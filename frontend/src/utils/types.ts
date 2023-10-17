import { ReactNode } from "react";

// ==========================
// === Metadata & Layout ===
// ==========================
export interface MetadataProps {
  params: {
    slug: string;
    locale: string;
  };
}

export interface Layout {
  children: ReactNode;
  params: {
    locale: string;
    subpageTitle?: string;
    subPageDescription?: string;
  };
}

// ==========================
// === Content & Homepage ===
// ==========================
export interface ContentImage {
  id: number;
  image: string;
  alt_text: string;
}

export interface Homepage {
  id: number;
  images?: ContentImage[];
  title: string;
  description: string;
  pageinfo: string;
  content: string;
  lang: string;
  posts?: Post[];
}

export interface HomeProps {
  params: {
    locale: string;
  };
}

// ==========================
// === Page & Post Content ===
// ==========================
export interface Page {
  id: number;
  title: string;
  description: string;
  slug: string;
  langslug?: string;
  pageinfo: string;
  content: string;
  images?: ContentImage[];
  date_pageed?: string;
  lang: string;
  image: string | null;
  menu: boolean;
}

export interface Post {
  id: number;
  categories: Category[];
  tags: Tag[];
  images?: ContentImage[];
  title: string;
  description: string;
  slug: string;
  langslug?: string;
  pageinfo: string;
  content: string;
  image: string | null;
  date_posted: string;
  lang: string;
}

export interface Category {
  title: string;
  slug: string;
}

export interface Tag {
  title: string;
  slug: string;
}

// ==========================
// === Navigation & Menu ===
// ==========================
export interface NavItem {
  title: string;
  link: string;
  children?: ChildItem[];
}

export interface ChildItem {
  newtab: boolean | undefined;
  title: string;
  link: string;
  description: string;
}

export interface MenuItem {
  id: number;
  title: string;
  link: string;
  order: number;
  parent: number | null;
  page_slug: string | null;
  newtab: boolean;
  children: Submenu[] | null;
}

export interface Submenu {
  newtab: boolean | undefined;
  description: ReactNode;
  title: string;
  link: string;
  icon?: string;
}

export interface NavbarProps {
  links: MenuItem[];
}

export interface MobileMenuProps {
  navigationData: NavItem[];
}
