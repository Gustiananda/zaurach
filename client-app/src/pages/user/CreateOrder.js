import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import DropIn from "braintree-web-drop-in-react";

const { Option } = Select;
const CreateProduct = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [address, setAddress] = useState(" ");
  const [phone, setPhone] = useState(" ");
  const [payment, setPayment] = useState("");
  const [buyer, setBuyer] = useState(" ");
  const [status, setStatus] = useState(" ");

  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  //total harga
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "IDR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };
  //getall product
  const getproductController = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProduct(data.product);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  //get user data
  useEffect(() => {
    const { nama, phone, buyer, address } = auth?.user;
    setNama(nama);
    setPhone(phone);
    setAddress(address);
    setBuyer(buyer);
  }, [auth?.user]);
  // form
  //getall product
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  //lifecycle
  useEffect(() => {
    getAllProducts();
  }, []);

  //create order
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const orderData = new FormData();
      orderData.append("buyer", buyer);
      orderData.append("address", address);
      orderData.append("phone", phone);
      orderData.append("product", product);
      orderData.append("status", status);
      const { data } = axios.post("/api/v1/order/create-product", orderData);
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Barang berhasil di Order, Mohon tunggu!");
        navigate("/dashboard/user");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Order"}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Order Product ~ ${auth?.token && auth?.user?.nama}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `Kamu Memiliki ${cart.length} produk di keranjang ${
                    auth?.token ? "" : "Silakan login untuk lanjut belanja!"
                  }`
                : "Keranjang anda kosong!"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    class="card-img-top"
                    alt={p.nama}
                    width="100px"
                    height={"300px"}
                  />
                </div>
                <div className="col-md-8">
                  <p>{p.nama}</p>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price : {p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CART */}
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()}</h4>
            <hr />
            <h2>Create Order</h2>

            {cart?.map((p) => (
              <div className="col-mb-3">
                <input
                  type="text"
                  value={p.nama}
                  className="form-control"
                  onChange={(e) => setCart(e.target.value)}
                />
              </div>
            ))}

            <div className="mb-3">
              <h5> Nama Anda </h5>
              <input
                type="text"
                value={buyer}
                placeholder="Tuliskan Nama Produk"
                className="form-control"
                onChange={(e) => setBuyer(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <h5> Alamat Anda </h5>
              <textarea
                type="text"
                value={auth?.user?.address}
                alt="Tuliskan Alamat"
                className="form-control"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <h5> No Telepon (Aktif) </h5>
              <input
                type="text"
                value={phone}
                placeholder="Tuliskan No telepon"
                className="form-control"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <Select
                bordered={false}
                placeholder="PILIH PEMBAYARAN"
                size="large"
                className="form-select mb-3"
                onChange={(value) => {
                  setStatus(value);
                }}
              >
                <Option value="0">TRANSFER BANK KONFIRMASI WA</Option>
                <Option value="0">COD</Option>
              </Select>
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" onClick={handleCreate}>
                ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
