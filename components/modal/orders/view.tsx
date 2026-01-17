import {Button} from "@heroui/button";
import {Avatar, Chip, ModalHeader} from "@heroui/react";
import React, {useState} from "react";
import EditUserModal from "@/components/modal/users/update";
import {Modal, ModalBody, ModalContent} from "@heroui/modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    itemView: any;
}

export default function ViewOrderModal({isOpen, onClose, itemView}: Props) {
    const [IsOpenEdit, setIsOpenEdit] = useState(false);
    const [selectedItem] = useState(null);

    return (
        <>
            <EditUserModal
                isOpen={IsOpenEdit}
                onClose={() => setIsOpenEdit(false)}
                itemEdit={selectedItem}
            />
            <Modal isOpen={isOpen} onClose={onClose} title="Order Detail" size="4xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Order Detail</ModalHeader>
                            <ModalBody>
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3">

                                        {/* LEFT COLUMN */}
                                        <div className="col-span-1 p-3 rounded-2xl border bg-white border-default-200 shadow-sm flex flex-col items-center text-center">

                                            <h2 className="font-semibold text-xl mt-4">{itemView.order_code}</h2>
                                            <p className="text-default-600 font-semibold text-sm">{itemView.user_name}</p>

                                            <Chip
                                                color="success"
                                                variant="flat"
                                                className="mt-3 capitalize"
                                            >
                                                {itemView.email}
                                            </Chip>

                                            <Chip
                                                color={itemView.is_block ? "danger" : "success"}
                                                variant="flat"
                                                className="mt-3 capitalize"
                                            >
                                                {itemView.is_block ? "Block" : "Active"}
                                            </Chip>


                                            <p className="text-default-500 text-sm mt-4">
                                                Tham gia:{" "}
                                                <span className="text-default-700">
                                                    {new Date(itemView.created_at).toLocaleDateString() || "—"}
                                                </span>
                                            </p>

                                            <div className="flex gap-3 mt-6">
                                                <Button color="primary" onPress={() => {
                                                    setIsOpenEdit(true);
                                                    onClose()
                                                }}>Chỉnh sửa</Button>
                                                <Button variant="bordered" onClick={onClose}>
                                                    Quay lại
                                                </Button>
                                            </div>
                                        </div>

                                        {/* RIGHT COLUMN */}
                                        <div
                                            className="col-span-2 p-6 rounded-2xl border bg-white border-default-200 shadow-sm">

                                            <h3 className="font-semibold text-lg mb-4">Chi tiết</h3>

                                            <DetailRow label="User name" value={itemView.user_name}/>
                                            <DetailRow label="Product_name" value={itemView.product_name}/>
                                            <DetailRow label="Price" value={itemView.price}/>
                                            <DetailRow label="Quantity" value={itemView.quantity}/>
                                            <DetailRow label="Total_Price" value={itemView.total_price}/>

                                            <DetailRow
                                                label="Created at"
                                                value={new Date(itemView.created_at).toLocaleString()}
                                            />
                                            <DetailRow
                                                label="Status"
                                                value={itemView.is_block ? "Block" : "Active"}
                                            />

                                        </div>
                                    </div>
                                </>

                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

/* --- COMPONENT RENDER DÒNG THÔNG TIN --- */
function DetailRow({label, value}: any) {
    return (
        <div className="w-full grid grid-cols-3 border-b border-gray-500 py-3 text-sm">
            <div className="text-default-500">{label}</div>
            <div className="col-span-2 text-default-700">{value}</div>
        </div>
    );
}
