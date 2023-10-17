const UPLOAD_PRESET = "a65wqi3g";
const CLOUD_NAME = "dzmvxu5uw";
const API_KEY = "146525857119172";

export async function uploadCloudinary(fileData) {
  const formData = new FormData();
  formData.append("file", fileData);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("cloud_name", CLOUD_NAME);
  formData.append("api_key", API_KEY);

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/c-3fd300dbe9e8d90935504cbe332f19/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

   await response.json();
}
