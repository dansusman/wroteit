import { usePostQuery } from "../generated/graphql";
import { useGetIdFromUrl } from "./useGetIdFromUrl";

export const useGetPostFromUrl = () => {
  const intId = useGetIdFromUrl();
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
