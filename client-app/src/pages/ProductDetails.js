import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  //initial detail
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //get produk
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="row container mt-5">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            class="card-img-top"
            alt={product.nama}
            height="400px"
            width={"100px"}
          />
        </div>
        <div className="col-md-6">
          <h1 className="text-center">Product Details</h1>
          <h5>Nama :</h5> {product.nama}
          <h5>Deskripsi :</h5> {product.description}
          <h5>Harga :</h5>Rp.
          {product.price}
          <h5>Kategori :</h5>
          <h6>{product.category?.nama}</h6>
          <button class="btn btn-secondary ms-1">Add to cart</button>
          <hr />
        </div>
        <div className="row container">
          <h6>Similar Product</h6>
          {relatedProducts.length < 1 && (
            <p className="text-center">Tidak ada produk serupa!</p>
          )}
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
              <div class="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`/api/v1/product/product-photo/${p?._id}`}
                  class="card-img-top"
                  alt={p.nama}
                />
                <div class="card-body">
                  <h5 class="card-title"> {p.nama}</h5>
                  <p class="card-text">{p.description.substring(0, 30)}...</p>
                  <p class="card-text">Rp. {p.price}</p>

                  <button class="btn btn-secondary ms-1">Add to cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
