import {Button} from "@heroui/button";
import { ModalHeader} from "@heroui/react";
import {Modal, ModalBody, ModalContent} from "@heroui/modal";

export default function DeleteUserModal({isOpen, onClose, userDelete}) {
    const handleDelete = async () => {
        const res = await fetch(`/api/admin/users/${userDelete.id}`, {
            method: "DELETE",
        })
        const data = await res.json()
        console.log("data", data)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete User</ModalHeader>
                        <ModalBody>
                                 <p>Are you sure you want to delete <b>{userDelete?.name}</b>?</p>

                                 <div className="flex justify-end gap-2 mt-4">
                                     <Button variant="light" onPress={onClose}>Cancel</Button>
                                     <Button color="danger" onPress={handleDelete}>Delete</Button>
                                 </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>

    );
}
