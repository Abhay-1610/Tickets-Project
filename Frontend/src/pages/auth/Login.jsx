import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setAuth } from "../../features/auth/authSlice";
import { useLoginMutation } from "../../features/auth/authApi";
import { Link } from "react-router-dom";


// Formik + Yup
import { Formik } from "formik";
import * as Yup from "yup";

// Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query login mutation
  const [login] = useLoginMutation();

  /* =============================
     FORM VALIDATION
  ============================== */
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  /* =============================
     LOGIN HANDLER (SAME FLOW AS OLD)
  ============================== */
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      // RTK Query call (replaces axios)
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap(); // makes try/catch work like axios

      const { accessToken, refreshToken } = result;

      // store tokens (persist login)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // decode JWT (same as before)
      const decoded = jwtDecode(accessToken);

      const role = decoded.role;
      const userId = decoded.userId;
      const email = decoded.email;

      // update redux auth state
      dispatch(
        setAuth({
          accessToken,
          userId,
          role,
          email,
        })
      );

      toast.success("Login successful");

      // role-based navigation
      if (role === "Admin") {
        navigate("/admin/dashboard");
      } else if (role === "Agent") {
        navigate("/agent/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              minHeight: "calc(100vh - 56px)",
              backgroundColor: "#dcdcdc",
              padding: "40px",
            }}
          >
            <div
              className="d-flex rounded shadow-lg"
              style={{
                maxWidth: "900px",
                width: "100%",
                overflow: "hidden",
                backgroundColor: "#FBF7F2",
              }}
            >
              {/* LEFT INFO */}
              <div
                className="d-none d-md-flex align-items-center justify-content-center"
                style={{
                  width: "40%",
                  backgroundColor: "#F3EDE4",
                  padding: "30px",
                }}
              >
                <div className="text-center">
                  <h2 className="fw-semibold text-dark">Welcome</h2>
                  <img
                    src="https://picsum.photos/400/300"
                    alt="welcome"
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "220px" }}
                  />
                  <p className="fst-italic text-muted">
                    Secure access to your support portal
                  </p>
                </div>
              </div>

              {/* RIGHT LOGIN */}
              <div className="p-5" style={{ width: "60%" }}>
                <h4 className="fw-bold text-center mb-2 text-dark">
                  Ticket Support Portal
                </h4>

                <p className="text-center text-muted mb-4">
                  Sign in to continue
                </p>

                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label text-dark">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={values.email}
                    onChange={handleChange}
                  />
                  <div style={{ minHeight: "24px" }}>
                    {touched.email && errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="mb-4">
                  <label className="form-label text-dark">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={values.password}
                    onChange={handleChange}
                  />
                  <div style={{ minHeight: "24px" }}>
                    {touched.password && errors.password && (
                      <small className="text-danger">{errors.password}</small>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 mb-3"
                  disabled={isSubmitting}
                >
                  Sign In
                </button>

                <div className="text-center">
  <small className="text-muted">
    Don’t have an account? <Link to="/register">Register</Link>
  </small>
</div>


                <div className="text-center">
                  <span className="text-muted small">
                    Authorized personnel only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default Login;
