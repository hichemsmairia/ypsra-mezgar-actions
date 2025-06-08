// src/pages/AuthPages/SignIn.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "./AuthPageLayout";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";

import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthMessages } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";

export default function SignIn() {
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { error, message, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthMessages());
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthMessages());
    }

    if (user) {
      if (user.roles[0] == "USER") {
        setTimeout(() => {
          navigate("/tours_list_user");
        }, 2500);
      } else if (user.roles[0] == "ADMIN") {
        setTimeout(() => {
          navigate("/tours_list_admin");
        }, 2500);
      } else if (user.roles[0] == "owner") {
        setTimeout(() => {
          navigate("/my_tours");
        }, 2500);
      }
    }
  }, [error, message, user, dispatch]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginUser(credentials));
  };

  return (
    <>
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In Page
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your username and password
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Username <span className="text-error-500">*</span>
                    </Label>
                    <input
                      type="text"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="enter your username"
                      required
                      id="email_input"
                    />
                  </div>
                  <div>
                    <Label>
                      Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="enter your password"
                        required
                        id="password_input"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Button type="submit" className="w-full" size="sm">
                      Sign in
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
