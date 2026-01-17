import {Button} from "@heroui/button";
import { ModalHeader} from "@heroui/react";
import {Modal, ModalBody, ModalContent} from "@heroui/modal";

export default function DeleteOrderModal({isOpen, onClose, ItemDelete}) {
    const handleDelete = async () => {
        const res = await fetch(`/api/admin/orders/${ItemDelete.id}`, {
            method: "DELETE",
        })
        const data = await res.json()
        console.log("data", data)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Order" size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Order</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete <b>{ItemDelete?.order_code}</b>?</p>

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
