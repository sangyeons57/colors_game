"use strict"

const socket = io();

socket.emit("ConnectedToApp")
socket.on("checkConnectApp", ()=>{ console.log("connected") })


let ID = socket.id;

const getID_interval=setInterval(() => {
	ID = socket.id
	if (ID != undefined){
		socket.emit('player_id', ID)
		clearInterval(getID_interval)
	}
}, 500);	



// ---- reset function ----

let screenOption = reset_screenSize()

function reset_canvas(canvas) {
	console.log(canavas);
}
/**
 * return [x size, y size, x canvas size, y canvas size]
 */
function reset_screenSize(){
	const x = window.innerWidth || document.documentElement.clientWidth ||document.getElementsByTagName('body')[0].clientWidth
	const y = window.innerHeight || document.documentElement.clientHeight ||document.getElementsByTagName('body')[0].clientHeight
	
	// x, y, 비율 가로: 세로 ex) 2.3 : 1
	//screenOption = [x,y, x * 3 > y * 4 ? (y / 3 * 4) : x , x * 3 > y * 4 ? y : (x / 4 * 3) ]
	return [x, x * 3 > y * 4 ? (y / 3 * 4) : x ,y, x * 3 > y * 4 ? y : (x / 4 * 3) ]
}

/**
 *  [start x,end x, start y, end y , size x , size y]
 */
let screenBenchMark = reset_benchmark()
let block =  reset_block()


/** 
 * return(x1,x2,y1,y2)
*/
function reset_benchmark(){
	let screen_sz = reset_screenSize()
	return [
	 (screen_sz[0] - screen_sz[1]) / 2, (screen_sz[0] + screen_sz[1]) / 2,
	 (screen_sz[2] - screen_sz[3]) / 2, (screen_sz[2] + screen_sz[3]) / 2,
	 screen_sz[1]  , screen_sz[3]
	]
}

function reset_block(){
	let benchmark_size = reset_benchmark()

	return {x: benchmark_size[4] / 400, y: benchmark_size[5] / 300}
}

let player_postion = reset_player_postion()
function reset_player_postion() {
	let screen_sz = reset_screenSize()
	return {x: screen_sz[2] / 2 , y: screen_sz[3] / 2}
}


//---- reset function -----



class Game_playing extends Phaser.Scene{

	constructor(){
		super();

		this.playername = ""
		this.isNicknameinput
		this.isSetting = false
		this.playerskill_key ={
			"attack_type1": 'q',
			"attack_type2": 'w',
			"attack_type3": 'e',
			"special_skill": 'r',
			"defense": 'a',
			"dash": ' '
		}
	}

	preload(){
		this.load.image('background_gray1','asset/background_gray1.png')
	}

	create(){
		this.input_NickName()


		let movespped = 0

		window.addEventListener('resize', (e) => {
			screenOption = reset_screenSize()
			screenBenchMark = reset_benchmark()
			block = reset_block()

			game.scale.resize(screenOption[0], screenOption[2])

		})

let pointer = 0
let iscalledbackground = false

setInterval(() => { if (this.isNicknameinput){
	if(!iscalledbackground){
		let background = this.add.image( screenBenchMark[0] + (screenBenchMark[4] / 2) , screenBenchMark[2] + (screenBenchMark[5] / 2), 'background_gray1').setScale(block.x)
		iscalledbackground = true
		window.addEventListener('resize', (e)=>{
			console.log(123);
			background.x = screenBenchMark[0] + (screenBenchMark[4] / 2) 
			background.y = screenBenchMark[2] + (screenBenchMark[5] / 2)
			background.scale = block.x
		})
	}

	if (!this.isSetting){
		const keycodes = [
			"attack_type1",
			"attack_type2",
			"attack_type3",
			"special_skill",
			"defense",
			"dash"
		]
		const not_use_key =[ "ArrowRight" ,"ArrowRight","ArrowUp","ArrowDown"]

		let setting_text = this.setting_text_f(pointer,keycodes)
		document.addEventListener("keydown", (e)=>{
			if (!not_use_key.includes(e.key) ){
				setting_text.destroy()
				this.playerskill_key[keycodes[pointer]] = e.key


				pointer +=1
				if (pointer > 6){
					document.removeEventListener("keyup")
					this.isSetting = true
				} else {
					setting_text = this.setting_text_f(pointer,keycodes)
				}
			} else {}
		})
		window.addEventListener('resize',(e)=>{
			setting_text.destroy()
		})

	}

	if (this.isSetting){
		console.log(this.playerskill_key);
	}

}},1000)

}

setting_text_f(pointer, keycodes){
	let width = (screenOption[0] / 2) - block.x * 15 * keycodes[pointer].length
	let height = (screenOption[2] / 2) - (block.y * 20)

	return this.add.text(width, height, `Press the key you want to use with '${keycodes[pointer]}'`,{
		font: `${block.x* 12}px`,
		fill: '#F0F8FF',
		align: 'center'
	})
}

