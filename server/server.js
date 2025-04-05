// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient'); // Add this

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost/mern-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes); // Add patient routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//mongodb+srv://hamzaatiq118:2R4cUXIBtLIjvEKd@mern-auth.en32nrp.mongodb.net/?retryWrites=true&w=majority&appName=Mern-auth


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://hamzaatiq118:2R4cUXIBtLIjvEKd@mern-auth.en32nrp.mongodb.net/?retryWrites=true&w=majority&appName=Mern-auth";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



//mongodb+srv://hamzaatiq118:2R4cUXIBtLIjvEKd@mern-auth.en32nrp.mongodb.net/?retryWrites=true&w=majority&appName=Mern-auth