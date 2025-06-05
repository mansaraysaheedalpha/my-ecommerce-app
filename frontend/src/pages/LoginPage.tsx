// Your LoginPage.tsx
import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../store/api/apiSlice";
import { setCredentials } from "../store/features/auth/authSlice";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{
    // This state is for inline form errors
    [key: string]: string[] | null; // Changed to null for individual field, or string for general
  } | null>(null); // Or string for a general error message

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation(); // Removed isError, we'll get error from .unwrap()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Added HTMLFormElement for better type on e.currentTarget
    e.preventDefault();
    setFormErrors(null); // Clear previous form errors

    try {
      const payload = await loginUser({ email, password }).unwrap(); // This is the correct way to use it

      dispatch(
        setCredentials({
          // This structure should match what setCredentials expects
          user: payload.user,
          accessToken: payload.accessToken,
        })
      );
      toast.success(payload.message || "Logged in successfully");
      navigate("/"); // Or to a dashboard page
    } catch (err: any) {
      console.error("Failed to login:", err);
      const defaultMessage = "Login failed. Please try again.";

      // err.data is where RTK Query puts the server's error response body
      const apiErrorData = err.data;

      if (apiErrorData && Array.isArray(apiErrorData.errors)) {
        // We have structured Zod-like errors from the backend validation middleware
        const newFormErrors: { [key: string]: string[] } = {};
        apiErrorData.errors.forEach(
          (validationError: { path: string; message: string }) => {
            const field = validationError.path.replace("body.", ""); // Handles "body.email" or just "email"
            if (!newFormErrors[field]) {
              newFormErrors[field] = [];
            }
            newFormErrors[field].push(validationError.message);
          }
        );
        setFormErrors(newFormErrors);
        toast.error(apiErrorData.message || "Please check your input.");
      } else if (apiErrorData && apiErrorData.message) {
        // For other errors that have a 'message' property (like "Invalid credentials")
        toast.error(apiErrorData.message);
        // Optionally set a general form error to display above/below the form
        // setFormErrors({ general: [apiErrorData.message] });
      } else {
        // Fallback for unexpected error structures
        toast.error(defaultMessage);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full space-y-6"
      >
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Login to Your Account
        </h1>{" "}
        {/* Added heading */}
        {/* You can add a place to display general form errors here if needed */}
        {/* {formErrors?.general && (
            <p className="text-sm text-red-600 text-center p-2 bg-red-50 rounded-md">
                {formErrors.general.join(', ')}
            </p>
        )} */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          {/* Display inline error for email */}
          {formErrors?.email && (
            <p className="text-xs text-red-600 mt-1">
              {formErrors.email.join(", ")}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password" // Added id for label association
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <svg
                  /* Eye-Slash Icon SVG */ className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.574M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Display inline error for password */}
          {formErrors?.password && (
            <p className="text-xs text-red-600 mt-1">
              {formErrors.password.join(", ")}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles, increased padding
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}{" "}
          {/* Consistent loading text */}
        </button>
        <p className="text-sm text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