	update(){

	}


	User_Input(attack_type1_key, attack_type2_key, attack_type3_key, special_skill_key, defense_key, dash_key){

		let see_right = false
		let see_left = false
		let jump = false
		let down = false

		let attack_type1 = false
		let attack_type2 = false
		let attack_type3 = false
		let special_skill = false
		let defense = false
		let dash = false

		document.addEventListener("keydown",(e)=>{
			if(e.key === "ArrowRight"){
				see_right = true
			} else if(e.key === "ArrowRight"){
				see_left = true;
			}

			if (e.key === "ArrowUp"){
				jump = true
			} else if (e.key === "ArrowDown"){
				down = true
			}

			if ( e.key === attack_type1_key){
				attack_type1 = true
			}
			if ( e.key === attack_type2_key){
				attack_type2 = true
			}
			if ( e.key === attack_type3_key){
				attack_type3 = true
			}
			if ( e.key === special_skill_key){
				special_skill = true
			}
			if ( e.key === defense_key){
				defense = true
			}
			if ( e.key === dash_key){
				dash = true
			}

			this.move([see_right,see_left, jump, down], [attack_type1,attack_type2,attack_type3,special_skill,defense,dash])
		})

		document.addEventListener("keyup",(e)=>{
			if(e.key === "ArrowRight"){
				see_right = false
			} else if(e.key === "ArrowRight"){
				see_left = false
			}

			if (e.key === "ArrowUp"){
				jump = false
			} else if (e.key === "ArrowDown"){
				down = false
			}


			if ( e.key === base_attack_key){
				attack_type1 = false
			}
			if ( e.key === base_attack_key){
				attack_type1 = false
			}
			if ( e.key === special_skill_key){
				special_skill = false
			}
			if ( e.key === defense_key){
				defense = false
			}
			if ( e.key === dash_key){
				dash = false
			}

		})
	}

	move(movedirection, skill){
		let movespped = 0
		let isjumping = false

	}

	jump(){

	}

	command(value){

	}



	input_NickName(){
		//input 만들기
		let use_nickname = "" 
		this.isNicknameinput = false
		let playername_length
		let player_nickname_text
		document.addEventListener('keydown', (e)=> {
			if (this.isNicknameinput !== true) {

				let s = e.key
				if ( (s === ' ' || s === 'Enter') && use_nickname.length > 0){
					this.playername = use_nickname

					this.emit_NickName(use_nickname)
					this.isNicknameinput = true

					player_nickname_text.destroy()
				} else if (e.key === 'Backspace'){
					use_nickname = use_nickname.slice(0,use_nickname.length - 1)
					player_nickname_text.destroy()
				} else if ( s.length === 1 ) {
					use_nickname = use_nickname + s
					if (use_nickname.length > 1){
						player_nickname_text.destroy()
					}
				}

	block = reset_block();
	let width = (screenOption[0] / 2) - block.x * 6 * use_nickname.length
	let height = screenOption[2] / 2

				player_nickname_text = this.add.text(width, height, `${use_nickname}`,{
					font: `${block.x* 20}px`,
					fill: '#F0F8FF',
					align: 'center'
				})
				if (this.isNicknameinput === true){
					player_nickname_text.destroy()
				}

			} else {
				document.removeEventListener('keydown')
			}
		})

	}


	emit_NickName(nickname){

		socket.emit("getNickName",{"nickname": nickname, "id": ID})
		socket.on("test", (data)=> {console.log(data)})
	}


}

	const config = {
		type: Phaser.AUTO,
		width: screenOption[0],
		height: screenOption[2],
		physics: {
			default: 'arcade',
			arcade: { debug: false }
		},
		scene: [Game_playing]
	}

	let game = new Phaser.Game(config);

