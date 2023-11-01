"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import { NavbarProps } from "@/utils/types";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Navigation({
  links,
  mobileMenuOpen,
  setMobileMenuOpen
}: NavbarProps) {
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
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
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
                    <Popover.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium focus:outline-none ui-focus-visible:ring-2 ui-focus-visible:ring-offset-2 px-4 py-2 bg-accent/0 hover:bg-accent ">
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
                      className="text-sm font-semibold leading-6 rounded-md px-4 py-2 bg-accent/0 hover:bg-accent"
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
                      <Popover.Panel className="before:w-0 before:h-0 before:left-[calc(50%-5px)] before:border-l-[10px] before:border-l-transparent before:border-b-[10px] before:border-b-accent before:border-r-[10px] before:border-r-transparent before:top-[-10px] before:absolute before:z-10 absolute z-10 left-1/2 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0">
                        <div className="overflow-hidden relative z-20 rounded-lg shadow-lg">
                          <div className="relative grid grid-cols-1 gap-6 px-5 py-6 sm:gap-8 sm:p-4 bg-accent">
                            {menuItem.children.map((submenuItem) => (
                              <Link
                                key={submenuItem.title}
                                href={submenuItem.link}
                                target={menuItem.newtab ? "_blank" : "_self"}
                                rel={
                                  menuItem.newtab ? "noopener noreferrer" : ""
                                }
                                className="group -m-3 flex items-start rounded-lg p-3 text-foreground  hover:text-foreground hover:bg-background"
                              >
                                <div className="ml-4">
                                  <p className="text-base font-medium ">
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
          <div className="lg:hidden bg-background h-[100vh]">
            <div className="space-y-1 px-4 py-4">
              {links.map((menuItem) => (
                <div key={menuItem.title}>
                  {menuItem.children ? (
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex items-center justify-stretch w-full rounded-md px-3 py-2 text-base font-medium text-foreground  hover:text-foreground hover:bg-background">
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
                                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground
                                  hover:bg-background hover:text-foreground"
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
                      className="block rounded-md px-3 py-2 text-base font-medium text-foreground
                                  hover:bg-background hover:text-foreground"
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
