import { axiosClient } from "../utils/axiosClients";

export const getDataSource = async (endpoint: string, data: any) => {
  console.log("data", data);

  return await axiosClient.post<any, any>(endpoint, { ...data });
};
