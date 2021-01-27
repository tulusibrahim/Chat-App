'use strict';
//biar bisa diakses dr device lain ganti localhost sm current ip
//let socket = io.connect('http://' + '192.168.100.5' + ':3001')
let socket = io()
let btnsend = document.getElementById('btnsend')
let msgfield = document.getElementById('msg')
let isipesan = document.getElementById('msgvalue')
let roomname = document.getElementById('roomname')
let btnroom = document.getElementById('btnroom')
let usertype = document.getElementById('usertype')
let pplonline = document.getElementById('peoplelist')
let newnameelem = document.getElementById('newname')
let splash = document.getElementById('splash')
let prompwrapper = document.getElementById('prompwrapper')
let promp = document.getElementById('promp')
let nameinput = document.getElementById('nameinput')
let option = document.getElementById('option')
let layover = document.getElementById('layover')
let name


window.onload = function () {
    splash.style.opacity = '1'
    splash.style.zIndex = '2'
    setTimeout(() => {
        splash.style.opacity = '0'
        splash.style.zIndex = '-1'
        prompwrapper.style.opacity = '0.9'
        prompwrapper.style.zIndex = '4'
        nameinput.focus()
    }, 2400);
}

layover.addEventListener('click', function () {
    layover.style.width = '30vw'
    layover.style.opacity = '0'
    layover.style.zIndex = '-1'
    gsap.to('#option', {
        opacity: 1,
        duration: .7
    })
    option.classList.add('fa-bars')
})

option.addEventListener('click', function () {
    if (option.classList.contains('fa-bars')) {
        layover.style.width = '100vw'
        layover.style.opacity = '0.8'
        layover.style.zIndex = '2'
        option.classList.remove('fa-bars')
        gsap.to('#option', {
            opacity: 0,
            duration: .7
        })
    }
})

promp.onsubmit = function (e) {
    e.preventDefault()
    name = nameinput.value
    //ask the user to get their name
    incoming("You joined")

    //send the name to the server
    socket.emit('newuser', name)

    //send the name to server and push to an array in server
    socket.emit('newname', name)

    prompwrapper.style.opacity = '0'
    prompwrapper.style.zIndex = '-1'
}


let usernew = document.createElement('div')
usernew.classList.add('newname')
usernew.style.color = 'white'
pplonline.append(usernew)
socket.on('namefromserver', function (result) {
    let newname = []
    newname = result.join(", ")
    console.log(newname)
    if (newnameelem) {
        newnameelem.remove()
        usernew.innerText = `There's ${newname} here`
    } else {
        usernew.innerText = `There's ${newname} here`
    }
})

//handle the username that just join to display it in the client
socket.on('newuserconnected', function (result) {
    incoming(result + " just joined")
    msgfield.scrollTop = msgfield.scrollHeight;
})

function incoming(namepeople) {
    let usernew = document.createElement('div')
    usernew.classList.add('neww')
    usernew.style.display = 'flex'
    usernew.style.justifyContent = 'center'
    usernew.style.zIndex = '-3'
    usernew.style.height = "fit-content"
    usernew.innerText = namepeople
    msgfield.append(usernew)
}

socket.on('leavename', function (result) {
    usernew.innerText = `There's ${result} here`
})

//handle the user that just leave from the server to display it in client
socket.on('userleave', function (result) {
    leave(result + " just leave")
    msgfield.scrollTop = msgfield.scrollHeight;
})
function leave(namepeople) {
    let userleave = document.createElement('div')
    userleave.classList.add('leave')
    userleave.style.display = 'flex'
    userleave.style.justifyContent = 'center'
    userleave.style.height = "fit-content"
    userleave.innerText = namepeople
    msgfield.append(userleave)
}

//let the other know that someone is typing
isipesan.addEventListener('keyup', function () {
    if (isipesan.value.length == 0) {
        socket.emit('noTyping')
    }
    else if (isipesan.value.length > 0) {
        socket.emit('typing', name)
    }
})

//handle if someone gajadi ngetik/isipesan.value nya 0
socket.on('zerotype', function () {
    usertype.innerText = ''
    msgfield.scrollTop = msgfield.scrollHeight;
})

//handle 'the someone is typing' from server
socket.on('usertyping', function (result) {
    usertype.style.color = "black"
    usertype.innerText = result + " is typing..."
    msgfield.append(usertype)
    msgfield.scrollTop = msgfield.scrollHeight;
})

let counter = 0
function addingmyself(message) {
    counter += 1
    let addnewmsg = document.createElement('div')
    addnewmsg.classList.add('newmsgmyself')
    addnewmsg.setAttribute('id', counter)
    addnewmsg.style.color = 'black'
    addnewmsg.innerText = message
    msgfield.append(addnewmsg)
}

let counterr = 0
//send the msg to the server and server will handle it
btnsend.addEventListener('click', function (e) {
    e.preventDefault()
    counterr += 1
    let date = new Date()
    let mnt = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    socket.emit('msg', isipesan.value)
    addingmyself(`${date.getHours()}:${mnt}      ${isipesan.value}`)
    isipesan.value = ''
    msgfield.scrollTop = msgfield.scrollHeight;
    socket.on('zerotype', function () {
        usertype.innerText = ''
        msgfield.scrollTop = msgfield.scrollHeight;
    })
    let idd = document.getElementById(counterr)
    gsap.from(idd, { duration: .7, opacity: 0, x: '100%', ease: 'bounce.out' })
})

//common function to create new element
function adding(message) {
    counter += 1
    let addnewmsg = document.createElement('div')
    addnewmsg.classList.add('newmsg')
    addnewmsg.setAttribute('id', counter)
    addnewmsg.innerText = message
    addnewmsg.style.color = 'black'
    msgfield.append(addnewmsg)
}

//handle the message that just spread from the server
socket.on('newmsg', function (result) {
    let date = new Date()
    counterr += 1
    let hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
    let mnt = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    adding(`${result.name}: ${result.message}   ${hour.toLocaleString()}:${mnt.toLocaleString()}`)
    let idd = document.getElementById(counterr)
    gsap.from(idd, { duration: .7, opacity: 0, x: '-100%', ease: 'bounce.out' })
    msgfield.scrollTop = msgfield.scrollHeight;
})
