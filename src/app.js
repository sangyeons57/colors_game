"use strict"

const socket = io();

socket.emit("ConnectedToApp")
socket.on("checkConnectApp", ()=>{ console.log("connected") })


let ID = socket.id;

const getID_interval=setInterval(() => {
	ID = socket.id
	console.log(ID)
	if (ID != undefined){
		clearInterval(getID_interval)
	}
}, 500);


console.log(ID);