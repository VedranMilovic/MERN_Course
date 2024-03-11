import { FormRow, FormRowSelect, SubmitBtn } from ".";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, useSubmit, Link } from "react-router-dom";
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from "../../../utils/constants";
import { useAllJobsContext } from "../pages/AllJobs";

const SearchContainer = () => {
  const { searchValues } = useAllJobsContext();
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout); // clearamo prijašnji timeout
      timeout = setTimeout(() => {
        // postavljamo novi timeout
        onChange(form); // ovu funkciju zovemo dolje  kroz debounce()
      }, 2000);
      console.log(form);
    };
  };

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            defaultValue="a"
            onChange={debounce((form) => {
              submit(form);
            })}
            // onChange={(e) => {
            //   // šalje se na FormRow i formRowSelect
            //   submit(e.currentTarget.form);
            // }}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            //"all" nema u konstantama, ali ga želimo koristiti, pa ga tu dodajemo konstantama
            list={["all", ...Object.values(JOB_STATUS)]}
            defaultValue="all"
            onChange={(e) => {
              // šalje se na FormRow i formRowSelect
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            list={["all", ...Object.values(JOB_TYPE)]}
            defaultValue="all"
            onChange={(e) => {
              // šalje se na FormRow i formRowSelect
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            name="sort"
            defaultValue="newest"
            list={[...Object.values(JOB_SORT_BY)]}
            onChange={(e) => {
              // šalje se na FormRow i formRowSelect
              submit(e.currentTarget.form);
            }}
          />

          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
          {"  "}
          {/**ovaj Link nas vraća na url i briše search params! */}
          {/** TEMP */}
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchContainer;
