const express = require('express')
const path = require('path')
const http = require('http')        // 여기까지는 필수
const PORT = process.env.PORT || 5000    //포트번호 변환가능
const socketio = require('socket.io')        //socket.io 실행
//const { userInfo } = require('os')
//const { SSL_OP_NO_TLSv1_1 } = require('constants')
const app = express()                      //experss 함수등등 불러오는 역할
const server = http.createServer(app)      //server 만들기
const io = socketio(server)                //만든server 를 socketio 를 통해 변수에 저장

app.use(express.static(path.join(__dirname, "src")))
server.listen(PORT, ()=> console.log(`server running ${PORT}`))


io.on('connection', (socket) => {

	socket.on('ConnectedToApp', ()=>{ io.emit("checkConnectApp")})

	socket.on('disconnect', ()=>{
		console.log("disconnect")
	})
})