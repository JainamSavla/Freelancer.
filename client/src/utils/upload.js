import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr");

  try {
    const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, data);

    const { url } = res.data;
    // Force HTTPS
    return url.replace("http://", "https://");
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
};

export default upload;
