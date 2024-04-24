require('dotenv').config(); // grabs .env to pull the API KEY
const express = require('express');
const path = require('path');  // for handling file paths
const da = require("./data-access");
const bodyParser = require('body-parser');
const apiKey = process.env.API_KEY;

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000



// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());





// Define the middleware function
const apiKeyMiddleware = (req, res, next) => {
    
    // Retrieve the API key from the request header
    const apiKey = req.headers['x-api-key'];

    // Retrieve the expected API key from the environment variable
    const expectedApiKey = process.env.API_KEY;

    // Check if the API key is missing
    if (!apiKey) {
        // Send a 401 Unauthorized response if the API key is missing
        return res.status(401).send('API Key is missing');
    }

    // Check if the API key matches the expected value
    if (apiKey !== expectedApiKey) {
        // Send a 403 Forbidden response if the API key is invalid
        return res.status(403).send('API Key is invalid');
    }

    // Call the next middleware or endpoint handler
    next();
};


app.use(apiKeyMiddleware);



// Get all customers
app.get("customers", apiKeyMiddleware, async (req, res) => {
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

// Addes customers with updated code
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


// Look for customer by ID
app.get("/customers/:id", async (req, res) => {
    const id = req.params.id;
    // return array [customer, errMessage]
    const [cust, err] = await da.getCustomerById(id);
    if(cust){
        res.send(cust);
    }else{
        res.status(404);
        res.send(err);
    }   
});


// Updates existing customer
// app.put('/customers/:id', async (req, res) => {
//     const id = req.params.id;
//     const updatedCustomer = req.body;
//     if (updatedCustomer === null || req.body != {}) {
//         res.status(400);
//         res.send("missing request body");
//     } else {
//         delete updatedCustomer._id;
//         // return array format [message, errMessage]
//         const [message, errMessage] = await da.updateCustomer(updatedCustomer);
//         if (message) {
//             res.send(message);
//         } else {
//             res.status(400);
//             res.send(errMessage);
//         }
//     }
// });

// Updates existing customer with updated code
app.put('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const updatedCustomer = req.body;

    // Check if the request body is missing
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("missing request body");
        return; // Return early to avoid executing the rest of the code
    }
    // Handle the request
    delete updatedCustomer._id; // Remove the _id field if present

    // Update the customer in the database
    const [message, errMessage] = await da.updateCustomer(id, updatedCustomer);

    // Send the appropriate response
    if (message) {
        res.send(message);
    } else {
        res.status(400).send(errMessage);
    }
});



// Delete customer
app.delete("/customers/:id", async (req, res) => {
    const id = req.params.id;
    // return array [message, errMessage]
    const [message, errMessage] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message);
    } else {
        res.status(404);
        res.send(errMessage);
    }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});