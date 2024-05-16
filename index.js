// const express = require("express")
// const {connectDB,Url} = require("./db")
// const shortId=require("short-unique-id")
// const body_parser = require("body-parser")
// const app = express()
// const PORT = 9864


// app.use(body_parser.json())
// connectDB();
// // let url = new URL({
// //     originalUrl:"https://www.google.com",
// //     shortUrl:"xyz",
// //     clicks:10
// // })

// // url.save().then(()=>{
// //     console.log("Saved...")
// // }).catch(err => console.log(err))

// const isValidUrl = url => {
//     const urlRegex = /^(http|https):\/\/[\w.-]+(?:[:\d]*)\/\S+$/;
//     return urlRegex.test(url);
//   }

// app.post('/short', async (req, res) => {
//     const { fullUrl } = req.body;
  
//     if (!isValidUrl(fullUrl)) {
//         return res.status(400).json({ message: 'Invalid URL' });
//       }

//     try {
//         const existingUrl = await Url.findOne({fullUrl});
//         if(existingUrl){
//             return res.json({shortId:existingUrl.shortId});
//         }
//         const shortId = shortId.generate();
//         const newUrl = new Url({ fullUrl, shortId});
//         await newUrl.save();
//         res.json({ shortId });
//     } catch(err) {
//         console.error(err);
//         return res.status(500).send({"message":"Internal Server Error"});
//     }
// });

// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}...`)
// })


const express = require("express");
const { connectDB, Url } = require("./db");
const shortId = require("short-unique-id");
const bodyParser = require("body-parser"); // Updated to bodyParser

const app = express();
const PORT = 9864;

app.use(bodyParser.json());
connectDB();

const isValidUrl = (url) => {
  const urlRegex = /^(http|https):\/\/[\w.-]+(?:[:\d]*)\/\S+$/;
  return urlRegex.test(url);
};

app.post("/short", async (req, res) => {
  const { fullUrl } = req.body;

  if (!isValidUrl(fullUrl)) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  try {
    const existingUrl = await Url.findOne({ fullUrl });
    if (existingUrl) {
      return res.json({ shortId: existingUrl.shortUrl });
    }

    const shortUrl = new shortId({length:7}).rnd();
    const newUrl = new Url({ fullUrl, shortUrl });
    await newUrl.save();
    res.json({ fullUrl, shortUrl }); // Include both original and shortened URLs
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get('/:shortUrl', async (req, res) => {
  const shortURL = req.params.shortUrl;

  try {
    const url = await Url.findOne({ shortUrl: shortURL });
    if (url) {
      await Url.updateOne({ shortUrl:shortURL }, { $inc: { clicks: 1 } });
      return res.redirect(url.fullUrl);
    }
    res.status(404).json({ message: 'Short URL not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
