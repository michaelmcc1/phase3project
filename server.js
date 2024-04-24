
const express = require('express');
const path = require('path');  // for handling file paths
const da = require("./data-access");

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000

// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, 'public')));

// Get all customers
app.get("/customers", async (req, res) => {
    const cust = await da.getCustomers();
    res.send(cust); 
   });

   // Error handeling
   app.get("/customers", async (req, res) => {
    const [cust, err] = await da.getCustomers();
    if(cust){
        res.send(cust);
    }else{
        res.status(500);
        res.send(err);
    }   
});

// Reset Database
app.get("/reset", async (req, res) => {
    const [result, err] = await da.resetCustomers();
    if(result){
        res.send(result);
    }else{
        res.status(500);
        res.send(err);
    }   
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});