const express = require("express");
const SocketIO = require('socket.io').listen(5050, { secure: true }).sockets;
var app = express();

app.get('/data', ((req, res) => {
    res.json('Hello Server')
}))

app.listen('8080', () => console.log('8080 Running'));

SocketIO.on('connection', function (socket) {
    console.log('connected')
    //Disconnect from Server

    socket.emit('fromPassenger', {
        username: "Udara",
        message: "This is a Message from Udara"
    });


    socket.on('disconnect', function () {
        console.log('client disconnect from server');
    });


    socket.on('lookingForPassengers', driverResponse => {

        console.log(driverResponse)
        var driverobj = {
            "driverID": driverResponse.driverID,
            "driverSocketID": driverResponse.driverSocketID,
            "driverVehicleType": driverResponse.driverVehicleType
        }
        driverarray.push(driverobj);
    })

    socket.on('lookingForDrivers', passengerResponse => {

        console.log(passengerResponse);
        var passengerobj = {
            "passengerID": passengerResponse.passengerID,
            "passengerSocketID": passengerResponse.passengerSocketID,
            "startLatitude": passengerResponse.startLatitude,
            "startLongitude": passengerResponse.startLongitude,
            "endLatitude": passengerResponse.endLatitude,
            "endLongitude": passengerResponse.endLongitude
        }

        passengerarray.push(passengerobj);

        // if (driverArray.driverVehicleType === passengerArray.PassengerVehicleType) {

        //     socket.broadcast.to(driverArray[driverArray.length - 1].driverSocketID).emit('ServerToDriver', passengerArray[passengerArray.length - 1]);

        // } else {
        //     console.log('Vehicle Type Mismatch');
        // }

    });

  

    socket.on('driverAccept', driverData => {
        console.log(driverData.passengerSocketID);

        cron.schedule("* * * * * * * * *", function () {
            socket.broadcast.to(driverData.passengerSocketID).emit('fromServer', driverData);

        });

    })


})
