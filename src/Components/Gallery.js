import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./gallery.css";
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRightToLine,
  ArrowLeftToLine,
  ArrowRightFromLine,
  ArrowLeftFromLine,
  ImagePlus,
  Trash2,
} from "lucide-react";

// Method to create an array with the specified length and initializes each element with the desired object.
const gridElements = {
  getNewObject: function (index, count) {
    return Array.from({ length: count - index }, () => ({
      size: "small",
      pic: null,
    }));
  },
};

const Gallery = () => {
  const [galleryData, setGalleryData] = useState([
    gridElements.getNewObject(0, 4),
  ]);
  const [cellNo, setCellNo] = useState(0);
  const [rowNo, setRowNo] = useState(0);
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newGalleryData = galleryData.map((row, i) => {
          if (i === rowNo) {
            {
              return row.map((item, i) => {
                if (i === cellNo) {
                  return { ...item, pic: reader.result };
                }
                return item;
              });
            }
          }
          return row;
        });
        setGalleryData(newGalleryData);
      };
      reader.readAsDataURL(file);
      fileInputRef.current.value = "";
      setCellNo(0);
      setRowNo(0);
    }
  };

  const onDelete = (rowIndex, colIndex, size) => {
    const newGalleryData = galleryData.map((row, i) => {
      if (i === rowIndex) {
        return row.map((item, j) =>
          j === colIndex ? { ...item, pic: null, size: "small" } : item
        );
      }
      return row;
    });

    if (size === "large") {
      const newRow = [...newGalleryData[rowIndex]];
      newRow.splice(colIndex + 1, 0, { size: "small", pic: null });
      newGalleryData[rowIndex] = newRow;
    }

    setGalleryData(newGalleryData);
  };

  const expandToLeft = (rowIndex, colIndex) => {
    const newGalleryData = galleryData.map((row, i) => {
      if (i === rowIndex) {
        return row.map((item, j) =>
          j === colIndex ? { ...item, size: "large" } : item
        );
      }
      return row;
    });

    const newRow = [...newGalleryData[rowIndex]];
    newRow.splice(colIndex - 1, 1);
    newGalleryData[rowIndex] = newRow;

    setGalleryData(newGalleryData);
  };

  const expandToRight = (rowIndex, colIndex) => {
    const newGalleryData = galleryData.map((row, i) => {
      if (i === rowIndex) {
        return row.map((item, j) =>
          j === colIndex ? { ...item, size: "large" } : item
        );
      }
      return row;
    });

    const newRow = [...newGalleryData[rowIndex]];
    newRow.splice(colIndex + 1, 1);
    newGalleryData[rowIndex] = newRow;

    setGalleryData(newGalleryData);
  };

  const slideLeft = (rowIndex, colIndex) => {
    const newGalleryData = galleryData.map((row, i) => {
      if (i === rowIndex) {
        {
          return row.map((item, i) => {
            if (i === colIndex) {
              return { ...item, size: "small" };
            }
            return item;
          });
        }
      }
      return row;
    });

    newGalleryData[rowIndex].splice(colIndex + 1, 0, {
      size: "small",
      pic: null,
    });
    setGalleryData(newGalleryData);
  };

  const slideRight = (rowIndex, colIndex) => {
    const newGalleryData = galleryData.map((row, i) => {
      if (i === rowIndex) {
        {
          return row.map((item, i) => {
            if (i === colIndex) {
              return { ...item, size: "small" };
            }
            return item;
          });
        }
      }
      return row;
    });
    newGalleryData[rowIndex].splice(colIndex, 0, { size: "small", pic: null });
    setGalleryData(newGalleryData);
  };

  const handleIconClick = (rowIndex, colIndex) => {
    setRowNo(rowIndex);
    setCellNo(colIndex);
    fileInputRef.current.click();
  };

  useEffect(() => {
    const lastRowIndex = galleryData.length - 1;
    const lastRow = galleryData[lastRowIndex];

    const flag = lastRow.some((item) => item.pic !== null);

    if (flag) {
      // Add a new row only if the last row already contains an image
      setGalleryData((prevGridData) => [
        ...prevGridData,
        gridElements.getNewObject(0, 4),
      ]);
    }
  }, [galleryData]);

  return (
    <div className="galleryWrap">
      <div className="sub-part">
        <div className="sub-part-heading">Upload Images Here</div>
        <div className="sub-part-para">
          Individually upload images to each grid cell by selecting and
          enhancing your gallery with a personal touch.
        </div>
      </div>
      <Container className="gridWrap">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
          accept="image/*"
        />

        <div className="cellsWrap">
          {galleryData.map((row, rowIndex) => (
            <Row className="gridRow" key={rowIndex}>
              {/* 6 is used for big column */}
              {row.map((cell, colIndex) =>
                cell.size === "large" && cell?.pic ? (
                  <Col xs={6} key={colIndex} className="largeCol">
                    <div className="picWrap">
                      <div
                        className="image-container"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <img src={cell?.pic} alt="Your Alt Text" />
                        {isHovered && (
                          <div className="overlay">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <div className="arrow-left" style={{cursor: "pointer"}}>
                                <ArrowRightFromLine
                                  onClick={() => {
                                    slideRight(rowIndex, colIndex);
                                  }}
                                />
                              </div>
                              <div className="delete-icon" style={{cursor: "pointer"}}>
                                <Trash2
                                  onClick={() => {
                                    onDelete(rowIndex, colIndex, "large");
                                  }}
                                />
                              </div>
                              <div className="arrow-right" style={{cursor: "pointer"}}>
                                <ArrowLeftFromLine
                                  onClick={() => {
                                    slideLeft(rowIndex, colIndex);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                ) : (
                  <Col xs={3} key={colIndex} className="smallCol" style={{cursor: "pointer"}}>
                    {/* 3 is used for small column */}
                    <div className="picWrap">
                      {cell?.pic ? (
                        <div
                          className="image-container"
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          style={{cursor: "pointer"}}
                        >
                          <img src={cell?.pic} alt="Your Alt Text" />
                          {isHovered && (
                            <div className="overlay">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  height: "100%",
                                }}
                              >
                                <div className="arrow-left">
                                  {colIndex !== 0 &&
                                  !galleryData[rowIndex][colIndex - 1]?.pic ? (
                                    <ArrowLeftToLine
                                      onClick={() => {
                                        expandToLeft(rowIndex, colIndex);
                                      }}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                </div>
                                <div className="delete-icon" style={{cursor: "pointer"}}>
                                  <Trash2
                                    onClick={() => {
                                      onDelete(rowIndex, colIndex, "small");
                                    }}
                                  />
                                </div>
                                <div className="arrow-right" style={{cursor: "pointer"}}>
                                  {colIndex !== row.length - 1 &&
                                  !galleryData[rowIndex][colIndex + 1]?.pic ? (
                                    <ArrowRightToLine
                                      onClick={() => {
                                        expandToRight(rowIndex, colIndex);
                                      }}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="image-container"
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          {isHovered && (
                            <div className="noPicOverlay">
                              <Row>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleIconClick(rowIndex, colIndex);
                                  }}
                                  className="addImageWrap"
                                >
                                  <ImagePlus className="mb-2" />
                                  Add Image
                                </div>
                              </Row>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Col>
                )
              )}
            </Row>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Gallery;
