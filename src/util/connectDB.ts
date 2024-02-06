import mongoose from "mongoose";

const connect = async (startServer: () => void) => {
  try {
    await mongoose.connect(process.env.DB_URL || "",{dbName : "Movfac"});
    console.log("connect db success");
    startServer();
  } catch (err) {
    throw err;
  }
};

export default connect;
