import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [nama, setNama] = useState(auth?.user?.nama);
  const [phone, setPhone] = useState(auth?.user?.phone);
  const [address, setAddress] = useState(auth?.user?.address);
  const [cart, setCart] = useCart();

  const [photo, setPhoto] = useState(" ");

  const navigate = useNavigate();

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

  //create payment
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const orderData = new FormData();
      orderData.append("nama", nama);
      let listProduct = cart.map((crt) => crt._id);
      orderData.append("products", JSON.stringify(listProduct));
      orderData.append("address", address);
      orderData.append("photo", photo);
      orderData.append("phone", phone);
      const { data } = await axios.post(
        "/api/v1/order/create-orders",
        orderData
      );
      console.log('data', data)
      if (data.success) {
        toast.success("Checkout Barang Berhasil!");
        setCart([])
        navigate("/dashboard/user/orders");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`CHECKOUT ~ ${auth?.token && auth?.user?.nama}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `Kamu Memiliki ${cart.length} produk di keranjang ${auth?.token ? "" : "Silakan login untuk lanjut belanja!"
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
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h5 className="text-left">Nama anda</h5>
                  <input
                    type="text"
                    value={nama}
                    placeholder="Tuliskan Nama Anda"
                    className="form-control"
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <h5>Alamat Anda saat ini</h5>
                  <textarea
                    type="text"
                    value={address}
                    placeholder="Tuliskan Alamat Anda"
                    className="form-control"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <h5>Nomor telfon Anda saat ini</h5>
                  <textarea
                    type="text"
                    value={phone}
                    placeholder="Tuliskan Nomor Telfon Anda"
                    className="form-control"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <input
                    type="text"
                    value={auth?.user?.nama}
                    placeholder="Tuliskan Nama Anda"
                    className="form-control"
                    onChange={(e) => setNama(e.target.value)}
                  />
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Silakan Login untuk Belanja!
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              <h3>Transfer Bank BCA No-Rek : 99999</h3>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.nama : "Upload Bukti Transfer"}Upload Bukti
                  Transfer
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo && (
                  <div className="text-center">
                    <img
                      src={`/api/v1/product/product-photo/${photo}`}
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <button className="btn btn-primary" onClick={handlePayment}>
                CheckOut
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
