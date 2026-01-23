"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import {
  GithubIcon,
  SearchIcon,
} from "@/components/icons";
import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";
import {Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User} from "@heroui/react";
import {useEffect, useState} from "react";
import {supabaseClient} from "@/utils/supabase/client";


export const Navbar = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabaseClient.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        const { data: listener } =
            supabaseClient.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);
    const displayName =
        user?.user_metadata?.full_name || user?.email;

    const avatar =
        user?.user_metadata?.avatar_url || "/avatardefault.png";

    console.log("USER:", user);
    console.log("METADATA:", user?.user_metadata);

    const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

    const ThemeSwitch = dynamic(
        () => import("@/components/theme-switch").then(m => m.ThemeSwitch),
        { ssr: false }
    );

    const router = useRouter();

    const handleLogin = () => {
        console.log("Login");

        router.push("/auth/login");
    }
    const handleSignUp = () => {
        console.log("Login");

        router.push("/auth/signup");
    }
    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });

        router.push("/auth/login");
    };

    return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                  >
                      <path d="M3 6h18l-2 13H5L3 6zm5-3h8l1 2H7l1-2z" />
                  </svg>
              </div>
              <div className="flex flex-col leading-tight">
                  <span className="text-lg font-bold tracking-tight">ShopMe</span>
              </div>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex gap-5">
            <div className="flex gap-3">
                {/*<Button className=" h-10 px-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white"*/}
                {/*    variant="solid"*/}
                {/*        onPress={handleLogin}*/}
                {/*>*/}
                {/*    Login*/}
                {/*</Button>*/}
                {/*<div className="p-[2px] rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">*/}
                {/*    <Button*/}
                {/*        className=" h-8 px-4 w-full rounded-[10px] bg-background"*/}
                {/*        onPress={handleSignUp}*/}
                {/*    >*/}
                {/*        Sign up*/}
                {/*    </Button>*/}
                {/*</div>*/}


                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <User
                            as="button"
                            avatarProps={{
                                isBordered: true,
                                src: avatar,
                            }}
                            name={displayName}
                            description={user?.email}
                            className="transition-transform text-purple-500 "
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">{user?.email}</p>
                        </DropdownItem>
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem key="analytics">Analytics</DropdownItem>
                        <DropdownItem key="system">System</DropdownItem>
                        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>

                </Dropdown>

            </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
