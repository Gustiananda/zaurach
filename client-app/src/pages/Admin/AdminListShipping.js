import { Button, IconButton } from "@chakra-ui/button";
import { Switch } from "@chakra-ui/switch";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { Tooltip } from "@chakra-ui/tooltip";
import React, { useMemo, useState, useEffect } from "react";
import AppTemplate from "../../components/AppTemplate";
import AdminMenu from "../../components/layout/AdminMenu";
import { LayoutAdmin } from "../../components/layout/Layout";
import { useAuth } from "../../context/auth";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  Search2Icon,
} from '@chakra-ui/icons';
import { useTable, usePagination } from 'react-table';
import { Box, Flex, Link, Text } from "@chakra-ui/layout";
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/number-input";
import { Select } from "@chakra-ui/select";
import { FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { toFormatPrice } from "../../utils/currency";
import { Image } from "@chakra-ui/image";
import ModalConfirm from "../../components/ModalConfirm";
import { useDisclosure } from "@chakra-ui/hooks";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";


const AdminListShipping = () => {
  const [auth] = useAuth();
  const [data, setData] = useState([])

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/order/get-by-admin");
      console.log('data',data)
      let temp  = []
      data.data.forEach((order, i) => {
        console.log('order',order)
        temp.push({
          no: i+1,
          id: order._id,
          items: order.items,
          status: order.status,
          buyer: order.buyer.nama,
          date: moment(order.createdAt).format("DD-MM-YYYY"),
          payment: order.paymentType === "cod" ? "COD" : order.status === "not process" ? "On Checking" : "Success",
          photo: order._id,
        })
      })
      setData(temp);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'No',
        accessor: 'no',
      },
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Nama Produk',
        accessor: 'namaProduk',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Buyer',
        accessor: 'buyer',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Payment',
        accessor: 'payment',
      },
      // {
      //   Header: 'Quantity',
      //   accessor: 'quantity',
      // },
      {
        Header: 'Photo',
        accessor: 'photo',
      },
    ],
    []
  );

  useEffect(()=> {
    getOrders()
  },[])

  return (
    <LayoutAdmin>
      <AppTemplate>
        <Box p='2'>
          <Text textAlign="center" fontWeight='700' color='gray.700' fontSize='2xl'>
            SHIPPING
          </Text>
          <Box>
            <Flex w='full' justifyContent='space-between' alignItems="center">
              <Box>
                <FormLabel>Cari nama buyer</FormLabel>
                <InputGroup w='500px' size='md'>
                  <Input placeholder='Cari nama...' />
                  <InputRightElement>
                    <IconButton
                      aria-label='cari'
                      // onClick={handleClick}
                      icon={<Search2Icon />}
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Flex>
            <Box my='3'>
              <CustomTable
                // getListProduk={getListProduk}
                // handleChangeStatus={handleChangeStatus}
                columns={columns}
                data={data}
              />
            </Box>
          </Box>
        </Box>

      </AppTemplate>
    </LayoutAdmin>
  );
};

export default AdminListShipping;


function CustomTable({
  columns,
  data,
  // handleChangeStatus,
  // getListProduk,
}) {
  // const { showToast } = useGlobalContext();
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      // initialState: { pageIndex: 2 }
    },
    usePagination
  );
  const [selectedId, setSelectedId] = useState(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const detailPage = (id) => {
    // console.log('id', id);
    // Router.push(`/penjual/produk/${id}`);
  };

  const handleDeleteProduk = async (produkId) => {
    // const res = await ApiDeleteProdukPenjual(produkId);
    // if (res.status === 200) {
    //   showToast({
    //     title: 'Berhasil',
    //     message: res.data.message,
    //     type: 'success',
    //   });
    //   getListProduk();
    // } else {
    //   showToast({
    //     title: 'Error',
    //     message: res.data.message,
    //     type: 'error',
    //   });
    // }
    onCloseDelete()
  };

  const onOpenDelete = (id) => {
    setSelectedId(id);
    onOpen()
  }

  const onCloseDelete = (id) => {
    setSelectedId(undefined);
    onClose()
  }
  // Render the UI for your table
  return (
    <>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  if (cell.column.Header === 'Nama Produk') {
                    return (
                      <Td {...cell.getCellProps()}>
                        {row.original.items.map((item, j) => (
                          <div key={j}>
                            <p>{item.products.nama}</p>
                            <p>
                              <Image
                                src={`/api/v1/product/product-photo/${item.products._id}`}
                                alt={item.products.nama}
                                width="100"
                                height="200"
                              />
                            </p>
                            <p>harga {item.realPrice}</p>
                            <p>jumlah {item.quantity}</p>
                          </div>
                        ))}
                      </Td>
                    );
                  } else if (cell.column.Header === 'Photo') {
                    return (
                      <Td
                        onClick={() => detailPage(row.original.id)}
                        {...cell.getCellProps()}
                      >
                        {row.original.payment === null ? "COD" : <Image
                            src={`/api/v1/order/get-payment-photo/${row.original.id}`}
                            alt="Bukti Pembayaran"
                            width="100"
                            height="200"
                          />}
                      </Td>
                    );
                  } else if (cell.column.Header === 'Status') {
                    return (
                      <Td
                        {...cell.getCellProps()}
                      >
                       <Text textTransform="capitalize" fontWeight="700" color={row.original.status === "not process" ? "red" : row.original.status === "process" ? "orange" : "green"}>{row.original.status}</Text>
                      </Td>
                    );
                  } else if (cell.column.Header === 'Payment') {
                    return (
                      <Td
                        {...cell.getCellProps()}
                      >
                       <Text textTransform="capitalize" fontWeight="700" color={row.original.status === "not process" ? "red" : row.original.status === "process" ? "orange" : "green"}>{row.original.payment}</Text>
                      </Td>
                    );
                  }  else {
                    return (
                      <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                    );
                  }
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Flex justifyContent='space-between' m={4} alignItems='center'>
        <Flex>
          <Tooltip label='First Page'>
            <IconButton
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
              aria-label='button'
            />
          </Tooltip>
          <Tooltip label='Previous Page'>
            <IconButton
              aria-label='button'
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems='center'>
          <Text flexShrink='0' mr={8}>
            Page{' '}
            <Text fontWeight='bold' as='span'>
              {pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight='bold' as='span'>
              {pageOptions.length}
            </Text>
          </Text>
          <Text flexShrink='0'>Go to page:</Text>{' '}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value) => {
              const page = value ? value - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label='Next Page'>
            <IconButton
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
              aria-label='button'
            />
          </Tooltip>
          <Tooltip label='Last Page'>
            <IconButton
              aria-label='button'
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <ModalConfirm
        onClose={onCloseDelete}
        isOpen={isOpen}
        title="Delete Produk"
        message="Apakah kamu yakin menghapus produk ?"
        onSubmit={handleDeleteProduk}
      />
    </>
  );
}
