import {Button} from "@heroui/button";
import React, {useEffect, useState} from "react";
import {
    Input,
    Select,
    SelectItem,
    ModalContent,
    ModalHeader,
    ModalBody, ModalFooter
} from "@heroui/react";
import {Modal} from "@heroui/modal";
import {MailIcon} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    itemEdit: any;
}

export default function EditOrderModal({isOpen, onClose,itemEdit}: Props) {
    const [user_id, setUserID] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [total_price, setTotalPrice] = useState("0");
    const [status, setStatus] = useState("Pending");
    const [users, setUsers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const [itemForm, setItemForm] = useState({
        product_id: "",
        price: "0",
        product_name: ""
    });

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            const [uRes, pRes] = await Promise.all([
                fetch("/api/admin/users"),
                fetch("/api/admin/products")
            ]);

            setUsers(await uRes.json());
            setProducts(await pRes.json());
        };

        fetchData();
    }, [isOpen]);


    useEffect(() => {
        if (!itemEdit) return;

        setUserID(String(itemEdit.user_id));
        setTotalPrice(String(itemEdit.total_price));
        setQuantity(String(itemEdit.quantity));
        setStatus(itemEdit.status);

        setItemForm(
            {
                product_id: String(itemEdit.product_id),
                product_name: itemEdit.product_name,
                price: String(itemEdit.price),

            });
    }, [itemEdit]);

    useEffect(() => {
        const total = Number(quantity) * Number(itemForm.price);
        setTotalPrice(total.toString());
    }, [quantity, itemForm.price]);

    // Xử lý chọn sản phẩm
    const handleProductChange = (keys: any) => {
        const optionId = String(Array.from(keys)[0]);
        const option = products.find(p => String(p.id) === optionId);

        if (option) {
            setItemForm((prev) => ({
                ...prev,
                product_id: String(option.id_product),
                product_name: option.products.name,
                price: String(option.products.price)
            }));
        }
    };

    const handleSubmit = async () => {
        if (!user_id || !itemForm.product_id || !quantity) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        try {
            const res = await fetch(`/api/admin/orders/${itemEdit.id}`  , {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: Number(user_id),
                    product_id: Number(itemForm.product_id),
                    quantity: Number(quantity),
                    total_price: Number(total_price),
                    status,
                }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Update failed");
            }
            onClose();
        } catch (err: any) {
            alert(err.message);
        }
    };


        return (
            <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" className="h-160 ">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Update Order</ModalHeader>
                            <ModalBody className="overflow-y-auto">

                                <div className="flex flex-col gap-4 w-full p-5 ">

                                    <Select
                                        label="User"
                                        placeholder="Select a user"
                                        selectedKeys={user_id ? [user_id] : []}
                                        onSelectionChange={(keys) => setUserID(String(Array.from(keys)[0]))}
                                    >
                                        {users.map((u) => (
                                            <SelectItem key={String(u.id)} textValue={u.name}>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium ">{u.name}</span>
                                                    <span className="flex items-center gap-1 text-default-500 text-sm">
                                                    <MailIcon className="w-3.5 h-3.5"/>
                                                    <span>{u.email}</span>
                                                </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Select
                                        label="Product"
                                        placeholder="Select Product "
                                        selectedKeys={itemForm.product_id ? [String(itemForm.product_id)] : []} // Chỗ này nên dùng ID của option để tránh trùng lặp
                                        onSelectionChange={handleProductChange}
                                    >
                                        {products.map((p) => (
                                            <SelectItem
                                                key={String(p.id)}
                                                textValue={`${p.products.name}`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-small">{p.products.name}</span>
                                                    <span className="text-tiny text-primary font-bold">
                                                    Price: {Number(p.products.price).toLocaleString()} đ
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Input label="Total Price" value={total_price} isDisabled variant="flat"
                                           labelPlacement="outside"/>
                                    <Input
                                        label="Product Name"
                                        value={itemForm.product_name}
                                        isDisabled
                                    />

                                    <Input
                                        label="Price"
                                        type="number"
                                        value={itemForm.price}
                                        isDisabled
                                    />

                                    <Input
                                        isRequired
                                        errorMessage={({validationDetails}) => {
                                            if (validationDetails.valueMissing) {
                                                return "Please enter product quantity";
                                            }
                                        }}
                                        label="Quantity"
                                        value={quantity}
                                        onValueChange={setQuantity}
                                        labelPlacement="outside"
                                        name="quantity"
                                        placeholder="Enter quantity"
                                        type="number"

                                    />

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
                                        <SelectItem key="pending">Pending</SelectItem>
                                        <SelectItem key="confirmed">Confirmed</SelectItem>
                                        <SelectItem key="cancelled">Cancelled</SelectItem>
                                    </Select>


                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={handleSubmit} className="w-1/3" color="primary">
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
