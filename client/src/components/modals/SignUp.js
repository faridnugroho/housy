import { useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";

import Swal from "sweetalert2";

import { useMutation } from "react-query";
import { API } from "../../config/api";

import { useQuery } from "react-query";

function SignUp(props) {
  const handleClose = () => props.setSignUpShow(false);
  const handleShow = () => props.setSignUpShow(true);

  const [preview, setPreview] = useState(null); //For image preview
  const [signUp, setSignUp] = useState({
    roleid: "",
    fullname: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    address: "",
    image: "",
  });

  const handleChangeSignUp = (e) => {
    const { name, type } = e.target;
    setSignUp({
      ...signUp,
      [name]: type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleRegister = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("roleid", signUp.roleid);
      formData.append("fullname", signUp.fullname);
      formData.append("username", signUp.username);
      formData.append("email", signUp.email);
      formData.append("password", signUp.password);
      formData.append("gender", signUp.gender);
      formData.append("phone", signUp.phone);
      formData.append("address", signUp.address);
      formData.append("image", signUp.image[0]);

      const response = await API.post("/register", formData);
      console.log("Success Add User", response);

      signUp.roleid = "";
      signUp.fullname = "";
      signUp.username = "";
      signUp.email = "";
      signUp.password = "";
      signUp.gender = "";
      signUp.phone = "";
      signUp.address = "";
      signUp.image = "";

      props.setSignUpShow(false);
      props.setSignInShow(true);

      signUp.fullname = "";
      signUp.username = "";
      signUp.email = "";
      signUp.password = "";
      signUp.roleid = "";
      signUp.gender = "";
      signUp.phone = "";
      signUp.address = "";
      signUp.image = "";
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "User failed to save",
      });
    }
  });

  let { data: roles } = useQuery("rolesCache", async () => {
    const response = await API.get("/roles");
    return response.data.data;
  });

  return (
    <>
      <Modal show={props.signUpShow} onHide={handleClose}>
        <Modal.Body>
          <Form
            className="pt-4 px-3 pb-2"
            onSubmit={(e) => handleRegister.mutate(e)}
          >
            <Modal.Title className="text-center fw-bold mb-5">
              Sign up
            </Modal.Title>
            <Form.Group className="mb-4" controlId="fullname">
              <Form.Label className="fw-bold">Full Name</Form.Label>
              <Form.Control
                type="text"
                value={signUp?.fullname}
                name="fullname"
                onChange={handleChangeSignUp}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="username">
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control
                type="text"
                value={signUp?.username}
                name="username"
                onChange={handleChangeSignUp}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="email">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="email"
                value={signUp?.email}
                name="email"
                onChange={handleChangeSignUp}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="password">
              <Form.Label className="fw-bold">Password</Form.Label>
              <Form.Control
                type="password"
                value={signUp?.password}
                name="password"
                onChange={handleChangeSignUp}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="roleid">
              <Form.Label className="fw-bold">List As</Form.Label>
              <Form.Select
                name="roleid"
                value={signUp?.roleid}
                onChange={handleChangeSignUp}
              >
                <option>-- Pilih --</option>
                {roles?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4" controlId="gender">
              <Form.Label className="fw-bold">Gender</Form.Label>
              <Form.Select
                name="gender"
                value={signUp?.gender}
                onChange={handleChangeSignUp}
              >
                <option>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4" controlId="phone">
              <Form.Label className="fw-bold">Phone</Form.Label>
              <Form.Control
                type="number"
                value={signUp?.phone}
                name="phone"
                onChange={handleChangeSignUp}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="address">
              <Form.Label className="fw-bold">Address</Form.Label>
              <Form.Control
                rows={4}
                as="textarea"
                value={signUp?.address}
                name="address"
                onChange={handleChangeSignUp}
              />
            </Form.Group>
            <Form.Group className="mb-5">
              <Form.Label className="fw-bold">Photo Profile</Form.Label>
              <Form.Control
                type="file"
                id="upload"
                name="image"
                onChange={handleChangeSignUp}
                required
              />
              {preview && (
                <Image
                  src={preview}
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    marginTop: "10px",
                  }}
                />
              )}
            </Form.Group>
            <Form.Group className="d-flex gap-3 flex-column text-center">
              <Button variant="primary w-100" type="submit">
                Sign up
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

      <Button variant="light fw-bold" onClick={handleShow}>
        Sign Up
      </Button>
    </>
  );
}

export default SignUp;
