'use client'
import {Link} from "@heroui/link";
import {Snippet} from "@heroui/snippet";
import {Code} from "@heroui/code";
import {button as buttonStyles} from "@heroui/theme";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User} from "@heroui/react";

import {siteConfig} from "@/config/site";
import {title, subtitle} from "@/components/primitives";
import {GithubIcon} from "@/components/icons";
import {supabaseClient} from "@/utils/supabase/client";
import {Button} from "@heroui/button";
import {useEffect, useState} from "react";
import {Avatar} from "@heroui/react";

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const layUser = async () => {
        const {data: {user}} = await supabaseClient.auth.getUser();
        console.log("useruseruser", user);
        setUser(user);
    }
    useEffect(() => {
        (async () => {
            const {data: {user}} = await supabaseClient.auth.getUser();
            console.log("useruseruser", user);
            setUser(user);
        })()
    }, [])
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-xl text-center justify-center">
                <span className={title()}>Make&nbsp;</span>
                <span className={title({color: "violet"})}>beautiful&nbsp;</span>
                <br/>
                <span className={title()}>
          websites regardless of your design experience.
        </span>
                <div className={subtitle({class: "mt-4"})}>
                    Beautiful, fast and modern React UI library.
                </div>
            </div>

            <div className="flex gap-3">
                <Link
                    isExternal
                    className={buttonStyles({
                        color: "primary",
                        radius: "full",
                        variant: "shadow",
                    })}
                    href={siteConfig.links.docs}
                >
                    Documentation
                </Link>
                <Link
                    isExternal
                    className={buttonStyles({variant: "bordered", radius: "full"})}
                    href={siteConfig.links.github}
                >
                    <GithubIcon size={20}/>
                    GitHub
                </Link>
            </div>

            <div className="mt-8">
                <Snippet hideCopyButton hideSymbol variant="bordered">

                    <User
                        as="button"
                        avatarProps={{
                            isBordered: true,
                            src: `${user?.user_metadata?.avatar_url}`,
                        }}
                        className="transition-transform"
                        description={`${user?.user_metadata?.email}`}
                        name={`${user?.user_metadata?.full_name}`}
                    />
                </Snippet>
            </div>

            <Button onPress={layUser}>Get user</Button>
        </section>
    );
}
