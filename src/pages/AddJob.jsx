import { useState } from "react";
import "./AddJob.css";
import useAuth from "../hooks/useAuth";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function AddJob() {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    location: "",
    jobType: "",
    status: "Applied",
    appliedDate: "",
    jobUrl: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.jobType) {
      newErrors.jobType = "Job type is required";
    }
    if (!formData.appliedDate) {
      newErrors.appliedDate = "Date is required";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      company_name: formData.companyName,
      job_title: formData.jobTitle,
      location: formData.location,
      job_type: formData.jobType,
      status: formData.status,
      applied_date: formData.appliedDate,
      job_url: formData.jobUrl || null,
      notes: formData.notes || null,
    });

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("Job added successfully");

    setFormData({
      companyName: "",
      jobTitle: "",
      location: "",
      jobType: "",
      status: "Applied",
      appliedDate: "",
      jobUrl: "",
      notes: "",
    });

    setTimeout(()=>navigate("/jobs"),2000)
  }

  return (
    <main className="add-job-page">
      <h1>Add Job Application</h1>
      <p>Track a new job opportunity</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            placeholder="Enter company name"
            onChange={handleChange}
          />
          {errors.companyName && <p className="error">{errors.companyName}</p>}
        </div>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            placeholder="Enter job title"
            onChange={handleChange}
          />
          {errors.jobTitle && <p className="error">{errors.jobTitle}</p>}
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            placeholder="Enter location"
            onChange={handleChange}
          />
          {errors.location && <p className="error">{errors.location}</p>}
        </div>
        <div className="form-group">
          <label>Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option value="">Select job type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
          {errors.jobType && <p className="error">{errors.jobType}</p>}
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="form-group">
          <label>Applied Date</label>
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
          />
          {errors.appliedDate && <p className="error">{errors.appliedDate}</p>}
        </div>
        <div className="form-group">
          <label>Job URL</label>
          <input
            type="url"
            name="jobUrl"
            value={formData.jobUrl}
            placeholder="Enter job posting URL"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            placeholder="Add additional notes"
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </main>
  );
}
