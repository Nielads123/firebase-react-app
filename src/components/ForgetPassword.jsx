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
import { Link } from "react-router-dom";
import "./ToastStyle.css";

function ForgetPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  // Helper to show the toast
  function showToast(message, variant = "success") {
    setToast({ show: true, message, variant });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);

      showToast("Check your inbox for instructions.", "success");
    } catch (err) {
      console.error("Reset error:", err);
      setError("Failed to reset: " + err.message);
      showToast("Reset failed. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Top‑right toast and progress bar */}
      <ToastContainer position="top-end" className="p-3">
        <div className="corner-wrapper">
          <Toast
            bg={toast.variant}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
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

      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Reset Password
            </Button>
          </Form>

          <div className="w-100 text-center mt-3">
            <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  );
}

export default ForgetPassword;
