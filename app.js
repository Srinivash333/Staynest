const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path");

const MONG_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Set EJS as view engine (for rendering pages)
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


// Define async function
async function main() {
    await mongoose.connect(MONG_URL);
}

// Call function
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// Route
app.get("/", (req, res) => {
    res.send("Hi I am root");
});

// app.get("/testListing", async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successfull testing");
// });

// Route to show all listings
app.get("/listings", async (req, res) => {

    // Fetch all data from DB
    const allListings = await Listing.find({});

    // Render index.ejs and send data
    res.render("listings/index", { allListings });
});



// new route 

app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})


// show route 

app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});
});

//create route 

app.post("/listings", async (req, res) => {
    let listing = req.body.listing;

    const newListing = new Listing(listing); // create object
    await newListing.save();                 // save to DB

    res.redirect("/listings");               // redirect after save
});





// Start server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});