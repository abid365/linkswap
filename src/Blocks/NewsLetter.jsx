import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { parentURL } from "../Api/baseUrl";
import { toast } from "sonner";

const NewsLetter = () => {
  // fetch data
  const fetchUsers = async () => {
    const result = await axios.get(`${parentURL}/users`);
    return result.data;
  };

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // hook form
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);

    // user /newsletter endpont to send news letter

    const addresses = [];
    users.map((item) => addresses.push(item.email));

    const payLoad = {
      to: addresses,
      subject: data.subject,
      text: data.message,
    };
    // send to nodemail in the backend
    axios
      .post(`${parentURL}/newsletter`, payLoad)
      .then((res) => {
        toast.success(`Newsletter sent to all users`);
        reset();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // loading and error handling

  if (isLoading) {
    return (
      <div className="px-20 py-10">
        <h1 className="text-center">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-20 py-10">
        <h1 className="text-center">{error.message}</h1>
      </div>
    );
  }

  return (
    <div className="py-10 font-roboto">
      <h1 className="text-xl font-bold text-center">
        Send Newsletter in Seconds 🚀
      </h1>
      <p className="text-xs font-semibold text-center">
        Send Newsletter to {users.length} users
      </p>
      <div className="flex justify-center items-center w-full">
        <form className="w-[60%]" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold text-slate-600">
                Subject
              </span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
              {...register("subject")}
            />
          </label>
          <label className="form-control pt-3">
            <div className="label">
              <span className="label-text font-bold text-slate-600">
                Your Message
              </span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Type here"
              {...register("message")}
            ></textarea>
          </label>
          <button
            type="submit"
            className="mt-3 w-full btn btn-outline bg-indigo-300 text-lg font-bold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsLetter;
