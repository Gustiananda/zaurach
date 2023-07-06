import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Image } from "@chakra-ui/image";
import { Box, Center, Flex, HStack, Text, VStack } from "@chakra-ui/layout";
import React, { useState } from "react";
import AppTemplate from "../../components/AppTemplate";
import Layout, { LayoutAdmin } from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useSelectedOrder } from "../../context/selectedOrder";
import { toFormatPrice } from "../../utils/currency";
import { useNavigate } from "react-router-dom";
import { GiConsoleController } from "react-icons/gi";

const CartUser = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [selectedOrder, setSelectedOrder] = useSelectedOrder();
  const navigate = useNavigate();
  const [lisCartSelected, setListCartSelected] = useState([])

  const onLanjut = () => {
    // console.log('lisCartSelected', lisCartSelected)
    setSelectedOrder(lisCartSelected)
    console.log('lisCartSelected', lisCartSelected)
    navigate("/user/paymant")
  }

  const onHapus = () => {
    let newData = []
    cart.forEach((crt) => {
      if (!lisCartSelected.includes(crt)) {
        newData.push(crt)
      }
    })
    setCart(newData)
    // setSelectedOrder([])
  }

  const chekclist = (crt) => {
    console.log('crt', crt)
    let newData = lisCartSelected;
    let idExistData = newData.map((dt) => dt._id)
    if (idExistData.includes(crt._id)) {
      newData = lisCartSelected.filter((dt) => dt._id !== crt._id)
    } else {
      newData.push(crt)
    }
    setListCartSelected(newData)
  }


  return (
    <LayoutAdmin title="Dashboard - Zaurach.co">
      <AppTemplate>
        <Box p='3' minH="100vh">
          <Text color="gray.800" fontSize="40px" fontWeight="400" textAlign="center" m='0'>CART</Text>
          <Box mt="6">
            <Flex justifyContent="flex-end" alignItems="center" w="full" gap="15px">
              <Button isDisabled={lisCartSelected.length === 0} onClick={onLanjut} colorScheme="green">
                Lanjut
                </Button>
              <Button onClick={onHapus} colorScheme="red">
                Hapus
              </Button>
            </Flex>
            <VStack spacing={6} mt="10">
              {cart.map((crt, i) => (
                <Flex boxShadow="md" key={i} gap="15px" w="full">
                  <Image width="200px" height="300px" alt={crt.nama} src={`/api/v1/product/product-photo/${crt._id}`} />
                  <Box w="80%">
                    <Text>
                      NAMA PRODUK: {crt.nama}
                    </Text>
                    <Text>
                      HARGA: {toFormatPrice(crt.price, 'Rp.')}
                    </Text>
                    <Text>
                      DESKRIPSI PRODUK:{crt.description.substring(0, 30)}
                    </Text>
                  </Box>
                  <Flex w="20%" alignItems="center">
                    <Checkbox onChange={() => chekclist(crt)}
                      checked={lisCartSelected.includes(crt)}
                      size="lg" colorScheme="blue" borderColor="gray" borderWidth="2px" />
                  </Flex>
                </Flex>
              ))}
            </VStack>
          </Box>
        </Box>
      </AppTemplate>
    </LayoutAdmin>
  );
};

export default CartUser;
