import axios from "axios";
import { useForm } from "react-hook-form";
import { MdVerified } from "react-icons/md";
import { localServerURL } from "../Api/localURL";
import { Toaster, toast } from "sonner";
import { parentURL } from "../Api/baseUrl";

const CehckWebStatus = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // console.log(data.siteName);

    axios
      .post(`${parentURL}/offer-backlink/check-verification`, data)
      .then((res) => {
        if (res.data.message === "verified") {
          toast.success(`Your site is verified`);
          reset();
        } else if (res.data.message === "notVerified") {
          toast.error(`Your site is not verified`);
          reset();
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      <div className="w-full">
        {/* You can open the modal using document.getElementById('ID').showModal() method */}

        <div className="pt-4">
          <button
            className="btn btn-outline btn-sm bg-emerald-400 w-[20%]"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            <MdVerified className="text-xl" />
            Check Status
          </button>
        </div>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-red-400">
                <img src="/cross.svg" alt="close" />
              </button>
            </form>
            {/* here will be modal text */}
            <h1 className="text-start text-lg font-bold text-slate-900">
              Verification Status 💡
            </h1>
            <p className="text-xs text-slate-400 font-bold text-start pt-2">
              Provide your submitted URL
            </p>
            <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
              {/*  <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Your registered email</span>
                </div>
                <input
                  type="email"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                  {...register("email", {
                    required: true,
                  })}
                />
              </label> */}

              <label className="form-control w-full pt-1">
                <div className="label">
                  <span className="label-text">Give your submitted url</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full text-slate-900"
                  {...register("siteName", {
                    required: true,
                    pattern: /^www\..+\.(com|net|org|io|info|co|edu)$/,
                  })}
                />
                {errors.siteName && errors.siteName?.type === "pattern" && (
                  <span className="text-xs py-2 font-semibold text-red-400">
                    Start with www. and end with .com or TLDs
                  </span>
                )}
              </label>
              <input
                className="btn btn-outline mt-5 w-full bg-orange-300"
                type="submit"
                value={"Check Verification"}
              />
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default CehckWebStatus;
