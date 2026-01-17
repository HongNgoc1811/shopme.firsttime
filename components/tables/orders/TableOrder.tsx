"use client"
import React, {useEffect, useState} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination, SortDescriptor, useDisclosure,
} from "@heroui/react";
import type {Selection} from '@nextui-org/react'
import {supabaseClient} from "@/utils/supabase/client";
import CreateOrderModal from "@/components/modal/orders/create";
import DeleteOrderModal from "@/components/modal/orders/delete";
import ViewOrderModal from "@/components/modal/orders/view";
import EditOrderModal from "@/components/modal/orders/update";


const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "USERID", uid: "user_id", sortable: true},
    {name: "PRODUCTID", uid: "product_id", sortable: true},
    {name: "ORDER CODE", uid: "order_code", sortable: true},
    {name: "USER NAME", uid: "user_name", sortable: true},
    {name: "EMAIL", uid: "email", sortable: true},
    {name: "PRODUCT NAME", uid: "product_name", sortable: true},
    {name: "PRICE", uid: "price", sortable: true},
    {name: "QUANTITY", uid: "quantity", sortable: true},
    {name: "TOTAL PRICE", uid: "total_price", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
    {name: "Pending", uid: "pending"},
    {name: "Confirmed ", uid: "confirmed"},
    {name: "Cancelled", uid: "cancelled"},
];


export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const PlusIcon = ({size = 24, width, height, ...props}: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M6 12h12"/>
                <path d="M12 18V6"/>
            </g>
        </svg>
    );
};

const VerticalDotsIcon = ({size = 24, width, height, ...props}: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

const SearchIcon = (props: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

const ChevronDownIcon = ({strokeWidth = 1.5, ...otherProps}) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...otherProps}
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

const statusColorMap = {
    confirmed: "success",
    cancelled: "danger",
    pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["order_code","user_name","email", "product_name","price", "quantity", "total_price", "status", "actions"];

export default function TableOrder() {
    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

    const [selectedItem, setSelectedItem] = useState(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenView, setIsOpenView] = useState(false);

    useEffect(() => {
        console.log('isOpen', isOpen);
    }, [isOpen]);
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: 'name',
        direction: 'ascending',
    })
    const [listItems, setListItems] = React.useState<any[]>([])

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filtered = [...listItems];

        if (hasSearchFilter) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filtered = filtered.filter((item) =>
                Array.from(statusFilter).includes(item.status),
            );
        }

        return filtered;
    }, [listItems, hasSearchFilter, statusFilter, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    async function reloadOrder() {
        const res = await fetch("/api/admin/orders", { method: "GET" });

        if (!res.ok) {
            console.error("Lỗi khi fetch dữ liệu");
            return;
        }

        const json = await res.json();
        const orders = json.data || [];

        const listOrder = orders.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            product_id: item.product_id,

            // Lấy dữ liệu từ bảng liên kết
            user_name: item.profiles?.name || "N/A",
            email:item.profiles?.email,
            product_name: item.products?.name || "N/A",
            price: item.products?.price || 0,

            order_code: item.order_code,
            quantity: item.quantity,
            total_price: item.total_price,
            status: item.status,
            created_at: item.created_at,
        }));

        setListItems(listOrder);
    }
    useEffect(() => {
        (async () => {
            reloadOrder()
        })()
        const supabase = supabaseClient;
        const channel = supabase
            .channel("orders-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*", // INSERT | UPDATE | DELETE
                    schema: "public",
                    table: "orders",
                },
                (payload) => {
                    console.log("Realtime event:", payload);

                    // INSERT
                    if (payload.eventType === "INSERT") {
                        reloadOrder()
                    }

                    // UPDATE
                    if (payload.eventType === "UPDATE") {
                        reloadOrder()
                    }

                    // DELETE
                    if (payload.eventType === "DELETE") {
                        reloadOrder()
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "order_code":
                return (
                    <p className="text-bold text-tiny capitalize">{item.order_code}</p>
                );
            case "user_name":
                return (
                    <p className="text-bold text-tiny capitalize">{item.user_name}</p>
                );
            case "email":
                return (
                    <p className="text-bold text-tiny capitalize">{item.email}</p>
                );
            case "product_name":
                return (
                    <p className="text-bold text-tiny capitalize">{item.product_name}</p>
                );
            case "price":
                return (
                    <p className="text-bold text-tiny capitalize">{item.price}</p>
                );
            case "quantity":
                return (
                    <p className="text-bold text-tiny capitalize">{item.quantity}</p>
                );
            case "total_price":
                return (
                    <p className="text-bold text-tiny capitalize">{item.total_price}</p>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[item.status.toLowerCase()]} size="sm"
                          variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                                <VerticalDotsIcon className="text-default-300"/>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem
                                key="view"
                                onClick={() => {
                                    setSelectedItem(item);
                                    setIsOpenView(true);
                                }}
                            >
                                View
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                onClick={() => {
                                    setSelectedItem(item);
                                    setIsOpenEdit(true);
                                }}
                            >
                                Edit
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                onClick={() => {
                                    setSelectedItem(item);
                                    setIsOpenDelete(true);
                                }}
                            >
                                Delete
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<SearchIcon/>}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button className="bg-foreground text-background" endContent={<PlusIcon/>} size="sm"
                                onPress={onOpen}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {listItems.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, statusFilter, visibleColumns, onOpen, listItems.length, onRowsPerPageChange, onClear]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

    return (
        <>
            <Table
                isHeaderSticky
                aria-label="Example table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No users found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <CreateOrderModal isOpen={isOpen} onClose={() => onOpenChange()}/>
            <EditOrderModal
                isOpen={isOpenEdit}
                onClose={() => setIsOpenEdit(false)}
                itemEdit={selectedItem}
            />
            <DeleteOrderModal
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                ItemDelete={selectedItem}
            />
            <ViewOrderModal
                isOpen={isOpenView}
                onClose={() => setIsOpenView(false)}
                itemView={selectedItem}
            />

        </>
    );
}

