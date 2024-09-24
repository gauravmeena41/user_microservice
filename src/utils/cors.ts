import cors from "cors";

const corsOptions = {
  origin: "https://yourdomain.com", // Allow only your trusted domains
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true, // To allow cookies to be sent with requests
};


export default cors(corsOptions)