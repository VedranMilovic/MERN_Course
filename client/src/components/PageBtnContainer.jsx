// import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
// import Wrapper from "../assets/wrappers/PageBtnContainer";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { useAllJobsContext } from "../pages/AllJobs";

// const PageBtnContainer = () => {
//   const {
//     data: { numOfPages, currentPage },
//   } = useAllJobsContext();
//   const { search, pathname } = useLocation();
//   const navigate = useNavigate();
//   const pages = Array.from({ length: numOfPages }, (_, index) => index + 1);
//   // tražimo samo index pa je prvi param izostavljen. Gradimo array od 1-10 (+1 jer su arrays zero based)

//   const handlePageChange = (pageNumber) => {    // prvo dobijemo instance (jedan job?)
//     const searchParams = new URLSearchParams(search); //JS construktor, ova funkcija šalje extra req. na server s page included (param sa page number)
//     searchParams.set("page", pageNumber);   // na serveru tražimo page query param, pa stoga "page"
//     navigate(`${pathname}?${searchParams.toString()}`); // ovo nam se dodaje na url, pa req. npr 3 stranicu
//   };

//   return (
//     <Wrapper>
//       <button
//         className="btn prev-btn"
//         onClick={() => {
//           let prevPage = currentPage - 1;
//           if (prevPage < 1) prevPage = numOfPages;      // ako je stranica 0, onda na numOfPages(veličina arraya,  tj. kraj)
//           handlePageChange(prevPage);
//         }}
//       >
//         <HiChevronDoubleLeft />
//         prev
//       </button>
//       <div className="btn-container">
//         {pages.map((pageNumber) => (
//           <button
//             className={`btn page-btn ${pageNumber === currentPage && "active"}`}
//             key={pageNumber}
//             onClick={() => handlePageChange(pageNumber)}
//           >
//             {pageNumber}
//           </button>
//         ))}
//       </div>
//       <button
//         className="btn next-btn"
//         onClick={() => {
//           let nextPage = currentPage + 1;
//           if (nextPage > numOfPages) nextPage = 1; // ili numOfPages
//           handlePageChange(nextPage);
//         }}
//       >
//         next
//         <HiChevronDoubleRight />
//       </button>
//     </Wrapper>
//   );
// };

// export default PageBtnContainer;

//IMPORTANT pogledaj kak je Jonas napravil paginaciju

import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAllJobsContext } from "../pages/AllJobs";

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJobsContext();
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("page", pageNumber);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        className={`btn page-btn ${activeClass && "active"}`}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  };

  const renderPageButtons = () => {
    const pageButtons = [];

    // kak JS čita kod od početka prema kraju, pozicija gumbića u kodu je bitna
    // Add the first page button
    pageButtons.push(
      addPageButton({ pageNumber: 1, activeClass: currentPage === 1 })
    );
    // Add the dots before the current page if there are more than 3 pages
    if (currentPage > 3) {
      pageButtons.push(
        <span className="page-btn dots" key="dots-1">
          ....
        </span>
      );
    }
    // one before current page
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(
        addPageButton({ pageNumber: currentPage - 1, activeClass: false })
      );
    }

    // Add the current page button
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButtons.push(
        addPageButton({ pageNumber: currentPage, activeClass: true })
      );
    }

    // one after current page
    if (currentPage !== numOfPages && currentPage !== numOfPages - 1) {
      pageButtons.push(
        addPageButton({ pageNumber: currentPage + 1, activeClass: false })
      );
    }
    if (currentPage < numOfPages - 2) {
      pageButtons.push(
        <span className=" page-btn dots" key="dots+1">
          ....
        </span>
      );
    }

    // Add the last page button
    pageButtons.push(
      addPageButton({
        pageNumber: numOfPages,
        activeClass: currentPage === numOfPages, // numOfPages je duljina arraya, tj. zadnji page
      })
    );

    return pageButtons;
  };

  return (
    <Wrapper>
      <button
        className="prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = numOfPages;
          handlePageChange(prevPage);
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">{renderPageButtons()}</div>
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numOfPages) nextPage = 1;
          handlePageChange(nextPage);
        }}
      >
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
