import { Button } from "@heroui/button";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/modal";
import { Chip } from "@heroui/react";

export default function ViewProductModal({ isOpen, onClose, itemView }) {
    if (!itemView) return null;

    const pictures: string[] = Array.isArray(itemView.picture)
        ? itemView.picture
        : typeof itemView.picture === "string"
            ? (() => {
                try {
                    const parsed = JSON.parse(itemView.picture);
                    return Array.isArray(parsed) ? parsed : [itemView.picture];
                } catch {
                    return [itemView.picture];
                }
            })()
            : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Product Detail
                        </ModalHeader>

                        <ModalBody className="space-y-4 text-sm">

                            {/* Name */}
                            <div>
                                <p className="font-semibold">Name</p>
                                <p>{itemView.name}</p>
                            </div>

                            {/* Price */}
                            <div>
                                <p className="font-semibold">Price</p>
                                <p>{itemView.price}</p>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="font-semibold">Status</p>
                                <Chip
                                    className="capitalize mt-1"
                                    color={
                                        itemView.status === "available"
                                            ? "success"
                                            : itemView.status === "low_stock"
                                                ? "warning"
                                                : "danger"
                                    }
                                    variant="flat"
                                >
                                    {itemView.status}
                                </Chip>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="font-semibold">Description</p>
                                <p className="whitespace-pre-line">
                                    {itemView.description}
                                </p>
                            </div>

                            {/* Variants */}
                            <div>
                                <p className="font-semibold mb-2">Variants</p>

                                {itemView.option?.length > 0 ? (
                                    <div className="space-y-2">
                                        {itemView.option.map((v, index) => (
                                            <div
                                                key={index}
                                                className="border rounded p-2 flex justify-between"
                                            >
                                                <span>
                                                    Size: <b>{Array.isArray(v.size) ? v.size.join(", ") : v.size}</b>
                                                </span>
                                                <span>
                                                    Color: <b>{v.color}</b>
                                                </span>
                                                <span>
                                                    Inventory: <b>{v.inventory}</b>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-default-400">
                                        No variants
                                    </p>
                                )}
                            </div>
                            {/* Pictures */}
                            {pictures.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-2">Pictures</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {pictures.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt="product"
                                                className="w-20 h-20 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}


                            {/* Actions */}
                            <div className="flex justify-end pt-4">
                                <Button variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </div>

                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
