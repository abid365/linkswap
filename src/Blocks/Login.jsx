import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Poveiders/AuthProvider";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { parentURL } from "../Api/baseUrl";

const Login = () => {
  // authcontext and create user
  const { signIn, googleSignIn, user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = "/";
  //see or hide pass
  const [showPass, setShowPass] = useState(false);
  const [dbloginData, setDbLoginData] = useState();

  const toggler = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
  };

  // form data and hanlde submit
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    // console.log(data);

    // todo: check if the user has pass and mail in the backend user db , if has then initial login with those credentials and setUser to that user. else move to signIn google method to to do login

    // *from gpt
    const fetchUser = () => {
      return axios
        .get(`${parentURL}/users/login/${data.email}`)
        .then((response) => {
          // console.log(response.data);
          toast.success(response.status);
          setUser(response.data);

          if (response.data) {
            toast.success(`Logged in successfully`);
            navigate(from, { replace: true });
            return response.status;
          }
        })
        .catch((error) => {
          toast.error(error.message);
          throw error; // Rethrow the error to be caught outside
        });
    };

    // Usage
    fetchUser()
      .then((status) => {
        console.log(status);

        if (status === undefined || status === null) {
          // The fetchUser function did not return a valid status
          // *google sign-in method
          signIn(data.email, data.pass)
            .then((res) => {
              const user = res.user;

              if (user) {
                toast.success(`Logged in successfully`);
                navigate(from, { replace: true });
              }
            })
            .catch((error) => {
              toast.error(error.message);
            });
        }
      })

      .catch((error) => {
        // Handle errors from fetchUser or signIn
        console.error(error);
      });
  };

  // signin with google
  const handleGoogleSignIn = () => {
    // check if user exists

    googleSignIn()
      .then((res) => {
        const user = res.user;
        if (user) {
          const data = res.user;
          const userData = {
            fullName: data.displayName,
            email: data.email,
            userName: data.username ? data.username : data.email,
            country: data.country ? data.country : "Not Provided",
            phone: data.phoneNumber ? data.phoneNumber : "Not Provided",
          };

          // check if user exists

          // post to users route in backend
          axios
            .post(`${parentURL}/users`, userData)
            .then((res) => console.log(res.data.message))
            .catch((error) => console.log(error.message));

          toast.success("Successfully Logged in");
          navigate(from, { replace: true });
        }
        // return <Navigate to={"/dashboard"} replace={true} />;
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      });
  };

  return (
    <div className="lg:h-screen md:h-screen bg-[#fffafa] font-roboto">
      <Toaster position="top-center" richColors />
      {/* hero section and user authentication */}
      <div className="grid lg:grid-cols-2 grid-cols-1 items-center">
        {/* left portion: graphics */}
        <div className="py-20 px-10 lg:order-first order-last">
          <div className="flex justify-center">
            <img className="h-72" src="/Tech Life -tiny.png" alt="Tech life" />
          </div>
          <h1 className="text-2xl font-bold text-slate-700 pt-4 text-center">
            First, Efficient and Productive
          </h1>
          <p className="text-xs text-center px-10 pt-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis alias
            esse assumenda natus neque consequatur!
          </p>
        </div>

        {/* right portion: login form and others */}
        <div className="bg-[#f0fff0] px-10 pt-24 lg:order-last order-first lg:h-screen">
          <div className="flex gap-x-2 items-end justify-center">
            <img
              className="h-10 mb-3 order-2"
              src="/waving-hand-tiny.png"
              alt="waving hand"
            />
            <h1 className="text-4xl font-bold text-slate-700 order-1">
              Welcome
            </h1>
          </div>
          <p className="text-xs py-1 font-semibold text-center">
            Please sign in to your account
          </p>

          {/* login form / form data */}
          <div className="py-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3 px-10">
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  {...register("email", { required: true })}
                />
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    className="input input-bordered w-full"
                    {...register("pass", { required: true })}
                  />
                  <button
                    onClick={toggler}
                    className="absolute right-0 top-2 text-md px-2 pt-2 pb-1 rounded-tr-md rounded-br-md"
                  >
                    {showPass ? "🕶️" : "👀"}
                  </button>
                </div>
              </div>
              <div className="px-10 mt-5 flex justify-between">
                <p className="text-xs font-semibold">
                  Don't have an account?{" "}
                  <Link
                    className="text-indigo-500 hover:font-bold hover:underline"
                    to={"/signup"}
                  >
                    Sign Up
                  </Link>{" "}
                  now!
                </p>

                <Link
                  to={"/resetpass"}
                  className="text-xs text-purple-600 hover:font-bold"
                >
                  Forgot Password
                </Link>
              </div>

              <div className="px-10">
                <button
                  className="w-full pt-2 pb-1 px-7 mt-5 border border-slate-500 bg-[#f6ee86] hover:bg-yellow-300 rounded-md text-sm font-bold text-[#111110] btn"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>

          <div className="divider text-sm font-bold text-slate-300">or</div>
          {/* sign in with goole */}
          <button
            onClick={handleGoogleSignIn}
            className="px-4 pt-2 pb-1 rounded-3xl bg-white text-sm font-semibold mx-auto flex justify-center gap-2 my-4 border border-slate-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 btn"
          >
            Sign in with Google
            <img
              className="h-4 inline-block"
              src="/google-icon-tiny.png"
              alt="google icon"
            />
          </button>
        </div>
      </div>
      {/* end of grid */}
    </div>
  );
};

export default Login;
