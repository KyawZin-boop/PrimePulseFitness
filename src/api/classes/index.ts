import axios from "@/configs/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  QueryOptions,
} from "@tanstack/react-query";

const BASE_URL = "Class";

export const getAllClasses = {
  useQuery: (opt?: QueryOptions<GymClass[]>) => 
    useQuery<GymClass[], Error>({
      queryKey: ["getAllClasses"],
      queryFn: async () => {
        const response: ApiResponse<GymClass[]> = await axios.get(`${BASE_URL}/GetAllClasses`).then(res => res.data);
        
        return response.data;
      },
      ...opt,
    })
};

export const getPopularClasses = {
  useQuery: (opt?: QueryOptions<GymClass[]>) => 
    useQuery<GymClass[], Error>({
      queryKey: ["getPopularClasses"],
      queryFn: async () => {
        const response: ApiResponse<GymClass[]> = await axios.get(`${BASE_URL}/GetPopularClasses`).then(res => res.data);

        return response.data;
      },
      ...opt,
    })
};

export const addNewClass = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, AddGymClass>>
  ) => {
    return useMutation<null, Error, AddGymClass>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/CreateClass`, payload);
        return request.data;
      },
      ...opt,
    });
  },
};

export const getGymClassById = {
  useQuery: (classID: string, opt?: QueryOptions<GymClass>) => 
    useQuery<GymClass, Error>({
      queryKey: ["getGymClassById", classID],
      queryFn: async () => {
        const response: ApiResponse<GymClass> = await axios.get(`${BASE_URL}/GetClassById/${classID}`).then(res => res.data);

        return response.data;
      },
      ...opt,
    })
};

