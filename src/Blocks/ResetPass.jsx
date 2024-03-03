import React, { useContext } from "react";
import { AuthContext } from "../Poveiders/AuthProvider";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import axios from "axios";
import { parentURL } from "../Api/baseUrl";

const ResetPass = () => {
  const { resetPass } = useContext(AuthContext);

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
    console.log(data.email);

    // todo: check if the email includes in data base, if includes then move to the next procedure or else give an warning toast
    axios
      .get(`${parentURL}/users`)
      .then((res) => {
        const allUsers = res.data;
        allUsers.map((item) => {
          if (item.email !== data.email) {
            toast.error(`Account not found, register first!`);
          } else {
            resetPass(data.email)
              .then((res) => {
                toast.success(`A reset link has been sent to your email`);

                // notification payload
                const notificationPayload = {
                  text: `You have reseted you password! 🖇️`,
                  dateNotified: new Date(),
                };

                // todo: send notification
                axios
                  .post(
                    `${parentURL}/users/notifications/${item._id}`,
                    notificationPayload
                  )
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });

                // end of noitification api
                reset();
              })
              .catch((error) => toast.error(error.message));
          }
        });
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      });
  };

  return (
    <div className="px-20 py-20 font-roboto">
      <Toaster position="top-center" richColors />
      <h1 className="text-2xl font-bold text-slate-700 text-center">
        Give your email address
      </h1>
      <p className="text-xs text-center pt-2">
        This email should be the exact email of <br /> your registered account
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center mt-2 gap-2">
          <input
            type="email"
            placeholder="Your email"
            className="input input-bordered input-md w-full max-w-xs"
            {...register("email", { required: true })}
          />
          <input className="btn btn-outline" type="submit" />
        </div>
      </form>
      <p className="text-xs text-center pt-10">
        Go back to{" "}
        <Link className="hover:text-indigo-400 font-bold" to={"/login"}>
          Log in
        </Link>{" "}
        after resetting password
      </p>
    </div>
  );
};

export default ResetPass;
