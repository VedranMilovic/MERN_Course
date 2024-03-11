import JobModel from "../models/JobModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";

//local array
// import { nanoid } from "nanoid";

// let jobs = [
//   { id: nanoid(), company: "tria", position: "frontend" },
//   { id: nanoid(), company: "entitas", position: "backend" },
// ];

// IMPORTANT functions for handling job-related operations.
export const getAllJobs = async (req, res) => {
  console.log("req.query", req.query); // dugi response u terminalu
  // console.log(req.user);
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [
      // mongoDB sintaksa za regexe
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  if (jobStatus && jobStatus !== "all") {
    // ako ima jobStatus i ako nije "all", dodaj u query search
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  //setup pagination

  const page = Number(req.query.page) || 1; // tu još nema .page, kasnije providamo. radimo  math operacije, pa pretvaramo string u broj
  const limit = Number(req.query.limit) | 10; // 10 jobs per page
  const skip = (page - 1) * limit; // na nultoj page skipamo zero jobs (1-1 = 0 * 10 = 0); prva => (2-1 = 1 * 10 = 10)...

  const jobs = await JobModel.find(
    // tražimo samo jobs koji pripadaju tom useru
    queryObject
    // position: req.query.search, // search param je u Postmanu (params tab)!!!! za ovu liniju treba {}
  )
    .sort(sortKey) // npr. -createdAt nam sortira po createdAt, descending, MongoDB daje metodu
    .skip(skip)
    .limit(limit); // isto i limit(limitira response(prikaz), ne broj sortiranih objekata!!)

  const totalJobs = await JobModel.countDocuments(queryObject); // ukupni broj itema
  const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs }); //200
}; //get the data from server/local data. prvo url, pa api/......

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId; // dodajemo createdBy objektu i postavljamo ga kao req.user.userId
  //ručno hendlanje errors
  // try {
  //   const job = await JobModel.create({ company, position }); // asinkrono (rad s bazom), pa await
  //   res.status(201).json({ job }); // 201 status dok createaš resource (POST)
  // } catch (error) {
  //   console.log(error); // veliki log u cli
  //   res.status(500).json({ msg: `server error` }); // ovaj catch ne ruši server
  // }

  const { company, position, createdBy } = req.body; // može se i bez destrukturiranja, samo upucati dole u create req.body
  const job = await JobModel.create({ company, position, createdBy }); // asinkrono (rad s bazom), pa await
  res.status(StatusCodes.CREATED).json({ job }); // 201 status dok createaš resource (POST)

  //ovo dolje kod za lokalni array
  // if (!company || !position) {
  //   res.status(400).json({ msg: `Please provide company and position` });
  //   return; // bitno, bez guard clause nastavlja čitati JS, dojde do drugog requesta, pa cannot set headers
  // }
  // const id = nanoid(10); // id od 10 char
  // const job = { id, company, position }; //id: id, company: company...
  // jobs.push(job);
};

export const getSingleJob = async (req, res) => {
  const { id } = req.params;

  const job = await JobModel.findById(id);

  //kod za local array
  // const job = jobs.find((job) => job.id === id); // ako se job.id podudara sa idem iz req.params
  // throw new Error(`No job with that id`); // ovo hvata expressov error middleware, donja linija se preskaće
  //hardcoding primjer
  // console.log(job); // null
  // return res.status(404).json({ msg: `no job with id: ${id}` });

  res.status(StatusCodes.OK).json({ job });
};

export const updateJob = async (req, res) => {
  const { id } = req.params; // kad bi dolje bilo samo id
  //stara validacija - local array
  // const { company, position } = req.body;
  // if (!company || !position) {
  //   res.status(400).json({ msg: `Please provide company and position` });
  //   return; // bitno, bez guard clause nastavlja čitati JS, dođe do drugog request, pa cannot set headers
  // }

  const updatedJob = await JobModel.findByIdAndUpdate(id, req.body, {
    new: true, //da nam šalje update object, ne stari
  }); // ili {company, position}, ali req.body je već objekt

  // const job = jobs.find((job) => job.id === id); // local array => ako se job.id podudara sa idem iz req.params

  // job.company = company; //local array
  // job.position = position;
  res.status(StatusCodes.OK).json({ msg: `job modified`, job: updatedJob }); // stvoreni object
};

export const deleteJob = async (req, res) => {
  const removedJobs = await JobModel.findByIdAndDelete(req.params.id); // ako mongoose ne nađe job s tim id => greška
  // const job = jobs.find((job) => job.id === id);   // local array
  //hardcoding

  // const newJobs = jobs.filter((job) => job.id !== id);   //local array
  // jobs = newJobs;

  res.status(StatusCodes.OK).json({ msg: "job deleted", job: removedJobs });
};

export const showStats = async (req, res) => {
  let stats = await JobModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, //prvo matchamo sve jobs za određenog usera (vedran ili testni => Bubbles McLaughster )
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } }, // grupiramo po jobStatus
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr; // current iteration
    acc[title] = count;
    return acc;
  }, {}); // želimo object umjesto array, pa je zato object tu
  console.log(stats);
  const defaultStats = {
    // tu nam je object od gore
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await JobModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, //prvo matchamo sve jobs za određenog usera (vedran ili testni => Bubbles McLaughster )

    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, // _id je objekt, $year izvlači godine, isto i mjesec u istom datumu
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, // počinjemo s najvećom vrijednošću, dakle s 6,5,4 mjesecom...
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1) //dayjs počinje 0 ali Mongu je siječanj 1, pa ide -1
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse();

  //example code
  // let monthlyApplications = [
  //   {
  //     date: "May 23",
  //     count: 12,
  //   },

  //   {
  //     date: "Jun 23",
  //     count: 9,
  //   },
  //   {
  //     date: "Jul 23",
  //     count: 6,
  //   },
  // ];

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
