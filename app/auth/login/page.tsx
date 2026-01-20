"use client";

import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Mail, Lock, Chrome } from "lucide-react";
import { useState } from "react";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@heroui/shared-icons";
import {useRouter} from "next/navigation";
import NextLink from "next/link";
import {signIn} from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const handleLogin = () => {
        console.log({ email, password });
        router.push("/");

    };

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <Card className="w-full max-w-lg shadow-xl rounded-2xl">
                <CardBody className=" h-140 w-100 p-8 space-y-6">
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl text-pink-500 font-bold">Welcome Back 👋</h1>
                        <p className="text-sm text-gray-500">
                            Login to your account
                        </p>
                    </div>

                    {/* Email */}
                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={email}
                        onValueChange={setEmail}
                        startContent={<Mail size={18} />}
                        variant="bordered"
                    />

                    {/* Password */}

                    <Input
                        className="max-w-sm"
                        endContent={
                            <button
                                aria-label="toggle password visibility"
                                className="focus:outline-solid outline-transparent"
                                type="button"
                                onClick={toggleVisibility}
                            >
                                {isVisible ? (
                                    <EyeSlashFilledIcon  className="text-xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onValueChange={setPassword}
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                    />

                    {/* Login button */}
                    <Button

                        className="w-full  bg-gradient-to-br from-purple-300 to-pink-300 text-white shadow-md"
                        onPress={handleLogin}
                    >
                        Login
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    {/* Google login */}

                    <Button
                        variant="bordered"
                        className="w-full font-medium text-purple-500"
                        startContent={<Chrome size={18} />}
                        onPress={() =>
                            signIn("google", {
                                callbackUrl: "/admin",
                            })
                        }
                    >
                        Login with Google
                    </Button>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500">
                        Don’t have an account?{" "}
                        <NextLink
                            href="/auth/signup"
                            className="text-pink-600 font-bold hover:underline"
                        >
                            Sign up
                        </NextLink>
                    </p>
                </CardBody>
            </Card>
        </div>
    );
}
