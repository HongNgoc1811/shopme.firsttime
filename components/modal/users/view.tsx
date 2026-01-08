import {Button} from "@heroui/button";
import {Avatar, Chip, ModalHeader} from "@heroui/react";
import React, {useState} from "react";
import EditUserModal from "@/components/modal/users/update";
import {Modal, ModalBody, ModalContent} from "@heroui/modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userView: any;
}

export default function ViewUserModal({isOpen, onClose, userView}: Props) {
    const [IsOpenEdit, setIsOpenEdit] = useState(false);
    const [selectedUser] = useState(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Create User</ModalHeader>
                        <ModalBody>
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">

                                    {/* LEFT COLUMN */}
                                    <div
                                        className="col-span-1 p-6 rounded-2xl border bg-white border-default-200 shadow-sm flex flex-col items-center text-center">
                                        {/*<img*/}
                                        {/*    src={userView.avatar_url}*/}
                                        {/*    alt=""*/}
                                        {/*    className="w-28 h-28 rounded-full border shadow-sm object-cover"*/}
                                        {/*/>*/}
                                        <Avatar
                                            src={userView.avatar_url || undefined}
                                            name={userView.name}
                                            size="lg"
                                        />


                                        <h2 className="font-semibold text-xl mt-4">{userView.name}</h2>
                                        <p className="text-default-500 text-sm">{userView.email}</p>

                                        <Chip
                                            color="success"
                                            variant="flat"
                                            className="mt-3 capitalize"
                                        >
                                            {userView.role}
                                        </Chip>

                                        <Chip
                                            color={userView.is_block ? "danger" : "success"}
                                            variant="flat"
                                            className="mt-3 capitalize"
                                        >
                                            {userView.is_block ? "Block" : "Active"}
                                        </Chip>


                                        <p className="text-default-500 text-sm mt-4">
                                            Tham gia:{" "}
                                            <span className="text-default-700">
                                                    {new Date(userView.created_at).toLocaleDateString() || "—"}
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

                                        <DetailRow label="Tên" value={userView.name}/>
                                        <DetailRow label="Tuổi" value={userView.age}/>
                                        <DetailRow label="Email" value={userView.email}/>
                                        <DetailRow label="Role" value={userView.role}/>
                                        <DetailRow
                                            label="Created at"
                                            value={new Date(userView.created_at).toLocaleString()}
                                        />
                                        <DetailRow
                                            label="Status"
                                            value={userView.is_block ? "Block" : "Active"}
                                        />
                                        <h3 className="font-semibold text-lg mt-8 mb-2">
                                            Hoạt động gần đây
                                        </h3>

                                        <ul className="list-disc pl-6 text-sm text-default-700 space-y-1">
                                            <li>Đăng nhập lần cuối: {new Date().toLocaleString()}</li>
                                            <li>Chỉnh sửa hồ sơ: —</li>
                                            <li>Đổi role: —</li>
                                        </ul>
                                    </div>
                                </div>
                            </>

                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>

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
