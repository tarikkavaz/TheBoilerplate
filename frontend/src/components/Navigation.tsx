"use client";

import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import { NavbarProps } from "@/utils/types";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Navigation({ links }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    const footerElement = document.querySelector("footer");

    // select dropdowns
    const dropdownMenus = document.querySelectorAll(
      '[data-headlessui-state="open"]'
    );
    // "data-headlessui-state" controls
    const isAnyDropdownOpen = Array.from(dropdownMenus).some(
      (menu) => menu.getAttribute("data-headlessui-state") === "open"
    );

    if (mainElement && footerElement) {
      if (isAnyDropdownOpen) {
        mainElement.classList.add("pointer-events-none");
        footerElement.classList.add("pointer-events-none");
      } else {
        mainElement.classList.remove("pointer-events-none");
        footerElement.classList.remove("pointer-events-none");
      }
    }
  }, [isPopoverOpen]);

  return (
    <>
      {/* desktop menu */}
      <nav
        className="mx-auto top-9 z-20 flex items-center justify-between gap-48 transition-all duration-75 ease-in"
        aria-label="Global"
      >
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 dark:text-white text-zinc-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden items-center lg:flex lg:gap-x-4">
          {links.map((menuItem) => (
            <Popover key={menuItem.title} className="relative">
              {({ open }) => (
                <>
                  {menuItem.children ? (
                    <Popover.Button
                      onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                      className="inline-flex w-full justify-center rounded-md text-sm font-medium focus:outline-none ui-focus-visible:ring-2 ui-focus-visible:ring-offset-2 px-4 py-2 bg-slate-100/0 hover:bg-slate-100 dark:bg-zinc-700/0 dark:hover:bg-zinc-800"
                    >
                      {menuItem.title}
                      <ChevronDownIcon
                        className={
                          open
                            ? "h-5 w-5 flex-none rotate-180 transform "
                            : "h-5 w-5 flex-none "
                        }
                        aria-hidden="true"
                      />
                    </Popover.Button>
                  ) : (
                    <Link
                      href={menuItem.link}
                      target={menuItem.newtab ? "_blank" : "_self"}
                      rel={menuItem.newtab ? "noopener noreferrer" : ""}
                      className="text-sm font-semibold leading-6 rounded-md px-4 py-2 bg-slate-100/0 hover:bg-slate-100 dark:bg-zinc-700/0 dark:hover:bg-zinc-800"
                    >
                      {menuItem.title}
                    </Link>
                  )}

                  {menuItem.children && (
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-indigo-900 ring-opacity-5">
                          <div className="relative grid grid-cols-1 gap-6 bg-indigo-900 px-5 py-6 sm:gap-8 sm:p-4">
                            {menuItem.children.map((submenuItem) => (
                              <Link
                                key={submenuItem.title}
                                href={submenuItem.link}
                                target={menuItem.newtab ? "_blank" : "_self"}
                                rel={
                                  menuItem.newtab ? "noopener noreferrer" : ""
                                }
                                className="group -m-3 flex items-start rounded-lg p-3 hover:bg-indigo-700"
                              >
                                <div className="ml-4">
                                  <p className="text-base font-medium text-white">
                                    {submenuItem.title}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  )}
                </>
              )}
            </Popover>
          ))}
        </Popover.Group>
      </nav>
      {/* end desktop menu */}
      {/* mobile menu */}
      <section className=" absolute top-[60px] left-0 w-full lg:static lg:top-auto lg:left-auto lg:w-auto">
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="lg:hidden bg-slate-50 dark:bg-zinc-900 h-[100vh]">
            <div className="space-y-1 px-4 py-4">
              {links.map((menuItem) => (
                <div key={menuItem.title}>
                  {menuItem.children ? (
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex items-center justify-stretch w-full rounded-md px-3 py-2 text-base font-medium text-zinc-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900">
                            {menuItem.title}
                            <ChevronDownIcon
                              className={`${
                                open ? "rotate-180 transform" : ""
                              } lg:ml-1 h-5 w-5 ml-auto`}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel>
                            <div className="pl-2 lg:pl-4">
                              {menuItem.children?.map((submenuItem) => (
                                <Link
                                  key={submenuItem.title}
                                  href={submenuItem.link}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block rounded-md px-3 py-2 text-base font-medium text-zinc-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ) : (
                    <Link
                      href={menuItem.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-base font-medium text-zinc-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900"
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Transition>
      </section>
      {/* mobile menu */}
    </>
  );
}
