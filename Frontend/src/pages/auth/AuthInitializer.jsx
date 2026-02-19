import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { clearAuth } from "../../features/auth/authSlice";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      dispatch(clearAuth());
      return;
    }

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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(clearAuth());
    }
  }, [dispatch]);

  return children;
}

export default AuthInitializer;
