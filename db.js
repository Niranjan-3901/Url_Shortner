const mongoose=require("mongoose")

const connectDB=async()=>{
    const mongoUrl="mongodb://localhost:27017/Url_Shortner"
    await mongoose.connect(mongoUrl).then(()=>{
        console.log("Connected to Database")
    }).catch((err)=>{
        console.log(`Failed to connect to MongoDB: ${err}`)
    })
}

const UrlSchema = new mongoose.Schema({
  fullUrl: {type: String,required: true},
  shortUrl: {type: String,unique: true,required: true},
  clicks: {type: Number,default: 0}
});

const Url = mongoose.model('url', UrlSchema);

module.exports={connectDB,Url}