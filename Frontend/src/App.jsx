import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setAuth } from "./features/auth/authSlice";
import { BrowserRouter } from "react-router-dom";
import Navigation from "./routes/Navigation";
import NavBar from "./pages/NavBar";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      dispatch(
        setAuth({
          accessToken: token,
          userId: decoded.userId,
          role: decoded.role,
          email: decoded.email,
        })
      );
    } catch {
      // invalid / expired token
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(markAuthChecked());
    }
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <NavBar />
      <Navigation />
    </BrowserRouter>
  );
}

export default App;
