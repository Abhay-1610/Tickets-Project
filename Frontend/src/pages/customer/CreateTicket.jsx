import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTicketMutation } from "../../features/tickets/ticketsApi";

// Formik + Yup
import { Formik } from "formik";
import * as Yup from "yup";

// Toast
import { toast } from "react-toastify";
import { uploadImage } from "../../cloudinary/uploadImage";

function CreateTicket() {
  const navigate = useNavigate();
  const [createTicket] = useCreateTicketMutation();

  const [preview, setPreview] = useState(null); // image preview
  const [uploading, setUploading] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleCreate = async (values, { setSubmitting }) => {
    try {
      setUploading(true);

      let screenshotUrl = null;

if (values.screenshotFile) {
  screenshotUrl = await uploadImage(values.screenshotFile);
}


      await createTicket({
        title: values.title,
        description: values.description,
        initialScreenshotUrl: screenshotUrl,
      }).unwrap();

      toast.success("Ticket created successfully");
      navigate("/customer/dashboard");
    } catch {
      toast.error("Failed to create ticket");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      <div className="pt-4 pb-3">
        <h2 className="fw-bold text-dark">Create Ticket</h2>
        <p className="text-muted">
          Describe your issue and attach a screenshot if needed
        </p>
      </div>

      <div className="row">
        {/* FORM */}
        <div className="col-md-8">
          <div
            className="card shadow-sm"
            style={{ borderRadius: "12px", border: "1px solid #ddd" }}
          >
            <div className="card-body">
              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  screenshotFile: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleCreate}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    {/* TITLE */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={values.title}
                        onChange={handleChange}
                      />
                      {touched.title && errors.title && (
                        <small className="text-danger">{errors.title}</small>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        name="description"
                        rows="4"
                        className="form-control"
                        value={values.description}
                        onChange={handleChange}
                      />
                      {touched.description && errors.description && (
                        <small className="text-danger">
                          {errors.description}
                        </small>
                      )}
                    </div>

                    {/* FILE UPLOAD */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Screenshot (optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue("screenshotFile", file);
                          if (file) {
                            setPreview(URL.createObjectURL(file)); // preview
                          }
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark px-4"
                      disabled={isSubmitting || uploading}
                    >
                      {uploading ? "Uploading..." : "Create Ticket"}
                    </button>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="col-md-4">
          <div
            className="card shadow-sm"
            style={{ borderRadius: "12px", border: "1px solid #ddd" }}
          >
            <div className="card-body">
              <h6 className="fw-semibold text-dark mb-3">
                Screenshot Preview
              </h6>

              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ border: "1px solid #ddd" }}
                />
              ) : (
                <span className="badge bg-secondary">
                  No screenshot selected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
