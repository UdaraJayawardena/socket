const express = require("express");
const axios = require('axios');
const SocketIO = require('socket.io').listen(5050, { secure: true }).sockets;
const NodeCache = require('node-cache');

let driverarray = [];
let passengerarray = [];

let driverCache = new NodeCache();
let passengerCache = new NodeCache();
var arrNew = [];

SocketIO.on('connection', function (socket) {

    console.log('client connected');


    //Disconnect from Server
    socket.on('disconnect', function () {
        console.log('client disconnect');
    });

    socket.on('lookingForPassengers', driverResponse => {

        var driverobj = {
            "driverID": driverResponse.driverID,
            "driverSocketID": driverResponse.driverSocketID,
            "driverVehicleType": driverResponse.driverVehicleType
        }
        // driverarray.push(driverobj);
        driverCache.set(driverResponse.driverID, driverobj);
        var arr = []

        arr.push(driverCache.get(driverResponse.driverID));
        // console.log(driverarray);

    })

    socket.on('lookingForDrivers', passengerResponse => {

        var passengerobj = {
            "passengerID": passengerResponse.passengerID,
            "passengerSocketID": passengerResponse.passengerSocketID,
            "startLatitude": passengerResponse.startLatitude,
            "startLongitude": passengerResponse.startLongitude,
            "endLatitude": passengerResponse.endLatitude,
            "endLongitude": passengerResponse.endLongitude,
            "passengerVehicleType": passengerResponse.passengerVehicleType,
            "passengerPlaceID": passengerResponse.passengerPlaceID
        }
        // passengerarray.push(passengerobj);

        // console.log(passengerarray);

        //Search Drivers Near to the Passenger
        // this.searchDriver(passengerarray);

        // if (driverarray.driverVehicleType === passengerarray.passengerVehicleType) {
        //     socket.broadcast.to(driverarray[driverarray.length - 1].driverSocketID).emit('ServerToDriver', passengerarray[passengerarray.length - 1]);
        // } else {
        //     console.log('Vehicle Type Mismatch');
        // }

        // passengerArray.push(passengerobj);
        passengerCache.set(passengerResponse.passengerID, passengerobj);

        for (var i = 0; i < driverCache.getStats().keys; ++i) {
            arrNew.push(driverCache.get(i + 1));
        }
        for (var z = 0; z < arrNew.length; z++) {

            socket.broadcast.to(arrNew[z].driverSocketID).emit('ServerToDriver', passengerCache.get(passengerResponse.passengerID));
        }

    });



    socket.on('driverAccept', driverData => {

        // axios.post('http://' + serverConfig.host + ':' + serverConfig.ongoing_trips + '/api/trips', {
        //     "ongoing_trip_id": driverData.ongoing_trip_id,
        //     "driver_id": driverData.driver_id,
        //     "driver_socket_id": driverData.driver_socket_id,
        //     "passenger_id": driverData.passenger_id,
        //     "passenger_socket_id": driverData.passenger_socket_id,
        //     "longitude": driverData.longitude,
        //     "latitude": driverData.latitude,
        //     "date": driverData.currentDate
        // }).then((resss) => {
        // });

        socket.broadcast.to(driverData.passenger_socket_id).emit('fromServer', driverData);
    });

    socket.on('driverReconnect', driverReconnectResponse => {
        axios.get('http://' + '192.168.1.12' + ':' + '3080' + '/api/trips?filter={"where":{"driver_id":"' + driverReconnectResponse.driver_id + '"}}').then((ressDriverData) => {
            socket.broadcast.to(ressDriverData[0].passenger_socket_id).emit('fromServer', ressDriverData);
        })
    })

    socket.on('tripEnd', tripEndData => {
        axios.get('http://' + '192.168.1.12' + ':' + '3080' + '/api/trips?filter={"where":{"ongoing_trip_id":"' + tripEndData.ongoing_trip_id + '"}}').then((ress) => {
            console.log(ress);
        })
    })


});


