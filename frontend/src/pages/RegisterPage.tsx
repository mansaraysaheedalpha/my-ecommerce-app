import React, { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterUserMutation } from "../store/api/apiSlice";
import { setCredentials } from "../store/features/auth/authSlice";
import toast from "react-hot-toast";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{
    [key: string]: string[] | string;
  } | null>(null);

  //----RTK Query Mutation for Registeration------
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  //----Hooks for navigation and Dispatching redux actions----
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors(null);

    try {
      // .unwrap() will make it return a Promise that either resolves with the action.payload or rejects with action.error

      const payload = await registerUser({ name, email, password }).unwrap();

      // If registration is successful (no error thrown by unwrap):
      dispatch(
        setCredentials({
          user: payload.user,
          accessToken: payload.accessToken,
        })
      );
      toast.success(payload.message || "Registeration successfully! Welcome!");
      navigate("/");
    } catch (err: any) {
      // err comes from the .unwrap() if the mutation was rejected
      console.error("Failed to register: ", err);
      const apiError = err.data || {
        message: "Registeration failed. Please try again",
      };

      if (apiError) {
        const newFormErrors: { [key: string]: string[] } = {};
        if (Array.isArray(apiError)) {
          apiError.forEach(
            (validationError: { path: string; message: string }) => {
              const field = validationError.path.replace("body.", "");
              if (!newFormErrors[field]) {
                newFormErrors[field] = [];
              }
              newFormErrors[field].push(validationError.message);
            }
          );
          setFormErrors(newFormErrors);
          toast.error("Please check your input");
        } else {
          // For generic errors
          toast.error(apiError.message || "An unexpected error occurred.");
        }
      }
    }
  };
  return (
    // 1. Fixed typo: justify-center bg-slate-100
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* 1. Fixed typo: max-w-md. Kept space-y-6 here for spacing between form elements. */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full space-y-6"
      >
        {/* 2. Styled the heading */}
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Create Your Account
        </h1>

        {/* Display general form error from Zod if not field-specific */}
        {formErrors && typeof formErrors === "string" && (
          <p className="text-sm text-red-600 text-center">{formErrors}</p>
        )}
        {formErrors &&
          (formErrors as any).message && ( // If backend sends a top-level error message
            <p className="text-sm text-red-600 text-center">
              {(formErrors as any).message}
            </p>
          )}

        {/* Name Field Group */}
        <div>
          {" "}
          {/* Removed mb-4 and space-y-6 from here. Form's space-y-6 will handle it. */}
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1" // Added mb-1 for space below label
          >
            Name
          </label>
          {/* 3. Styled the input */}
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required // It's good practice to add HTML5 required attribute
          />
          {formErrors?.name && (
            <p className="text-xs text-red-600 mt-1">
              {(formErrors.name as string[]).join(", ")}
            </p>
          )}
        </div>

        {/* Email Field Group */}
        <div>
          {" "}
          {/* Removed mb-4 and space-y-6 */}
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1" // Added mb-1
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
          {formErrors?.email && (
            <p className="text-xs text-red-600 mt-1">
              {(formErrors.email as string[]).join(", ")}
            </p>
          )}
        </div>

        {/* Password Field Group */}
        <div>
          {" "}
          {/* Removed mb-4 and space-y-6 */}
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1" // Added mb-1
          >
            Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            {/* Show this when showPassword is true */}
            {/* Show this when showPassword is true */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-slate-700"
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
          {formErrors?.password && (
            <p className="text-xs text-red-600 mt-1">
              {(formErrors.password as string[]).join(", ")}
            </p>
          )}
        </div>

        {/* Button styling was already excellent! */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        <p className="text-sm text-center text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
