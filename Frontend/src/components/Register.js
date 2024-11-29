import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';  // Import Axios for HTTP requests
import './register.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/register', values);  // Connect to backend
      alert(response.data.message);  // Show success message
      setLoading(false);
      
      if (response.status === 201) {
        // Successful registration: Redirect to login page or homepage
        navigate("/");
      } 
    } catch (error) {
      setLoading(false);
      // Handle errors, display the appropriate error message
      const errorMessage = error.response?.data?.message || "An error occurred";
      alert(errorMessage);
    }
  };

  return (
    <div className="container">
      <div className="heading-container">
        <h1 className="text-center">Welcome to Expense Management System</h1>
      </div>
      <div className="form-container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h2 className="text-center">Registration</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mt-3">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full name"
                  value={values.name}
                  onChange={handleChange}
                  required  // Make fields required for validation
                />
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  required
                  minLength="6"  // You can enforce a minimum length for the password
                />
              </div>
              <div className="text-center mt-4">
                <Link to="/forgotPassword" className="d-block">Forgot Password?</Link>
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Signup"}
                </button>
                <p className="mt-3">
                  Already have an account? <Link to="/">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
