// data-access.js file
const MongoClient = require('mongodb').MongoClient;
const dbName = 'custdb';
const baseUrl = "mongodb://127.0.0.1:27017";
const collectionName = "customers"
const connectString = baseUrl + "/" + dbName; 
let collection;

async function dbStartup() {
    const client = new MongoClient(connectString);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
}

// Get customers
async function getCustomers() {
    return await collection.find().toArray();
}

// Error handeling
async function getCustomers() {
    try {
        const customers = await collection.find().toArray();
        // throw {"message":"an error occured"}; //example of error occuring
        return [customers, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}


// Reset database for testing purposes  
async function resetCustomers() {
    let data = [{ "id": 0, "name": "Mary Jackson", "email": "maryj@abc.com", "password": "maryj" },
    { "id": 1, "name": "Karen Addams", "email": "karena@abc.com", "password": "karena" },
    { "id": 2, "name": "Scott Ramsey", "email": "scottr@abc.com", "password": "scottr" }];

    try {
        await collection.deleteMany({});
        await collection.insertMany(data);
        const customers = await collection.find().toArray();
        const message = "data was refreshed. There are now " + customers.length + " customer records!"
        return [message, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

// Add new Customer
async function addCustomer(newCustomer) {
    try {
        const insertResult = await collection.insertOne(newCustomer);
        // return array [status, id, errMessage]
        return ["success", insertResult.insertedId, null];
    } catch (err) {
        console.log(err.message);
        return ["fail", null, err.message];
    }
}


// Search for customer by ID
async function getCustomerById(id) {
    try {
        const customer = await collection.findOne({"id": +id});
        // return array [customer, errMessage]
        if(!customer){
          return [ null, "invalid customer number"];
        }
        return [customer, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}


// // update existing customer
// async function updateCustomer(updatedCustomer) {
//     try {
//         const filter = { "id": updatedCustomer.id };
//         const setData = { $set: updatedCustomer };
//     if (updateResult.modifiedCount === 1) {
//             return ["one record updated", null]; // Success message
//         } else {
//             return [null, "No record was updated"]; // Error message
//         }
//     } catch (err) {
//         console.error("Error updating customer:", err);
//         return [null, err.message]; // Return error message
//     }
// }

// update existing customer with updated code
async function updateCustomer(id, updatedCustomer) {
    console.log("Updating customer with ID:", id);
    try {
        // used to convert the id to a number
        const customerId = parseInt(id);
        const filter = { "id": customerId };
 
        console.log("Update filter:", filter);
        const setData = { $set: updatedCustomer };
        console.log("Update data",setData)
        
        // Update the customer in the database
        const updateResult = await collection.updateOne(filter, setData);
        console.log("Update result:", updateResult);
        // Check if the update operation was successful
        if (updateResult.modifiedCount === 1) {
            return ["one record updated", null]; // Success message
        } else {
            return [null, "No record was updated"]; // Error message
        }
    } catch (err) {
        console.error("Error updating customer:", err);
        return [null, err.message]; // Return error message
    }
}


async function deleteCustomerById(id) {
    try {
        const deleteResult = await collection.deleteOne({ "id": +id });
        if (deleteResult.deletedCount === 0) {
            // return array [message, errMessage]
            return [null, "no record deleted"];
        } else if (deleteResult.deletedCount === 1) {
            return ["one record deleted", null];
        } else {
            return [null, "error deleting records"]
        }
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}




dbStartup();
module.exports = { getCustomers, resetCustomers, addCustomer, getCustomerById, updateCustomer, deleteCustomerById };