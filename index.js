require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require('path');
const bodyParser = require("body-parser");
const { Auth, connection } = require("./common");
const v1Route = require("./v1/route");


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));


app.use("/api/v1", v1Route);


app.use((req, res, next) => res.error(404, "ERROR_NOT_FOUND"));


server.listen(process.env.PORT, async () => {
  //  console.log(`Environment:`, process.env.NODE_ENV);
    console.log(`Running on:`, process.env.PORT);

    await connection.mongodb();
    
});