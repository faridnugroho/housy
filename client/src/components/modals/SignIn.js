import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useMutation } from "react-query";
import { API } from "../../config/api";

import Swal from "sweetalert2";

function SignIn(props) {
  const handleClose = () => props.setSignInShow(false);
  const [message, setMessage] = useState(null);

  const [state, dispatch] = useContext(UserContext);
  console.log(state);

  const handleChange = (e) => {
    props.setSignIn({
      ...props.signIn,
      [e.target.name]: e.target.value,
    });
  };

  const goToSignUp = (e) => {
    props.setSignInShow(false);
    props.setSignUpShow(true);
  };

  const navigate = useNavigate();

  const handleLogin = useMutation(async (e) => {
    try {
      e.preventDefault();

      const response = await API.post("/login", props.signIn);

      if (response.data.code === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data,
        });

        props.setSignInShow(false);
        props.setSignIn(true);

        response.data.data.role.name === "Owner"
          ? navigate("/owner")
          : navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal Login",
        });
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Either password or user name incorrect
        </Alert>
      );
      setMessage(alert);
      props.setSignInShow(true);
    }
  });

  return (
    <>
      <Modal show={props.signInShow} onHide={handleClose}>
        <Modal.Body>
          <Form
            className="pt-4 px-3 pb-2"
            onSubmit={(e) => handleLogin.mutate(e)}
          >
            <Modal.Title className="text-center fw-bold mb-5">
              Sign in
            </Modal.Title>
            <Form.Group className="mb-4" controlId="username">
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control
                type="text"
                value={props.username}
                name="username"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-5" controlId="password">
              <Form.Label className="fw-bold">Password</Form.Label>
              <Form.Control
                type="password"
                value={props.password}
                name="password"
                onChange={handleChange}
              />
            </Form.Group>
            {message}
            <Form.Group className="d-flex gap-3 flex-column text-center">
              <Button variant="primary w-100" type="submit">
                Sign in
              </Button>
              <Form.Group className="d-flex justify-content-center gap-1">
                <Form.Label className="text-secondary">
                  Don't have an account? Klik
                </Form.Label>
                <Form.Label
                  onClick={goToSignUp}
                  className="text-secondary fw-bold"
                  style={{ cursor: "pointer" }}
                >
                  Here
                </Form.Label>
              </Form.Group>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SignIn;
