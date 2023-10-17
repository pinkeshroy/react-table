import "./Carousel.css";
import { useRef, useState } from "react";
export function Carousel({ imageList = [], onDelete, onSave }) {
  const [page, setPage] = useState(0);
  const carouselRef = useRef();

  function scrollToLeft() {
    const prevPage = page - 1;
    if (prevPage >= 0) {
      carouselRef.current.children[prevPage].scrollIntoView({
        behavior: "smooth",
      });
      setPage(prevPage);
    }
  }

  function scrollToRight() {
    const nextPage = page + 1;
    if (nextPage < imageList.length) {
      carouselRef.current.children[nextPage].scrollIntoView({
        behavior: "smooth",
      });
      setPage(nextPage);
    }
  }

  return (
    <div className="carousel-conatiner">
      <div ref={carouselRef} className="image-container">
        {imageList.map((image, index) => {
          return <img className="carousel-image" src={image.url} key={index} alt="loading..." />;
        })}
      </div>
      {page !== imageList.length - 1 && imageList.length>1 && (
        <div className="carousel-arrow-right">
          <button onClick={scrollToRight} className="carousel-arrow-button">
            {">"}
          </button>
        </div>
      )}
      {page !== 0 && imageList.length > 1 && (
        <div className="carousel-arrow-left">
          <button onClick={scrollToLeft} className="carousel-arrow-button">
            {"<"}
          </button>
        </div>
      )}
      {imageList.length !== 0 &&  (
        <div className="carousel-cross">
          <button
            onClick={() => onDelete(page)}
            className="carousel-cross-button"
          >
            {"❌"}
          </button>
        </div>
      )}
      {imageList.length !== 0 && (
        <div className="carousel-save">
          <button
            onClick={() => onSave(imageList[page])}
            className="carousel-save-button"
          >
            {"Save"}
          </button>
        </div>
          )}
          <div className="carousel.circle-conatiner">
              {
                
              }
              
          </div>
    </div>
  );
}
