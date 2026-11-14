import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import "./Dashboard.css";
import supabase from "../utils/supabase";

export default function Dashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retry, setRetry] = useState(0);

  const userName = user?.user_metadata?.name || user.email || "User";

  useEffect(() => {
    async function fetchJobs() {
      setErrorMessage("");
      setLoading(true);
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setLoading(false);
        setErrorMessage(error.message);
        return;
      }
      setJobs(data);
      setLoading(false);
    }
    if (user) {
      fetchJobs();
    }
  }, [user, retry]);

  const totalApplications = jobs.length;
  const appliedJobs = jobs.filter((job) => job.status === "Applied").length;
  const interviewCount = jobs.filter(
    (job) => job.status === "Interview",
  ).length;
  const offeredJobs = jobs.filter((job) => job.status === "Offered").length;
  const rejectedJobs = jobs.filter((job) => job.status === "Rejected").length;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <p>{errorMessage}</p>
        <button onClick={() => setRetry((prev) => prev + 1)}>Retry</button>
      </div>
    );
  }

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {userName}!</h1>
        <p>Your job application overview</p>
      </div>
      <section className="stats-container">
        <div className="stats-card">
          <h3>Total Applications</h3>
          <p>{totalApplications}</p>
        </div>
        <div className="stats-card">
          <h3>Applied</h3>
          <p>{appliedJobs}</p>
        </div>
        <div className="stats-card">
          <h3>Interview</h3>
          <p>{interviewCount}</p>
        </div>
        <div className="stats-card">
          <h3>Offered</h3>
          <p>{offeredJobs}</p>
        </div>
        <div className="stats-card">
          <h3>Rejected</h3>
          <p>{rejectedJobs}</p>
        </div>
      </section>
      <section className="recent-applications">
        <h2>Recent Applications</h2>
        {jobs.length === 0 ? (
          <p>No job application yet</p>
        ) : (
          <div className="recent-jobs">
            {jobs.slice(0, 5).map((job) => (
              <div className="recent-job-card" key={job.id}>
                <h3>{job.job_title}</h3>
                <p>{job.company_name}</p>
                <p>Status: {job.status}</p>
                <p>Applied Date: {job.applied_date}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
