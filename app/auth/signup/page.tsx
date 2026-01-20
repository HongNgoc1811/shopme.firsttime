"use client";

import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Mail, Lock, Chrome } from "lucide-react";
import { useState } from "react";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@heroui/shared-icons";
import {useRouter} from "next/navigation";
import NextLink from "next/link";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");


    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const router = useRouter();
    const handleSignUp = () => {
        console.log({ email, password });
        router.push("/auth/login");

    };
    return (
        <div className="min-h-screen flex items-center justify-center ">
            <Card className="w-full max-w-lg shadow-xl rounded-2xl">
                <CardBody className=" h-140 w-100 p-8 space-y-6">
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl text-pink-500 font-bold">Sign Up  👋</h1>
                        <p className="text-sm text-gray-500">
                            Sign Up to your account
                        </p>
                    </div>

                    <Input
                        type="text"
                        label="Name"
                        placeholder="Enter your name"
                        value={name}
                        onValueChange={setName}
                        startContent={<Mail size={18} />}
                        variant="bordered"
                    />
                    <Input
                        type="number"
                        label="Age"
                        placeholder="Enter your age"
                        value={age}
                        onValueChange={setAge}
                        startContent={<Mail size={18} />}
                        variant="bordered"
                    />
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
                        onPress={handleSignUp}
                    >
                        Sign Up
                    </Button>


                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500">
                        Do have an account?{" "}
                        <NextLink
                            href="/auth/login"
                            className="text-pink-600 font-bold hover:underline"
                        >
                            Login
                        </NextLink>
                    </p>
                </CardBody>
            </Card>
        </div>
    );
}
