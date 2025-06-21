import { Container } from "react-bootstrap";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import ForgetPassword from "./ForgetPassword";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"
import Updateprofile from "./Updateprofile";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Routes>
                <Route path="/" element={<Signup />} />                {/* 👈 Make Signup the default */}
  <Route path="/dashboard" element={<Dashboard />} />    {/* 👈 Use /dashboard for protected page */}
  <Route path="/update-profile" element={<Updateprofile />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/forget-password" element={<ForgetPassword />} />
            </Routes>
          </div>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;
