const mongoose = require('mongoose');

const connectDB = async()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    console.log(conn.connection.host)
    console.log(conn.connection.port);
    console.log(`MongoDB connected : ${conn.connection.host}`)
}

module.exports = connectDB