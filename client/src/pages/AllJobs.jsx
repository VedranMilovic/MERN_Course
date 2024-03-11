import { toast } from "react-toastify";
import { JobsContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";

export const loader = async ({ request }) => {
  console.log(request.url);
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  try {
    const { data } = await customFetch.get("/jobs", { params }); // kad se radi req, parami se također šalju
    return { data, searchValues: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const allJobsContext = createContext();
const AllJobs = () => {
  const { data, searchValues } = useLoaderData(); // ovaj data prosljeđujemo dalje u JobsContainer

  return (
    <allJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </allJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(allJobsContext); // hook funkcija u kojoj koristimo custom hook funkciju

export default AllJobs;
