import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { Link, Form } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import JobInfo from "./JobInfo";
import day from "dayjs"; // library, formatira datum
import advancedFormat from "dayjs/plugin/advancedFormat"; // isti library, samo naprednije formatiranje
day.extend(advancedFormat);

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt, // value koji dolazi od MongoDB
  jobStatus,
}) => {
  const date = day(createdAt).format("MMM Do, YYYY");

  // dinamički renderiramo različite boje za jobStatus => iz index.css (pending, interview, declined)
  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${jobStatus}`}>{jobStatus}</div>
        </div>
        <footer className="actions">
          {/* <Link to="/dashboard/edit-job" className="btn edit-btn">      // drugačiji način za doći do ptanje
            Edit
          </Link> */}
          <Link to={`../edit-job/${_id}`} className="btn edit-btn">
            Edit
          </Link>
          <Form method="post" action={`../delete-job/${_id}`}>
            {" "}
            {/* action ukazuje na endpoint koji se koristi */}
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
