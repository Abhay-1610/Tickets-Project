import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth/authApi";

import { Formik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      await register(values).unwrap();

      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleRegister}
    >
      {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
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
              {/* LEFT */}
              <div
                className="d-none d-md-flex align-items-center justify-content-center"
                style={{
                  width: "40%",
                  backgroundColor: "#F3EDE4",
                  padding: "30px",
                }}
              >
                <div className="text-center">
                  <h2 className="fw-semibold text-dark">Join Us</h2>
                  <img
                    src="https://picsum.photos/400/300"
                    alt="register"
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "220px" }}
                  />
                  <p className="fst-italic text-muted">
                    Create your support account
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="p-5" style={{ width: "60%" }}>
                <h4 className="fw-bold text-center mb-2 text-dark">
                  Create Account
                </h4>

                <p className="text-center text-muted mb-4">
                  Register to raise support tickets
                </p>

                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
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
                  <label className="form-label">Password</label>
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
                  Register
                </button>

                <div className="text-center">
                  <small className="text-muted">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default Register;
