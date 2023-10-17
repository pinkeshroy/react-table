import { useEffect, useState } from "react";
import "./Pagination.css";

export function Pagination({
  data = [],
  pageSize = 5,
  onChange = () => {},
  pageOptions = 5,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentNoPage, setCurrentNOPage] = useState(1);
  const arrIndex = [];
  const totalPages = Math.ceil(data.length / pageSize);
  const handleOnChange = (pageNo) => {
    if (pageNo <= totalPages) {
      onChange(data.slice((pageNo - 1) * pageSize, pageNo * pageSize));
      setCurrentPage(pageNo);
    }
  };
  const onPreviousClick = () => {
    onChange(
      data.slice((currentPage - 2) * pageSize, (currentPage - 1) * pageSize)
    );
    setCurrentPage(currentPage - 1);
    setCurrentNOPage(currentNoPage - 5);
  };
  const onNextClick = () => {
    onChange(data.slice(currentPage * pageSize, (currentPage + 1) * pageSize));
    setCurrentPage(currentPage + 1);
    setCurrentNOPage(currentNoPage + 5);
  };
  
  useEffect(() => {
      onChange(data.slice(0, 5));
  }, [data]);

  return (
    <div className="pagination-container">
      <button
        disabled={currentPage === 1 || currentNoPage <= 1}
        onClick={onPreviousClick}
      >
        Prev
      </button>
      {data.map((e, index) => {
        if (
          index >= currentNoPage - 1 &&
          index < currentNoPage + pageOptions - 1 &&
          index < totalPages
        ) {
          arrIndex.push(index);
          return (
            <div
              key={index}
              onClick={() => handleOnChange(index + 1)}
              className={`pagination-circle ${
                index + 1 === currentPage && "pagination-active-page"
              }`}
            >
              {index + 1}
            </div>
          );
        } else {
          return <></>;
        }
      })}
      <button
        disabled={
          currentPage === totalPages ||
          totalPages - pageOptions <= currentNoPage - 1
        }
        onClick={onNextClick}
      >
        Next
      </button>
    </div>
  );
}
