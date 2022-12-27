

// create an express app
const express = require("express")
const app = express()

const path = require("path")
const fs = require('fs')
const bodyParser = require('body-parser')

//read in the JSON data for Apple stock
let Apple_data = JSON.parse(fs.readFileSync('public/AAPL.json'));
//read in the JSON data for Meta stock
let Meta_data = JSON.parse(fs.readFileSync('public/FB.json'));

//the next four lines are from httpcode
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({
    extended: false
})
//define the first route
app.get("/", function(req, res) {
    res.sendfile(path.join(__dirname, "public", "index.html"))
})

app.use(express.static("public"))

// define the info route for Apple
app.get('/updateClient1', (req,res)=>{
    console.log("sent Apple Stock Data to Client");
    res.json(Apple_data);
}
)

// define the info route for Meta
app.get('/updateClient2', (req,res)=>{
    console.log("sent Meta Stock Data to Client");
    res.json(Meta_data);
}
)

// start the server listening for requests
let listener = app.listen(process.env.PORT || 3000, ()=>console.log(`Server is running...${listener.address().port}`))
