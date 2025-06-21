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
import "./ToastStyle.css"; // reuse the same style file

function Signup() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "danger",
  });

  // Helper
  function showToast(message, variant = "danger") {
    setToast({ show: true, message, variant });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      await signup(emailRef.current.value, passwordRef.current.value);

      showToast("Account created! Please log in.", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        showToast("An account with this e-mail already exists. Please log in.", "danger");
      } else {
        setError("Failed to sign up: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Toast + animated bar */}
      <ToastContainer position="top-end" className="p-3">
        <div className="corner-wrapper">
          <Toast
            bg={toast.variant}
            onClose={() => setToast({ ...toast, show: false })}
            show={toast.show}
            delay={3000}
            autohide
            style={{ width: "100%" }}
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>

          {toast.show && (
            <div
              className={`corner-bar ${
                toast.variant === "success" ? "bar-success" : "bar-danger"
              }`}
            />
          )}
        </div>
      </ToastContainer>

      {/* Form card */}
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>

            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>

            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Sign Up
            </Button>
          </Form>

          <div className="w-100 text-center mt-3">
            <Link to="/forget-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
}

export default Signup;
