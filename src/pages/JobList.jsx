import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import supabase from "../utils/supabase";
import { Link } from "react-router-dom";
import "./JobList.css";

export default function JobList() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setErrorMessage("");
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", user.id) //extra filteration
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setJobs(data);
      setLoading(false);
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?",
    );
    if (!confirmDelete) {
      return;
    }
    setErrorMessage("");
    setDeletingId(id);
    const { error } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    setDeletingId(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  }

  const filteredJobs = jobs.filter((job) => {
    const matchedSearch =
      job.company_name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      job.job_title.toLowerCase().includes(searchTerm.trim().toLowerCase());

    const matchStatus = statusFilter === "All" || job.status === statusFilter;

    return matchedSearch && matchStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.applied_date) - new Date(a.applied_date);
    }
    return new Date(a.applied_date) - new Date(b.applied_date);
  });

  return (
    <main className="job-list-page">
      <h1>My Job Applications</h1>
      <div className="job-controls">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search by job title or company"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offered">Offered</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
      {loading && <p>Loading applications</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {!loading && !errorMessage && jobs.length === 0 && (
        <p>
          No applications found! <Link to="/add-job">Click here</Link> to add
          jobs
        </p>
      )}
      {!loading && !errorMessage && filteredJobs.length === 0 && (
        <p>No matching applications found</p>
      )}
      {!loading && !errorMessage && filteredJobs.length > 0 && (
        <section className="jobs-container">
          {sortedJobs.map((job) => (
            <article key={job.id} className="job-card">
              <h2>{job.job_title}</h2>
              <p>{job.company_name}</p>
              <p>{job.location}</p>
              <p>{job.job_type}</p>
              <p>Status: {job.status}</p>
              <p>Applied Date: {job.applied_date}</p>
              <Link to={`/edit-job/${job.id}`} className="edit-btn">
                Edit
              </Link>
              <button
                disabled={deletingId !== null}
                onClick={() => handleDelete(job.id)}
              >
                {deletingId === job.id ? "Deleting..." : "Delete"}
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
