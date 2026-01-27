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
    User,
    Pagination, SortDescriptor, Form, Select, SelectItem, useDisclosure,
} from "@heroui/react";
import type {Selection} from '@nextui-org/react'
import {supabaseClient} from "@/utils/supabase/client";
import DeleteUserModal from "@/components/modal/users/delete";
import ViewUserModal from "@/components/modal/users/view";
import CreateProductModal from "@/components/modal/products/create";
import EditProductModal from "@/components/modal/products/update";
import DeleteModal from "@/components/modal/products/delete";
import ViewProductModal from "@/components/modal/products/view";
import {useProducts} from "@/hook/product/getProducts";


const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NAME", uid: "name", sortable: true},
    {name: "PICTURE", uid: "picture", sortable: true},
    {name: "PRICE", uid: "price", sortable: true},
    {name: "DESCRIPTION", uid: "description", sortable: true},
    {name: "SIZE", uid: "size", sortable: true},
    {name: "COLOR", uid: "color", sortable: true},
    {name: "INVENTORY", uid: "inventory", sortable: true},
    {name: "PRODUCT TYPE", uid: "product_type", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
    {name: "Available", uid: "available"},
    {name: "Low stock", uid: "low_stock"},
    {name: "Unavailable", uid: "unavailable"},
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
    available: "success",
    unavailable: "danger",
    low_stock: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "picture", "price", "description", "size", "color", "inventory", "product_type", "status", "actions"];

export default function TableProduct() {
    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

    const [selectedItem, setSelectedItem] = useState(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenView, setIsOpenView] = useState(false);

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
    const {products} = useProducts()
    useEffect(() => {
        (async () => {
            setListItems(products)
        })()
        const supabase = supabaseClient;
        const channel = supabase
            .channel("products-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*", // INSERT | UPDATE | DELETE
                    schema: "public",
                    table: "products",
                },
                (payload) => {
                    console.log("Realtime event:", payload);

                    // INSERT
                    if (payload.eventType === "INSERT") {
                        setListItems(products)
                    }

                    // UPDATE
                    if (payload.eventType === "UPDATE") {
                        setListItems(products)
                    }

                    // DELETE
                    if (payload.eventType === "DELETE") {
                        setListItems(products)
                    }
                }
            )
            .subscribe();
        const channel_productOption = supabase
            .channel("product_option-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*", // INSERT | UPDATE | DELETE
                    schema: "public",
                    table: "product_option",
                },
                (payload) => {
                    console.log("Realtime event:", payload);

                    // INSERT
                    if (payload.eventType === "INSERT") {
                        setListItems(products)
                    }

                    // UPDATE
                    if (payload.eventType === "UPDATE") {
                        setListItems(products)
                    }

                    // DELETE
                    if (payload.eventType === "DELETE") {
                        setListItems(products)
                    }
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(channel_productOption);
        };
    }, [products]);


    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center gap-3">

                        <div className="flex flex-col">
                            <p className="font-semibold">{item.name}</p>
                        </div>
                    </div>
                );
            case "size":

                return (
                    <div className="flex flex-col">
                        {item.option?.map((item, index) => (
                            <p key={index} className="text-bold text-tiny capitalize">{item.size}</p>
                        ))}

                    </div>
                );
            case "color":

                return (
                    <div className="flex flex-col">
                        {item.option?.map((item, index) => (
                            <p key={index} className="text-bold text-tiny capitalize">{item.color}</p>
                        ))}

                    </div>
                );
            case "inventory":

                return (
                    <div className="flex flex-col">
                        {item.option?.map((item, index) => (
                            <p key={index} className="text-bold text-tiny capitalize">{item.inventory}</p>
                        ))}

                    </div>
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
            <CreateProductModal isOpen={isOpen} onClose={() => onOpenChange()}/>
            <EditProductModal
                isOpen={isOpenEdit}
                onClose={() => setIsOpenEdit(false)}
                itemEdit={selectedItem}
            />
            <DeleteModal
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                ItemDelete={selectedItem}
            />
            <ViewProductModal
                isOpen={isOpenView}
                onClose={() => setIsOpenView(false)}
                itemView={selectedItem}
            />

        </>
    );
}

