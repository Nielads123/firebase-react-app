// src/components/Login.jsx
import {
  Form,
  Button,
  Card,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./ToastStyle.css"; // include the styles

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [msgToast, setMsgToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function showResult(message, variant) {
    setMsgToast({ show: true, message, variant });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      await login(emailRef.current.value, passwordRef.current.value);
      showResult("Login successful!", "success");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setError("Login failed.");
      showResult("Invalid email or password", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Corner toast with animated loading bar below */}
      <ToastContainer position="top-end" className="p-3">
        <div className="corner-wrapper">
          <Toast
            bg={msgToast.variant}
            show={msgToast.show}
            delay={2000}
            autohide
            onClose={() => setMsgToast({ ...msgToast, show: false })}
            style={{ width: "100%" }}
          >
            <Toast.Body className="text-white">{msgToast.message}</Toast.Body>
          </Toast>

          {msgToast.show && (
            <div
              className={`corner-bar ${
                msgToast.variant === "success" ? "bar-success" : "bar-danger"
              }`}
            />
          )}
        </div>
      </ToastContainer>

      {/* Login form */}
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>

            <Form.Group id="password" className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-3" type="submit">
                    Log In
            </Button>
          </Form>

          <div className="w-100 text-center mt-3">
            <Link to="/forget-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  );
}

export default Login;
