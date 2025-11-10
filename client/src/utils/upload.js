import axios from "axios";

// Change the URL to use HTTPS
const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr");

  try {
    const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, data);

    const { url } = res.data;
    // Force HTTPS in Cloudinary URLs
    return url.replace("http://", "https://");
  } catch (err) {
    console.log(err);
  }
};

export default upload;
