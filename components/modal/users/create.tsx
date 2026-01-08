import {Button} from "@heroui/button";
import {useEffect, useState} from "react";
import {
    Form,
    Input,
    Select,
    SelectItem,
    ModalContent,
    ModalHeader,
    ModalBody
} from "@heroui/react";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@heroui/shared-icons";
import {Modal} from "@heroui/modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateUserModal({isOpen, onClose}: Props) {

    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [avatar_url, setAvatar_Url] = useState("");
    const [avatar_file, setAvatarFile] = useState<File | null>(null);
    const [status, setStatus] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    // Real-time password validation
    const getPasswordError = (value) => {
        if (value.length == 0) {
            return null;
        }
        if (value.length < 4) {
            return "Password must be 4 characters or more";
        }
        if ((value.match(/[A-Z]/g) || []).length < 1) {
            return "Password needs at least 1 uppercase letter";
        }
        if ((value.match(/[^a-z]/gi) || []).length < 1) {
            return "Password needs at least 1 symbol";
        }

        return null;
    };
    const handleSubmit = async () => {
        const payload = {
            profile: {
            name: name,
            role: role,
            status: status,
            avatar_url: avatar_url,
            age: age,
            email: email,
            },
            auth: {
                email: email,
                password: password,
            }

        }
        const res = await fetch("/api/admin/users", {
            method: "POST",
            body: JSON.stringify(payload),
        })
        const data = await res.json()
        console.log("data", data)
onClose()
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Create User</ModalHeader>
                        <ModalBody>

                            <div className="flex flex-col gap-4 w-full p-5">
                                <Input
                                    isRequired
                                    errorMessage={({validationDetails}) => {
                                        if (validationDetails.valueMissing) {
                                            return "Please enter your name";
                                        }
                                    }}
                                    label="Name"
                                    value={name}
                                    onValueChange={setName}
                                    labelPlacement="outside"
                                    name="name"
                                    placeholder="Enter your name"
                                />
                                <Input
                                    isRequired
                                    errorMessage={({validationDetails}) => {
                                        if (validationDetails.valueMissing) {
                                            return "Please enter your email";
                                        }
                                        if (validationDetails.typeMismatch) {
                                            return "Please enter a valid email address";
                                        }
                                    }}
                                    label="Email"
                                    labelPlacement="outside"
                                    name="email"
                                    value={email}
                                    onValueChange={setEmail}
                                    placeholder="Enter your email"
                                    type="email"
                                />
                                <Input
                                    isRequired
                                    errorMessage={getPasswordError(password)}
                                    isInvalid={getPasswordError(password) !== null}
                                    label="Password"
                                    labelPlacement="outside"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onValueChange={setPassword}
                                    endContent={
                                        <button
                                            aria-label="toggle password visibility"
                                            className="focus:outline-solid outline-transparent"
                                            type="button"
                                            onClick={toggleVisibility}
                                        >
                                            {isVisible ? (
                                                <EyeFilledIcon
                                                    className="text-2xl text-default-400 pointer-events-none"/>
                                            ) : (
                                                <EyeSlashFilledIcon
                                                    className="text-2xl text-default-400 pointer-events-none"/>
                                            )}
                                        </button>
                                    }
                                    type={isVisible ? "text" : "password"}
                                />
                                <div className="grid grid-cols-2 gap-4 ">
                                    <div className="min-h-[96px]">
                                        <Select
                                            isRequired
                                            label="Role"
                                            labelPlacement="outside"
                                            name="role"
                                            selectedKeys={role ? [role] : []}
                                            onSelectionChange={(keys) =>
                                                setRole(Array.from(keys)[0] as string)
                                            }
                                            placeholder="Select role for user"

                                        >
                                            <SelectItem key="Admin">Admin</SelectItem>
                                            <SelectItem key="User">User</SelectItem>
                                            <SelectItem key="Staff">Staff</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="min-h-[96px]">
                                        <Select
                                            isRequired
                                            label="Status"
                                            labelPlacement="outside"
                                            name="status"
                                            selectedKeys={status ? [status] : []}
                                            onSelectionChange={(keys) =>
                                                setStatus(Array.from(keys)[0] as string)
                                            }
                                            placeholder="Select status for user"
                                        >
                                            <SelectItem key="Active">Active</SelectItem>
                                            <SelectItem key="Pause">Pause</SelectItem>
                                            <SelectItem key="Vacation">Vacation</SelectItem>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 ">
                                    <Input
                                        isRequired
                                        errorMessage={({validationDetails}) => {
                                            if (validationDetails.valueMissing) {
                                                return "Please enter your age";
                                            }
                                        }}
                                        label="Age"
                                        value={age}
                                        onValueChange={setAge}
                                        labelPlacement="outside"
                                        name="age"
                                        placeholder="Enter your age"
                                        type="number"
                                    />
                                    <div className="flex flex-col gap-1 col-span-2">
                                        <label className="text-sm font-medium">Avatar</label>
                                        <div className="flex gap-2 items-center">
                                            {/* Input nhập link */}
                                            <Input
                                                placeholder="Paste avatar URL or choose file"
                                                value={avatar_url}
                                                onValueChange={setAvatar_Url}
                                                name="avatar_url"
                                                className="flex-1"
                                            />

                                            {/* Nút chọn file */}
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setAvatarFile(file);
                                                        setAvatar_Url(URL.createObjectURL(file));
                                                    }}
                                                />
                                                <div
                                                    className="px-4 h-[40px] flex items-center rounded-lg border bg-gray-50 hover:bg-gray-100 text-sm">
                                                    Choose
                                                </div>
                                            </label>
                                        </div>

                                        {/* Preview */}
                                        {avatar_url && (
                                            <img
                                                src={avatar_url}
                                                alt="Avatar preview"
                                                className="w-16 h-16 rounded-full object-cover border"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 p-5 justify-end items-center">
                                    <Button onPress={handleSubmit} className="w-1/3" color="primary">
                                        Submit
                                    </Button>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                        {/*<ModalFooter>*/}
                        {/*    <Button color="danger" variant="light" onPress={onClose}>*/}
                        {/*        Close*/}
                        {/*    </Button>*/}
                        {/*</ModalFooter>*/}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
