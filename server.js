
const express = require('express');
const path = require('path');  // for handling file paths
const da = require("./data-access");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000



// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

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


// Addes customers
// app.post('/customers', async (req, res) => {
//     const newCustomer = req.body;
//     if (newCustomer === null || req.body != {}) {
//         res.status(400);
//         res.send("missing request body");
//     } else {
//         // return array format [status, id, errMessage]
//         const [status, id, errMessage] = await da.addCustomer(newCustomer);
//         if (status === "success") {
//             res.status(201);
//             let response = { ...newCustomer };
//             response["_id"] = id;
//             res.send(response);
//         } else {
//             res.status(400);
//             res.send(errMessage);
//         }
//     }
// });

app.post('/customers', async (req, res) => {
    const newCustomer = req.body;
    // Check if the request body is missing
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("missing request body");
    } else {
        // Check if the required properties are present
        if (!newCustomer.name || !newCustomer.email) {
            res.status(400).send("missing required properties");
            return;
        }

        // Handle the request
        const [status, id, errMessage] = await da.addCustomer(newCustomer);
        if (status === "success") {
            res.status(201).send({ ...newCustomer, _id: id });
        } else {
            res.status(400).send(errMessage);
        }
    }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});