const express = require("express");
const SocketIO = require('socket.io').listen(5050, { secure: true }).sockets;
var app = express();

app.get('/data', ((req, res) => {
    res.json('Hello Server')
}))

app.listen('8080', () => console.log('8080 Running'));

SocketIO.on('connection', function (socket) {
    console.log('connected');



    //Disconnect from Server
    socket.on('disconnect', function () {
        console.log('client disconnect from server');
    });

    socket.on('lookingForPassengers', driverResponse => {
        //driver ID
        //driver Socket ID
        //driver vehicle type
        console.log(driverResponse);
    })

    socket.on('lookingForDrivers', passengerResponse => {
        //passenger ID
        //passenger Socket ID
        //start Lon
        //start lat
        //end lon
        //end lat
        //vehicle type

        console.log(passengerResponse);
    });

    // socket.on('driverAccept', driverAccept => {
    //     //driver Longitude
    //     //driver Latitude
    //     //passengerSocketID
    //     socket.broadcast.to(driverAccept.passengerSocketID).emit('fromDriver', driverAccept);
    // })

})
