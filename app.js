const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fileUpload = require('express-fileupload');
require('dotenv').config();
const port = 5000;

const app = express()

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrxvr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointments");
    app.post('/appointment', (req, res) => {
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.post('/appointmentsByDate', (req, res) => {
        const date = req.body;
        console.log(date.date);
        appointmentCollection.find({date: date})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
});

app.listen(process.env.PORT || port, () => {
    console.log("SERVER HAS STARTED!!!");
})