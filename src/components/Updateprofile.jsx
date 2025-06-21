// src/components/UpdateProfile.jsx
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
import "./ToastStyle.css";

function UpdateProfile() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const currentPassRef = useRef();

  const {
    currentUser,
    updateEmail,
    updatePassword,
    reAuthenticate, // must be added to your AuthContext
  } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  function showToast(msg, variant = "success") {
    setToast({ show: true, message: msg, variant });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);

    try {
      await reAuthenticate(currentPassRef.current.value);

      const tasks = [];
      if (emailRef.current.value !== currentUser.email) {
        tasks.push(updateEmail(emailRef.current.value));
      }
      if (passwordRef.current.value) {
        tasks.push(updatePassword(passwordRef.current.value));
      }

      await Promise.all(tasks);
      showToast("Profile updated successfully!", "success");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.code === "auth/requires-recent-login"
          ? "Please log out and log in again, then retry."
          : "Failed to update account"
      );
      showToast("Update failed. Try again.", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer position="top-end" className="p-3">
        <div className="corner-wrapper">
          <Toast
            bg={toast.variant}
            show={toast.show}
            delay={2500}
            autohide
            onClose={() => setToast({ ...toast, show: false })}
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
          {toast.show && (
            <div className={`corner-bar ${toast.variant === "success" ? "bar-success" : "bar-danger"}`} />
          )}
        </div>
      </ToastContainer>

      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                defaultValue={currentUser.email}
                required
              />
            </Form.Group>

            <Form.Group id="current-password" className="mt-2">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                ref={currentPassRef}
                required
              />
            </Form.Group>

            <Form.Group id="password" className="mt-2">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>

            <Form.Group id="password-confirm" className="mt-2">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Update
            </Button>
          </Form>

          <div className="w-100 text-center mt-3">
            <Link to="/forget-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  );
}

export default UpdateProfile;
