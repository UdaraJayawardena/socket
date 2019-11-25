const express = require("express");
const router = express.Router();
const axios = require('axios');
const mongo = require('mongodb').MongoClient;
const SocketIO = require('socket.io').listen(4040, { secure: true }).sockets;
const _ = require('lodash');
const NodeCache = require("node-cache");
const driverCache = new NodeCache();
const passengerCache = new NodeCache();

let driverarray = []
let taxiSocket = null;
let PassengerSocket = null;

// mongo.connect('mongodb://127.0.0.1/TaxiAppServer', function (err, db) {

// })


SocketIO.on('connection', function (socket) {
    console.log('connected');

    //Data to Admin
    // socket.on('activevehicles', vehicleData => {
    //     console.log(vehicleData);
    // });

    // //Sending Driver Location to the Passenger
    // socket.on('driverLocation', (driverLocation) => {
    //     console.log(driverLocation);
    //     // PassengerSocket.emit('driverLocation', driverLocation);
    // });

    // //Ger Driver Looking for Passenger
    // socket.on('lookingforPassenger', (driverID) => {
    //     taxiSocket = socket;
    // });


    // ///Socket New Update

    // //Get Driver Data When App is on
    // socket.on('DriverData', (res) => {
    //     res.map((item, index) => {
    //         if (res.driverVehicleType === 'Car') {

    //             var obj = {
    //                 "driverID": item.driverID,
    //                 "driverSocketID": item.driverSocketID,
    //                 'Status': item.status
    //             }
    //             carDriverArray.push(obj);

    //         } else if (res.driverVehicleType === 'Van') {
    //             var obj = {
    //                 "driverID": item.driverID,
    //                 "driverSocketID": item.driverSocketID,
    //                 "Status": item.status
    //             }
    //             vanDriverArray.push(obj)
    //         } else if (res.driverVehicleType === 'Bus') {
    //             var obj = {
    //                 "driverID": item.driverID,
    //                 "driverSocketID": item.driverSocketID,
    //                 "Status": item.status
    //             }
    //             busDriverArray.push(obj)
    //         }

    //     })
    // })

    // //Get Passenger Data When App is On
    // socket.on('PassengerData', (res) => {
    //     res.map((item, index) => {
    //         var objPassenger = {
    //             "PassengerID": item.passengerID,
    //             "passengerSocketID": item.passengerSocketID
    //         }
    //         passengerDataArray.push(objPassenger);
    //     })
    // })

    //Disconnect from Server
    socket.on('disconnect', function () {
        console.log('client disconnect from server');
    });

    socket.on('lookingForPassengers', driverResponse => {
        //driver ID
        //driver Socket ID
        //driver vehicle type


        console.log(driverResponse)
        driverarray.push(driverResponse);
        console.log(driverarray[0].driverSocketID);
    })

    socket.on('lookingForDrivers', passengerResponse => {
        //passenger ID
        //passenger Socket ID
        //start Lon
        //start lat
        //end lon
        //end lat
        //vehicle type

        passengerCache.set("1", passengerResponse)
        console.log(passengerCache.get(1));

        console.log(driverCache.get(1).driverSocketID);
        // console.log(passengerCache.get(1).passengerSocketID);

        // socket.broadcast.to(driverCache.get(1).driverSocketID).emit('fromPassenger', { "Data": passengerCache.get(2) });

        // socket.broadcast.to(passengerDataArray[0].passengerSocketID).emit('fromServer', "You Have Found a Driver");

    });

    // socket.on('driverAccept', driverAccept => {
    //     //driver Longitude
    //     //driver Latitude
    //     //passengerSocketID
    //     socket.broadcast.to(driverAccept.passengerSocketID).emit('fromDriver', driverAccept);
    // })

})

module.exports = router;