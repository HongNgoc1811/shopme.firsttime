// components/navbar/UserDropdown.tsx
"use client";

import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    User,
} from "@heroui/react";

export default function UserDropdown({

                                         user,
                                         avatar,
                                         displayName,
                                         onLogout,
                                     }: any) {
    return (
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
                    <DropdownItem key="logout" color="danger" onPress={onLogout}>
                        Log Out
                    </DropdownItem>
                </DropdownMenu>

            </Dropdown>
    );
}