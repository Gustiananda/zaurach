import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import mongoose from "mongoose";
/**
 * Create Orders Controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const createOrderController = async (req, res) => {
  try {
    const {
      nama,
      address,
      phone,
      products,
      paymentType,
    } = req.fields;
    const { photo } = req.files;
    const productsArr = JSON.parse(products)
    //validation
    switch (true) {
      case !nama:
        return res.status(500).send({ error: "Nama tidak boleh kosong" });
      case !products:
        return res.status(500).send({ error: "Produk dibutuhkan" });
      case !phone:
        return res.status(500).send({ error: "Nomor telfon dibutuhkan" });
      case photo && photo.size > 5000000:
        return res
          .status(500)
          .send({ error: "Ukuran file gambar tidak boleh lebih dari 5 MB" });
    }

    const items = []
    let totalPriceOrder = 0
    for (let i = 0; i < productsArr.length; i++) {
      const product = await productModel.findById(productsArr[i]).select("price");
      if (product) {
        items.push({
          products: productsArr[i],
          realPrice: product.price,
          quantity: 1
        })
        totalPriceOrder += product.price * 1
      }
    }
    console.log(items)
    let paymentPhoto
    let paymentPhotoContentType
    if (photo) {
      paymentPhoto = fs.readFileSync(photo.path);
      paymentPhotoContentType = photo.type;
    }

    await orderModel.create({
      address: address,
      phone: phone,
      items: items,
      paymentType: paymentType,
      totalPriceOrder: totalPriceOrder,
      payment: photo ? {
        data: paymentPhoto,
        contentType: paymentPhotoContentType,
      } : null,
      buyer: req.user._id,
    });
    res.status(200).send({
      success: true,
      message: "Berhasil membuat pesanan",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in create orders",
    });
  }
};

/**
 *  Get Orders By Buyer Controller
 * @param {*} req 
 * @param {*} res 
 */
export const getListOrderByBuyer = async (req, res) => {
  try {
    console.log('req', req.user)
    const orders = await orderModel.find({
      buyer: new mongoose.Types.ObjectId(req.user._id),
    }).populate({
      path: 'items.products',
      select: 'nama photo',
    }).sort({ createdAt: -1 });
    console.log('orders', orders)
    return res.send({
      success: true,
      data: orders,
      message: 'Berhasil get daftar orders',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error get daftar orders",
    });
  }
};

/**
 *  Get All Orders Controller
 * @param {*} req 
 * @param {*} res 
 */
export const getListAllOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate({
      path: 'items.products',
      select: 'nama photo',
    }).populate({path:'buyer', select:'nama'})
      .sort({ createdAt: -1 });
    console.log('orders', orders)
    return res.send({
      success: true,
      data: orders,
      message: 'Berhasil get daftar orders',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error get daftar orders",
    });
  }
};

//get photo
export const orderPhotoController = async (req, res) => {
  try {
    const product = await orderModel.findById(req.params.pid).select("payment");
    console.log(product)
    if (product.payment.data) {
      res.set("Content-type", product.payment.contentType);
      return res.status(200).send(product.payment.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error while getting photo",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Product",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in getting products",
      error: error.message,
    });
  }
};

/**
 * Change Status Order
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getChangeStatusOrder = async (req, res) => {
  try {
    const { id, status } = req.body
    const orders = await orderModel.findById(new mongoose.Types.ObjectId(id));

    if (!orders) {
      res.status(500).send({
        success: false,
        error,
        message: "Order not found",
      });
    }
    orders.status = status
    await orders.save()
    return res.send({
      success: true,
      data: null,
      message: 'Berhasil change order status',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error change order status",
    });
  }
};


