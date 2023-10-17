import { useState } from "react";
import { DragAndDrop } from "../DragAndDrop/DragAndDrop";
import { Carousel } from "../Carousel/Carousel";
import { uploadCloudinary } from "../Util/cloudinary";
export function FileUpload() {
  const [imageList, setImageList] = useState([])

  function onDropFile(files) {
    setImageList([...imageList, ...files])
  }

  function onDelete(index) {
    const newimgList = imageList.filter((elem, idx) => idx !== index)
    setImageList(newimgList)
  }
  async function onSave(file) {
    try {
      await uploadCloudinary(file.data)
      alert("Image uploaded sucessfully!");
    } catch (e) {
      alert("unable to upload", e)
    }
  }


  return (
    <>
      <Carousel imageList={imageList} onDelete={onDelete} onSave={onSave} />
      <DragAndDrop title={"Drop File"} onDropFile={onDropFile}/>
    </>
  );
}
