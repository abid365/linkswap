import { useContext } from "react";
import { AuthContext } from "../Poveiders/AuthProvider";
import { useQuery } from "react-query";
import axios from "axios";
import { parentURL } from "../Api/baseUrl";
import { toast } from "sonner";

const useAdmin = () => {
  const { user } = useContext(AuthContext);
  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ["isAdmin", user?.email],
    queryFn: async () => {
      const res = await axios.get(`${parentURL}/users/admin/${user?.email}`);
      // .then((res) => console.log(res))
      // .catch((error) => {
      //   toast.error(`${error.message}`);
      // });
      // console.log(`is admin`, res);

      return res.data.admin;
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;
