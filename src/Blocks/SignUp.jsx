import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Poveiders/AuthProvider";
import { Toaster, toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import countriesWithFlag from "../Api/country";
import axios from "axios";
import { parentURL } from "../Api/baseUrl";

const SignUp = () => {
  const { createUser, googleSignIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/login";
  const dash = location?.state?.from?.pathname || "/";
  const [showPass, setShowPass] = useState(false);

  const toggler = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  /* const onSubmit = (data) => {
    // console.log(data);
    // google create user with email and pass
    createUser(data.email, data.password)
      .then((res) => {
        toast.success(res.message + `redirecting to Login`);
      })
      .then((error) => {
        // if (error && error.message) {
        toast.error(`${error.message}`);
        reset();
        return;
        // }
      });
    // send user data to backend
    const userData = {
      fullName: data.fullName,
      email: data.email,
      userName: data.userName,
      country: data.country.split(" ")[0],
      phone: data.phone,
    };

    reset();
    axios
      .post(`${parentURL}/users`, userData)
      .then((res) => {
        console.log(res);
        toast.success("Account created, redirecting to login");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log(error.message);
      });
    // navigate(from, { replace: true });
  }; */

  const onSubmit = (data) => {
    // console.log(data);

    // google create user with email and pass
    createUser(data.email, data.password)
      .then((res) => {
        toast.success(res.message);

        // send user data to backend
        const userData = {
          fullName: data.fullName,
          email: data.email,
          userName: data.userName,
          country: data.country.split(" ")[0],
          phone: data.phone,
        };

        reset();

        return axios.post(`${parentURL}/users`, userData);
      })
      .then((res) => {
        // console.log(res);
        toast.success("Account created, redirecting to login");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        if (error && error.message) {
          toast.error(`${error.message}`);
          reset();
        }
      });
  };

  const password = watch("password");
  const confirmPass = watch("confirmPassword");
  const matchPassword = password === confirmPass;

  // signup using google
  const handleGoogleSignUp = () => {
    googleSignIn()
      .then((res) => {
        console.log(res.user);
        const data = res.user;
        const userData = {
          fullName: data.displayName,
          email: data.email,
          userName: data.username ? data.username : data.email,
          country: data.country ? data.country : "Not Provided",
          phone: data.phoneNumber ? data.phoneNumber : "Not Provided",
        };

        // console.log(userData);
        // post to users route in backend
        axios
          .post(`${parentURL}/users`, userData)
          .then((res) => console.log(res.status))
          .catch((error) => console.log(error.message));

        toast.success("Account created, redirecting to dashboard");
        navigate(dash, { replace: true });
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      });
  };

  return (
    <div className="h-screen pb-4 font-roboto">
      <Toaster position="top-center" richColors />
      <div className="grid lg:grid-cols-2 grid-cols-1 items-center lg:h-screen md:h-screen">
        {/* first grid column */}
        <div className="bg-[#F8F8FF] py-10 px-20 lg:h-screen">
          <h1 className="text-2xl font-bold text-slate-700">
            Register / Sign Up
          </h1>
          <p className="text-xs pb-4 pt-1">
            Create your account first, provide all the valid info. <br />
            All the fields are required
          </p>

          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
                {...register("fullName", { required: true })}
              />
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full"
                {...register("userName", { required: true })}
              />
            </div>
            <div className="flex flex-col gap-3 mt-2">
              {/* <input
                type="text"
                placeholder="Country"
                className="input input-bordered w-full"
                {...register("country", { required: true })}
              /> */}

              <select
                className="select select-bordered w-full"
                {...register("country", { required: true })}
              >
                <option className="text-lg text-slate-500" disabled selected>
                  Select your country
                </option>
                {countriesWithFlag.map((country, i) => (
                  <option key={i}>{country}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Phone Number"
                className="input input-bordered w-full"
                {...register("phone", { required: true })}
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                {...register("email", { required: true })}
              />
            </div>
            {/* password */}
            <div className="mt-2 flex flex-col gap-y-2">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="input input-bordered w-full"
                  {...register("password", {
                    required: true,
                    minLength: 6,
                    pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                  })}
                />
                <button
                  onClick={toggler}
                  className="absolute right-0 top-2 text-md px-2 pt-2 pb-1 rounded-tr-md rounded-br-md"
                >
                  {showPass ? "🕶️" : "👀"}
                </button>
              </div>

              {/* validations for ui */}
              {errors.password && errors.password?.type === "minLength" && (
                <p className="text-xs font-bold pt-1 text-red-400 mt-1">
                  Password must be atleast 6 characters
                </p>
              )}
              {errors.password && errors.password?.type === "required" && (
                <p className="text-xs font-bold pt-1 text-red-400 mt-1">
                  Password is required
                </p>
              )}
              {errors.password && errors.password?.type === "pattern" && (
                <p className="text-xs font-bold pt-1 text-red-400 mt-1">
                  uppercase, number and special character required
                </p>
              )}
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="input input-bordered w-full "
                  {...register("confirmPassword", {
                    required: true,
                  })}
                />
                <button
                  onClick={toggler}
                  className="absolute right-0 top-2 text-md px-2 pt-2 pb-1 rounded-tr-md rounded-br-md"
                >
                  {showPass ? "🕶️" : "👀"}
                </button>
              </div>
              {matchPassword ? (
                <p className="text-xs font-bold text-emerald-300 pt-1">
                  Password match
                </p>
              ) : (
                <p className="text-xs font-bold text-red-400 pt-1">
                  Password don't match
                </p>
              )}
            </div>
            {matchPassword ? (
              <button
                type="submit"
                className="border-2 border-slate-500 rounded-md px-4 pt-2 pb-1 mt-2 bg-indigo-200 hover:bg-indigo-300 font-bold text-sm w-full  btn text-[#111110]"
              >
                Sign Up
              </button>
            ) : (
              <button className="btn-disabled border-2 border-slate-500 rounded-md px-4 py-2 mt-2 bg-indigo-200 hover:bg-indigo-300 font-bold text-sm w-full  btn text-[#111110]">
                Sign Up
              </button>
            )}
          </form>
          <div className="divider text-sm font-bold text-slate-500 mt-5">
            or
          </div>
          <div className="my-1">
            <h1 className="text-xs text-center">
              Already have an account?{" "}
              <Link className="text-indigo-500 hover:font-bold" to={"/"}>
                Log In
              </Link>{" "}
              instead
            </h1>
          </div>
          {/* sign in with google */}
          <button
            onClick={handleGoogleSignUp}
            className="px-4 py-2 rounded-3xl bg-white text-sm font-semibold mx-auto flex justify-center gap-2 my-4 border border-slate-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 btn"
          >
            Sign Up with Google
            <img
              className="h-4 inline-block"
              src="/google-icon-tiny.png"
              alt="google icon"
            />
          </button>
        </div>

        {/* second grid column */}
        <div className="py-20 px-10">
          <div className="flex justify-center">
            <img
              className="h-72"
              src="/Tech-Life-Schedule-Meeting-tiny.png"
              alt="Tech life"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-700 pt-4 text-center">
            First, Efficient and Productive
          </h1>
          <p className="text-xs text-center px-10 pt-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis alias
            esse assumenda natus neque consequatur!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
