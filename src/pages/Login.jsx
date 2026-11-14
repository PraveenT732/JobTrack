import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";
import useAuth from "../hooks/useAuth";

export default function Login() {

  const {user, session, loading} = useAuth();
  console.log(user);
  console.log(session);
  console.log(loading);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) {
      return;
    }
    const {  error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      setErrors((prev) => ({ ...prev, email: error.message }));
      return;
    }
    setSuccessMessage("Login Successful");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          Job<span>Track</span>
        </h1>
        <p>Welcome back! Login to your account.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit">Login</button>
        </form>
        {successMessage && <p>{successMessage}</p>}
        <p className="register-link">
          Don't have a account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
