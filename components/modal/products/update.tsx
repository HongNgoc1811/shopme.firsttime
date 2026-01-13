import {Button} from "@heroui/button";
import React, {useEffect, useState} from "react";
import { Input, ModalFooter, ModalHeader, Select, SelectItem, Switch} from "@heroui/react";
import {Modal, ModalBody, ModalContent} from "@heroui/modal";
import {Textarea} from "@heroui/input";

export default function EditProductModal({isOpen, onClose, itemEdit}) {
    const [name, setName] = useState("");
    const [picture, setPicture] = useState<string[]>([]);
    const [picturefile, setPictureFile] = useState<File[]>([]);
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [size, setSize] = React.useState([]);
    // const [size, setSize] = React.useState<Set<string>>(new Set());
    // const [color, setColor] = React.useState<Set<string>>(new Set());
    const [color, setColor] = useState("");
    const [inventory, setInventory] = useState("");
    const [status, setStatus] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    // Real-time password validation
    const handleSave = async () => {
        const payload = {

            name: name,
            picture: picture,
            status: status,
            price: price,
            description: description,
            size: size,
            inventory: inventory,
            color: color,

        }
        const res = await fetch(`/api/admin/products/${itemEdit.id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        })
        const data = await res.json()
        console.log("data", data)
        onClose()
    }
    useEffect(() => {
        if(!itemEdit )return
        setName(itemEdit.name)
        // setPicture(itemEdit.picture)
        setPrice(itemEdit.price)
        setDescription(itemEdit.description)
        setInventory(itemEdit.inventory)
        setSize(itemEdit.size)
        setColor(itemEdit.color)
        setStatus(itemEdit.status)
        console.log("edit",itemEdit)
    }, [itemEdit]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="3xl" className="h-160">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Edit User</ModalHeader>
                        <ModalBody className="overflow-y-auto">
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
                                            return "Please enter product price";
                                        }
                                    }}
                                    label="Price"
                                    value={price}
                                    onValueChange={setPrice}
                                    labelPlacement="outside"
                                    name="price"
                                    placeholder="Enter price"
                                    type="number"
                                />

                                <Textarea
                                    isRequired
                                    label="Description"
                                    labelPlacement="outside"
                                    value={description}
                                    onValueChange={setDescription}
                                    name="description"
                                    placeholder="Enter product description"
                                    minRows={4}      //  chiều cao ban đầu
                                    maxRows={8}
                                    errorMessage={({validationDetails}) => {
                                        if (validationDetails.valueMissing) {
                                            return "Please enter product description";
                                        }
                                    }}
                                />

                                <div className="grid grid-cols-2 gap-4 ">
                                    <Select
                                        isRequired
                                        label="Size"
                                        labelPlacement="outside"
                                        selectionMode="multiple"
                                        selectedKeys={size}
                                        placeholder="Select sizes"
                                        onSelectionChange={(keys) => {
                                            setSize((pre) => [...pre, keys.currentKey])
                                        }  }
                                    >
                                        <SelectItem key="S">S</SelectItem>
                                        <SelectItem key="M">M</SelectItem>
                                        <SelectItem key="L">L</SelectItem>
                                        <SelectItem key="XL">XL</SelectItem>
                                    </Select>

                                    <Input
                                        isRequired
                                        label="Color"
                                        labelPlacement="outside"
                                        name="color"
                                        placeholder="VD: Red , Black , Green"
                                        value={color}
                                        onValueChange={setColor}
                                        errorMessage={({validationDetails}) => {
                                            if (validationDetails.valueMissing) {
                                                return "Please enter product size";
                                            }
                                        }}
                                    />

                                </div>

                                <div className="grid grid-cols-2 gap-4 ">
                                    <Select
                                        isRequired
                                        label="Status"
                                        labelPlacement="outside"
                                        name="status"
                                        selectedKeys={status ? [status] : []}
                                        onSelectionChange={(keys) =>
                                            setStatus(Array.from(keys)[0] as string)
                                        }
                                        placeholder="Select status for product"
                                    >
                                        <SelectItem key="available">Available</SelectItem>
                                        <SelectItem key="low_stock">Low stock</SelectItem>
                                        <SelectItem key="unavailable">Unavailable</SelectItem>
                                    </Select>


                                    <Input
                                        isRequired
                                        errorMessage={({validationDetails}) => {
                                            if (validationDetails.valueMissing) {
                                                return "Please enter product inventory";
                                            }
                                        }}
                                        label="Inventory"
                                        value={inventory}
                                        onValueChange={setInventory}
                                        labelPlacement="outside"
                                        name="inventory"
                                        placeholder="Enter product inventory"
                                        type="number"
                                    />
                                </div>

                                <div className="flex flex-col gap-1 ">
                                    <label className="text-sm font-medium">Picture</label>
                                    <div className="flex gap-2 items-center">
                                        {/* Input nhập link */}
                                        {/*<Input*/}
                                        {/*    placeholder="Paste avatar URL or choose file"*/}
                                        {/*    value={picture}*/}
                                        {/*    onValueChange={setPicture}*/}
                                        {/*    name="avatar_url"*/}
                                        {/*    className="flex-1"*/}
                                        {/*/>*/}

                                        {/* Nút chọn file */}
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    if (files.length === 0) return;
                                                    // preview
                                                    const previews = files.map(file => URL.createObjectURL(file));
                                                    setPictureFile(prev => [...prev, ...files]);
                                                    setPicture(prev => [...prev, ...previews]);
                                                }}
                                            />
                                            <div
                                                className="px-4 h-[40px] flex items-center rounded-lg border bg-gray-50 hover:bg-gray-100 text-sm">
                                                Choose
                                            </div>
                                        </label>
                                    </div>

                                    {/* Preview */}
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {picture.map((src, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={src}
                                                    alt="Preview"
                                                    className="w-16 h-16 rounded-lg object-cover border"
                                                />

                                                {/* Nút xoá từng ảnh */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPicture(picture.filter((_, i) => i !== index));
                                                        setPictureFile(picturefile.filter((_, i) => i !== index));
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                            </div>
                                </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="w-1/3" color="primary" type="submit" onPress={handleSave}>
                                Submit
                            </Button>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
