import axios from "axios";

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "imagenes_react");
  formData.append("folder", "productos");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dulmm3ruj/image/upload",
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return null;
  }
};

export default uploadImageToCloudinary;
