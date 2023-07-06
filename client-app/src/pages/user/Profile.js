import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  //get user data
  useEffect(() => {
    const { email, nama, phone, address } = auth?.user;
    setNama(nama);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);
  // form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        nama,
        email,
        password,
        phone,
        address,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Update Profile Berhasil!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <h4 className="title">USER PROFILE</h4>
                <div class="mb-3">
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    class="form-control"
                    id="exampleInputNama"
                    placeholder="Enter Your Name"
                  />
                </div>

                <div class="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    class="form-control"
                    id="exampleInputEmail"
                    placeholder="Enter Your Email"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    class="form-control"
                    id="exampleInputPassword1"
                    placeholder="Enter Your Password"
                  />
                </div>

                <div class="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    class="form-control"
                    id="exampleInputPhone"
                    placeholder="Enter Your Phone"
                  />
                </div>

                <div class="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    class="form-control"
                    id="exampleInputaddress"
                    placeholder="Enter Your Address"
                  />
                </div>

                <button type="submit" class="btn btn-primary">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
