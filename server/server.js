// const express = require("express")
// const cors = require("cors")
// const { MongoClient } = require("mongodb")

// const app = express()

// app.use(cors())
// app.use(express.json())

// const url = "mongodb+srv://demomongo:passwordemo123@cluster0.bvy1owa.mongodb.net/"
// const client = new MongoClient(url)

// let db

// client.connect().then(()=>{
//     db = client.db("QLThueXe")
//     console.log("MongoDB connected")
// })

// app.listen(5000, ()=>{
//     console.log("Server running port 5000")
// })
// // api lấy danh sách xe
// app.get("/api/bikes", async (req,res)=>{
    
//     const bikes = await db.collection("bikes").find({
//         status: "Available",
//         battery: { $gt: 15 }
//     }).toArray()

//     res.json(bikes)

// })
// // api tìm kiếm xe
// app.get("/api/search", async (req,res)=>{

// const keyword = req.query.name

// const bikes = await db.collection("bikes").find({
// bikeName: { $regex: keyword, $options: "i" }
// }).toArray()

// res.json(bikes)

// })
// // api thuê xe
// app.post("/api/rentals", async (req,res)=>{

// const data = req.body

// await db.collection("rentals").insertOne(data)

// await db.collection("bikes").updateOne(
// {_id: data.bikeId},
// {$set:{status:"Rented"}}
// )

// res.json({message:"success"})

// })
// // api lịch sử thuê xe
// app.get("/api/history", async (req,res)=>{

// const history = await db.collection("rentals").find().toArray()

// res.json(history)

// })



const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://demomongo:passwordemo123@cluster0.bvy1owa.mongodb.net/";
console.log(MONGO_URI)

app.use(cors());
app.use(express.json());

// Kết nối MongoDB và gắn vào app
MongoClient.connect(MONGO_URI)
  .then((client) => {
    const db = client.db("QLThueXe");
    app.locals.db = db;
    console.log("✅ Đã kết nối MongoDB - Database: QLThueXe");

    // Gắn routes
    const bikeRoutes = require("./routes/bikes");
    const rentalRoutes = require("./routes/rentals");
    app.use("/api/bikes", bikeRoutes);
    app.use("/api/rentals", rentalRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1);
  });