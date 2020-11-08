let express = require('express');       //import express library and put it in a variable
let socket = require('socket.io');      //import socket.io and put it in a variable
let app = express()                     //create new express application
let server = app.listen(process.env.PORT)

app.use(express.static('public'))       //after type localhost://3001, public folder will open which is index.html, etc
let io = socket(server)
let userinfo = {}
let listname = []


io.on('connection', function (socket) {
    console.log("new connection : " + socket.id)


    //handle the 'msg' from client then spread it to every other connected client
    socket.on('msg', function (result) {
        let date = new Date()
        let mnt = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
        //broadcast the message to every client
        socket.broadcast.emit('newmsg', {
            message: result,
            name: userinfo[socket.id],
            hour: date.getHours(),
            minute: mnt
        })
    })

    //handle the emit from the client that someone is typing then broadcast it
    socket.on('typing', function (result) {
        socket.broadcast.emit('usertyping', result)
    })

    //if someone gajadi ngetik
    socket.on('noTyping', function () {
        socket.broadcast.emit('zerotype')
    })

    //handle the username from client and spread it to every other connected client
    socket.on('newuser', function (name) {
        userinfo[socket.id] = name
        socket.broadcast.emit('newuserconnected', name)
        listname.push(name)
        console.log(listname)
        io.emit('namefromserver', listname)
    })

    //broadcast that a user has disconnected
    socket.on('disconnect', function () {
        name = userinfo[socket.id]
        console.log(`${name} just disconnected`)
        socket.broadcast.emit('userleave', name)
        let deletename = listname.indexOf(name)
        if (deletename > -1) {
            listname.splice(deletename, 1)
        }
        io.emit('leavename', listname)
    })
})