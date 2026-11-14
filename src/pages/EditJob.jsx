import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import "./EditJob.css";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);

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
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }
      setFormData({
        companyName: data.company_name,
        jobTitle: data.job_title,
        location: data.location,
        jobType: data.job_type,
        status: data.status,
        appliedDate: data.applied_date,
        jobUrl: data.job_url || "",
        notes: data.notes || "",
      });
      setLoading(false);
    }

    if (user) {
      fetchData();
    }
  }, [user, id]);

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
  }

  function validateForm() {
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
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    setUpdating(true);
    const { error } = await supabase
      .from("job_applications")
      .update({
        company_name: formData.companyName,
        job_title: formData.jobTitle,
        location: formData.location,
        job_type: formData.jobType,
        status: formData.status,
        applied_date: formData.appliedDate,
        job_url: formData.jobUrl || null,
        notes: formData.notes || null,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    setUpdating(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setErrorMessage("");
    setSuccessMessage("Job updated successfully!");
    setTimeout(() => {
      navigate("/jobs");
    }, 2000);
  }

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (errorMessage) {
    return <p className="error">{errorMessage}</p>;
  }

  return (
    <main className="edit-job-page">
      <h1>Edit Job Application</h1>
      <p>Update your job application</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
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
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Update Job"}
        </button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
    </main>
  );
}
