const debug_scoreboard = false;
const debug_performance = true;


var incircle = 0;
var inmed = 0;
function play_powerup() {
    document.getElementById('audiotag1').play();
}
function play_powerdown() {
    document.getElementById('audiotag2').play();
}
function play_damage() {
    document.getElementById('audiotag3').play();
}
function play_death() {
    document.getElementById('audiotag4').play();
}
function play_med() {
    document.getElementById('audiotag5').play();
}
function play_slurp() {
    document.getElementById('audiotag6').play();
}
function play_host_death() {
    document.getElementById('audiotag8').play();
}
function play_host_revival() {
    document.getElementById('audiotag9').play();
}
function play_cancer_spawn() {
    document.getElementById('audiotag10').play();
}
function play_click() {
    document.getElementById('audiotag11').play();
}

function play_cancer() {
    if(intensity<1){
	document.getElementById('audiotag7').volume = intensity;
    }
    else{
	document.getElementById('audiotag7').volume = 0;
    }
    document.getElementById('audiotag7').play();
}
function stop_sounds() {
    document.getElementById('audiotag1').pause();
    document.getElementById('audiotag2').pause();
    document.getElementById('audiotag3').pause();
    document.getElementById('audiotag4').pause();
    document.getElementById('audiotag5').pause();
    document.getElementById('audiotag6').pause();
    document.getElementById('audiotag7').pause();
    document.getElementById('audiotag10').pause();
}

stop_sounds();

function tutor() {
    tutorsteps = [false,false,false];
    signDiv.style.display = 'none';
    deathDiv.style.display = 'none';
    gameDiv.style.display = 'none';
    wants = true;
    incircle = 0;
    setTimeout(play, 10);
}
function play_tip() {
    if(disscore){
	document.getElementById('audiotag12').play();
    }
}
function hex_rv(hex) {
    if ((hex.charAt(0) == "#") && (hex.length == 7)) {
	var rv = "#";
	for(var i = 1; i < 7; i++) {
	    var d = parseInt(hex.charAt(i),16);
	    if ((0 <= d) && (d < 16)) {
		d = 15 - d;
		rv = rv + d.toString(16).toUpperCase();
	    } else {
		console.trace("hex_rv: invalid hex color digit d="+d);
		return "#000000";
	    }
	}
	return(rv);
    } else {
	console.trace("hex_rv: invalid input hex="+hex);
	return "#000000";
    }
}
// fast function to decide if point (x2,y2) is inside circle (x,y,r)
function isInside(x,y,r,x2,y2){
    var deltax = (x < x2) ? x2 - x : x - x2;
    if (deltax >= r) { return(false); }
    var deltay = (y < y2) ? y2 - y : y - y2;
    if (deltay >= r) { return(false); }
    return (((deltax * deltax) + (deltay * deltay)) < (r * r));
}
// slow function to calculate distance between two points
function getDistance(x,y,x2,y2) {
    return Math.sqrt(Math.pow(x-x2,2) + Math.pow(y-y2,2));
}
function gettime(){
    var d = new Date();
    return d.getTime();
}

var WIDTH = window.innerWidth;    // width of player window
var HEIGHT = window.innerHeight;

var cell_immune = [0,20,40,80,1000000000,1000000000];
document.getElementById("ctx").width= WIDTH;
document.getElementById("ctx").height= HEIGHT;
var mini = document.getElementById("minimap").getContext("2d");
var socket = null;
var entermed = 0;
var exitmed = 0;
var stage = 4;
var tutorsteps = [false,false,false];
var startti = 0;
var wants = false;
var endti = 0;
var sizeX = 5000;   // width of underlying game map
var sizeY = 5000;
var numcells = 0;
var finalscore = 0;
var ino = true;
var numvirus = 0;
var iradtimer = 0;
var x = 0;
var y = 0;
var intensity = 0;
var mousex = 0;  // x position of mouse relative to canvas (ie player window)
var mousey = 0;
var selfx = 0;   // x position of client canvas center relative to underlying server map
var selfy = 0;
var reset = false;
var medicine = [];
var scores = [];
var names = [];
var resettimer = 100;
var numcancer = 0;
var cancerwaslast = true;
var alerts = ["Enter!","",""];
var tooltips = ["Press enter \u21b5 to cycle through display tips","",""];
var ontip = 0;
var viewtips = ["This is how many viruses you have","This is how many cancer cells there are","This is how many red cells you have infected","This is your resistance to green medicine","This is your resistance to blue medicine","This is your resistance to purple medicine","This is your score",""];
if(Cookies.get('topscore')!==undefined){
    if(Cookies.get('topscore')>0){
	document.getElementById('welcome').style.display = 'inline-block';
	//document.getElemenById('welcomer').style.display = 'inline-block';
	document.getElementById('cookiescore').innerHTML = Number(Cookies.get('topscore')).toLocaleString();
    }
}
//var socket2 = io.connect('localhost:4000');
//alright gang here is the hard part
//servers = ['http://localhost:2000','http://localhost:4000'];
//servers = ['http://localhost:2000'];
//servers = ['https://virusio-test1.herokuapp.com/'];
//server = document.getElementById('serverSelect').value;
//var servers = ['http://glork-usa2.herokuapp.com'];
//var countdown = 0;
//var socket1 = io.connect('http://glork-usa1.herokuapp.com');
//socket1.on();
//.connect('https://localhost:2000');	



//sign
const signDiv = document.getElementById('signDiv');
const deathDiv = document.getElementById('deathDiv');
const signDivUsername = document.getElementById('signDiv-username');
var handle = Cookies.get('name');
if (handle === undefined) { handle = ""; }
signDivUsername.value = handle;
/*
  if(getCookie("wantstips")!== ""){
  var test = getCookie("wantstips");
  var test = test.charAt(0);
  if(test ==="t")
  tipscheck.checked = true;
  else
  tipscheck.checked = false;
  }
  else{
  tipscheck.checked = true;
  }
*/
var signDivSignIn = document.getElementById('signDiv-signIn');
//var signDivSignUp = document.getElementById('signDiv-signUp');
//var signDivPassword = document.getElementById('signDiv-password');

function addtooltip(retardation){
    if(!a3[retardation]){
	a3[retardation] = true;
	alerts.unshift(a1[retardation]);
	tooltips.unshift(a2[retardation]);
	play_tip();
    }
}

signDivSignIn.onclick = function(){
    playp();
}

function playp(){
    disscore = false;
    ontip = 7;
    play();
}

function play(){
    var handle = String(signDivUsername.value);
    Cookies.set('name', handle);
    var e = document.getElementById("serverSelect");
    var myserver = e.options[e.selectedIndex].value;
    document.getElementById("minimap").style.display = "block";

    if (socket) { socket.disconnect(true); socket = null; }

    // note: try to send player name with connection request
    // socket = io.connect(myserver, { query: "name="+encodeURI(handle) });
    socket = io.connect(myserver);
    if (socket === undefined) { return; }

    // issue: why do we need to signin?
    // note: no race condition because each function runs to completion
    socket.emit('signIn', signDivUsername.value);

    // first message we receive on success has our selfId
    socket.on('signInResponse',function(success,myId){
	if(success){
	    console.log(`signInResponse(${success},${myId})`);
	    selfId = myId;
	    signDiv.style.display = 'none';
	    deathDiv.style.display = 'none';
	    gameDiv.style.display = 'inline-block';
	    if(!wants){
		ino = true;
	    } else {
		ino = false;
		selfx = 500;
		selfy = 500;
	    }
//	    main();   //++bug: should we call this async w/ setTimeout(main,0) ?
	    setTimeout(main,0);
	}
    });


    // second message we receive on success is special 'init' package with game state
    socket.on('init', function(data){	
	//{ player: [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}]}
//	if(data.selfId) { selfId = data.selfId; } // set by signInResponse
	let max_i = data.player.length;
	for(let i = 0 ; i < max_i; i++){
	    new Player(data.player[i]);  //++bug: why new?
	}
	max_i = data.cell.length;
	for(i = 0 ; i < max_i; i++){
	    new Cell(data.cell[i]);     //++bug: why new?
	}
    });

    socket.on('update',function(data){
	//{ player : [{id:123,x:0,y:0},{id:1,x:0,y:0}], cell: []}
	//console.log(data);
	let max_i = data.player.length;
	for(let i = 0 ; i < max_i; i++) {
	    let pack = data.player[i];
	    let P = Player.list[pack.id];    //+opt: this lookup may be slow
	    if (P) {
		P.x = pack.x;
		P.y = pack.y;
		P.dmg = pack.immunity;
		if ((P.id == selfId) && (pack.infects !== P.infects)) { counterp = counter+50; }
		P.infects = pack.infects;		
		P.avg = pack.avg;
	    }
	}
	max_i = data.cell.length;
	for(i = 0; i < max_i; i++){
	    pack = data.cell[i];
	    let B = Cell.list[pack.id];  //+opt: this lookup is slow
	    if (B) {
		B.x = pack.x;
		B.y = pack.y;
		B.create = pack.create;
		B.cells = pack.cells;
		B.size = pack.size;
	    }
	}
    });

    socket.on('remove',function(data){
	//{player:[12323],bullet:[12323,123123]}
	let max_i = data.player.length;
	for(let i = 0 ; i < max_i; i++){
	    delete Player.list[data.player[i]];
	}
	max_i = data.cell.length;
	for(i = 0 ; i < max_i; i++){
	    //delete Cell.list[data.cell[i]];
	    let cell = Cell.list[data.cell[i]];
	    //play_death();
	    if(cell !== undefined){
		if(!cell.type){ cell.prephase = true; }
		else { cell.phase = true; }
	    } else {
		delete Cell.list[self.id];
	    }
	}
    });


    socket.on('medicine', function(data){ medicine = data; });
    //+opt: create and save scoreboard on receipt of scores
    socket.on('scores', function(data){ scorelist = data; });
    socket.on('co', function(data){ if(data){ addtooltip(15); }});
    socket.on('resetall', function(data){ reset = true; });
    socket.on('stage', function(master_stage){
	stage = master_stage;
	// console.log("socken.on(stage," + stage + ") at counter " + counter);
	if(counter>20){
	    switch(stage) {
	    case 1: play_powerup(); break;
	    case 2: play_damage(); break;
	    case 3: play_powerdown(); break;
	    }
	}
    });
    socket.on('death', function(){
	stop_sounds();
	document.getElementById('minimap').style.display = 'none';
	finalscore = Math.round(Player.list[selfId].infects*(((1-Player.list[selfId].dmg[0])*100)*((1-Player.list[selfId].dmg[1])*100))*((1-Player.list[selfId].dmg[2])*100));
	document.getElementById('scored').innerHTML = "Final score: "+finalscore;
	var topscore = Cookies.get('topscore');
	console.log("get topscore = " + topscore);
	var twitterBrag = document.getElementById('twitterBrag');
	if (isNaN(topscore) || (topscore < finalscore)) {
	    Cookies.set('topscore',finalscore);
	    console.log("set topscore = " + Cookies.get('topscore'));
	    document.getElementById('best').style.display = 'inline-block';
	    if (twitterBrag) { twitterBrag.href = `https://twitter.com/share?url=http://glork.io&via=GlorkIOGame&text=New%20personal%20best!%20I%20scored%20${finalscore}%20points%20in%20http://glork.io.%20Can%20you%20do%20better?%20#FightFlu%20#PlayFlu`; }
	} else {
	    document.getElementById('best').style.display = 'none';
	    if (twitterBrag) { twitterBrag.href = `https://twitter.com/share?url=http://glork.io&via=GlorkIOGame&text=I%20scored%20${finalscore}%20points%20in%20http://glork.io.%20Can%20you%20do%20better?%20#FightFlu%20#PlayFlu`; }
	}
	deathDiv.style.display = 'inline-block';
	gameDiv.style.display = 'inline-block';
    });

    document.onkeydown = function(event){
	if (!isNaN(event.keyCode)) {
	    switch(event.keyCode) {
	    case 13:           // enter for display tips
		addtooltip(1);
		play_click();
		ontip++;
		if (ontip === 8) { ontip = 0; }
		break;
	    case 32:           // space to center view on first virus
		tutorsteps[0] = true;
		selfx = Player.list[selfId].x[0];
		selfy = Player.list[selfId].y[0];
		break;
	    case 84:  // t to toggle gameplay tips
		disscore = !disscore;
		if (!disscore) { ontip = 7; }
		break;
	    default:          // SERVER-SIDE DEBUG KEYS
		socket.emit('debugKey', event.keyCode, selfx, selfy);
	    }
	}
    }
}

var scorelist = [];
var radstop = 0;

function drawminimap(){
    mini.save();
    mini.clearRect(0,0,150,150);
    mini.restore();
}

//game

var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

// note: only called from socket.on('init')
var Player = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.x = initPack.x;  // array of virus x positions
    self.y = initPack.y;  // array of virus y positions
    self.dmg = initPack.immunity;
    self.avg = initPack.avg;
    self.color = String(initPack.color);
    self.infects = 0;
    self.introuble = false;
    self.name = initPack.name;
    
    console.log("Player(initPack) id:"+ initPack.id +" color:"+ initPack.color +" name:"+ initPack.name); // ++

    //++OPT: PRE-RENDER PLAYER VIRUS HERE

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++bug: review this code for bugs
    //++warning: this is called for all players! ==> shouldn't refer to global selfId
    self.draw = function(){
	if(!self.id){
	    return;
	}
	if(ino){
	    selfx = Player.list[selfId].x[0];
	    selfy = Player.list[selfId].y[0];
	    ino = false;
	}
	var x = self.x[0] - selfx + WIDTH/2;
	var y = self.y[0] - selfy + HEIGHT/2;
	
	ctx.beginPath();
	ctx.fillStyle = self.color;
	if(self.id === selfId){
	    if(wants){
		if (incircle < self.x.length) {
		    if (self.infects === 0) {
			ctx.globalAlpha = 1;
			ctx.font = 'bold 40px Arial';
			ctx.fillStyle = 'black';
			ctx.fillText("These are your viruses",x-200,y-50);
		    }
		} else {
		    ctx.globalAlpha = 0;
		}
		ctx.globalAlpha = 1;
	    }
	    var x = mousex;
	    var y = mousey;
	    //tutorsteps
	    ctx.beginPath();
	    ctx.arc(x,y,500,0,2*Math.PI);  // draw mouse circle
	    ctx.stroke();
	}
	
	for(var i in self.x){
	    numvirus++;
	    ctx.fillStyle = self.color;
	    mini.fillStyle = self.color;
	    mini.fillRect((self.x[i]/sizeX)*150-2,(self.y[i]/sizeY)*150-2,4,4);
	    var x = self.x[i] - selfx + WIDTH/2;
	    var y = self.y[i] - selfy + HEIGHT/2;
	    
	    //++issue: why do we use selfId instead of self.id?
	    //++bug: Player.list[selfId] may be undefined (then we shouldn't be in this loop)
	    if(medicine[0] !== undefined){
		//+opt: replace getDistance() with isInside()
		if ((getDistance(self.x[i],self.y[i],medicine[0],medicine[1]) < medicine[2]) &&
		    (Player.list[selfId].dmg[medicine[4]] > 0.001)) {
		    self.introuble = true;
		} else {
		    self.introuble = false;
		}
	    } else {
		self.introuble = false;
	    }
	    if(self.introuble){
		if(self.id === selfId){
		    //drawFlu(x,y,8,timer,'red');
		    drawFlu(x,y,8,timer,hex_rv(self.color));
		    inmed++;
		    play_med();
		} else {
		    drawFlu(x,y,8,timer,self.color);
		}
	    } else{
		if((stage ===1)&&(counter%16 <8)){
		    drawFlu(x,y,8,timer,hex_rv(self.color));
		} else {
		    drawFlu(x,y,8,timer,self.color);
		}
		document.getElementById('audiotag5').pause();
	    }
	    ctx.fillStyle = 'black';
	}
    }
    
    Player.list[self.id] = self;
    
    return self;
}

Player.list = {};

function drawMed(){
    if(medicine[1] !== undefined){
	ctx.beginPath();
	mini.beginPath();
	if(medicine[4] === 0){
	    addtooltip(2);
	    ctx.fillStyle = '#39FF14';
	    mini.fillStyle = '#39FF14';
	} else if(medicine[4] === 1){
	    addtooltip(3);
	    ctx.fillStyle = '#00CCFF';
	    mini.fillStyle = '#00CCFF';
	} else if(medicine[4] === 2){
	    addtooltip(4);
	    ctx.fillStyle = '#FF1DCE';
	    mini.fillStyle = '#FF1DCE';
	}
	var x = medicine[0] - selfx + WIDTH/2;
	var y = medicine[1] - selfy + HEIGHT/2;
	ctx.globalAlpha = medicine[3];
	mini.globalAlpha = medicine[3];
	ctx.arc(x,y,medicine[2],0,2*Math.PI);
	mini.arc((medicine[0]/sizeX)*150,(medicine[1]/sizeY)*150,(medicine[2]/sizeX)*150,0,2*Math.PI);
	//mini.fillRect((self.x[i]/sizeX)*150-2,(self.y[i]/sizeY)*150-2,4,4);
	ctx.fill();
	mini.fill();
	ctx.globalAlpha = 1;
	mini.globalAlpha = 1;
	mini.fillStyle = 'black';
    }
}

var Cell = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.x = initPack.x;
    self.y = initPack.y;
    self.size = initPack.size;
    self.create = initPack.create;
    self.type = initPack.type;
    self.cells = initPack.cells;
    self.cancer = initPack.cancer;
    self.eat = null;
    self.mag = null;
    self.phase = false;
    self.phaser = 1;
    self.prephase = false;
    self.prephaser = 2;
    self.lastcells = 0;
    
    self.draw = function(){			
	let cellsp = self.cells;
	numcells++;
	if(self.lastcells !== self.cells){
	    self.lastcells = self.cells;
	    if(!self.type){ play_slurp(); }
	}
	if(self.prephase){
	    //self.cells = 4;
	    self.prephaser -= 0.1;
	    if (!self.type) { self.size = 20*self.cells+25; }
	    if (self.prephaser < 0.1) { self.phase = true; }
	}
	if (self.cancer) { numcancer++; }
	var x = self.x - selfx + WIDTH/2;
	var y = self.y - selfy + HEIGHT/2;
	if (self.type) {
	    if (self.phase) {
		self.phaser -= 0.1;
		if(self.phaser <=0.1){
		    delete Cell.list[self.id];
		    return;
		}
	    }
	    ctx.globalAlpha = self.phaser;
	    if ((self.cells > 0) && (stage === 1) && (counter%16 < 8)) {
		ctx.fillStyle = '#ffc0cb';
		if (self.cancer){ drawCell(x,y,self.size,'#00134C','#3366ff'); }
		else { drawCell(x,y,self.size,'#003F34','#009982'); }
		while(self.cells > 0){
		    drawFlu(x+(self.size/2)-self.cells*(50)+25,y+(self.size/2)-self.cells*(50)+25,10,timer,'green',0);
		    self.cells-=1;
		}
		self.cells = cellsp;
	    } else {
		ctx.fillStyle = '#003f34';
		if (self.cancer){
		    drawCell(x,y,self.size,'#FFECB3','#CC9900'); // render cancer brownish red with brown border
		    mini.beginPath();
		    mini.fillStyle = '#CC9900';
		    mini.arc((self.x/sizeX)*150,(self.y/sizeY)*150,(self.size/sizeX)*300,0,2*Math.PI);  // double life size
		    mini.fill();
		    play_cancer();
		} else {
		    var P = Player.list[selfId];
		    if ((P === undefined) || (P.avg < cell_immune[Math.round(self.size/50)]) || (self.size >= 200) || (self.cells > 0)) {
			drawCell(x,y,self.size,'pink','#FF667D');
		    } else {
			if (self.size === 50) { addtooltip(5); }
			else { addtooltip(14); }
			drawCell(x,y,self.size,'black','#FF667D');
			ctx.beginPath();
			ctx.arc(x,y,self.size,0,2*Math.PI);
			ctx.stroke();
			ctx.lineWidth = 2;
		    }
		}
		while(self.cells > 0){
		    drawFlu(x+(self.size/2)-self.cells*(50)+25,y+(self.size/2)-self.cells*(50)+25,10,timer,'green',0);
		    self.cells-=1;
		}
		self.cells = cellsp;
	    }
	} else {
	    if(self.phase){
		self.phaser -= 0.1;
		if(self.phaser <=0.1){
		    delete Cell.list[self.id];
		    return;
		}
	    }
	    ctx.globalAlpha = self.phaser;
	    drawCell(x,y,self.size*0.8,'gray','white');
	    while(self.cells > 0){
		drawFlu(x+(self.size/2)-self.cells*(24)+5,y+(self.size/2)-self.cells*(24)+5,10,timer,'green',0);
		self.cells-=1;
	    }
	    self.cells = cellsp;
	}
	ctx.globalAlpha = 1;
    }
    Cell.list[self.id] = self;		
    return self;
}
Cell.list = {};


var selfId = null;

var counterp = 100000000;


function updatexy(){
    //+opt: replace getDistance() with isInside()
    if (getDistance(WIDTH/2+8,HEIGHT/2+8,mousex,mousey) < 10) {
	socket.emit('mouse', selfx, selfy);
    } else{
	var x = mousex + selfx - WIDTH/2;
	var y = mousey + selfy - HEIGHT/2;
	socket.emit('mouse', x, y);
    }
}
var timer = 0;
var pulser = 0;
var counter = 0;
var perstats = [0,0,0,0];
const trials = 1000;

var down = false;
function updatePulser(){
    if (pulser > 5) {
	down = true;
    } else if (pulser<-5) {
	pulser += 0.5;
	down = false;
    }
    if (down) {
	pulser -= 0.5;
    } else {
	pulser += 0.5;
    }
}

function main() {
    var startti = gettime();
    mini.clearRect(0,0,150,150);
    drawminimap();
    if(counter === counterp){
	play_death();
    }

    ctx.clearRect(0,0,WIDTH,HEIGHT);
    inmed = 0;
    if(!selfId) { return; } // note: selfId=null before player logs in
    updatePulser();
    
    if (Player.list[selfId] != undefined) {
	selfx = (mousex - WIDTH/2)/20 + selfx;  //(Player.list[selfId].x[0]);
	selfy = (mousey - HEIGHT/2)/20 + selfy;
	if (selfx < WIDTH/2) { selfx = WIDTH/2; } //(Player.list[selfId].x[0]);
	else if (selfx > sizeX - WIDTH/2) { selfx = sizeX - WIDTH/2; }
	if (selfy < HEIGHT/2) { selfy =  HEIGHT/2; } //(Player.list[selfId].x[0]);
	else if (selfy > sizeY - HEIGHT/2) { selfy = sizeY - HEIGHT/2; }
    }
    ctx.fillStyle = 'white';
    ctx.fillRect(x,y,sizeX,sizeY);
    ctx.globalAlpha = intensity;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.globalAlpha = 1;
    
    drawMap();
    drawMed();
    updatexy();

    // note: this MUST occur before the Player.list[i].draw() loop */
    incircle = 0;
    var P = Player.list[selfId];
    if (P !== undefined) {
	var max_i = P.x.length;
	for(var i = 0; i < max_i; i++){
	    //+opt: replace getDistance() with isInside()
	    if (getDistance(selfx+(mousex-WIDTH/2),selfy+(mousey-HEIGHT/2),P.x[i],P.y[i]) < 500) {
		incircle++;
	    } else if (wants) {
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = hex_rv(P.color);
		ctx.beginPath();
		ctx.arc(P.x[i] - selfx + WIDTH/2, P.y[i] - selfy + HEIGHT/2, 40, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fill();
	    }
	}
    }
    ctx.globalAlpha = 1;
    for(var i in Player.list) { Player.list[i].draw(); }
    for(var i in Cell.list) { Cell.list[i].draw(); }
    if(P !== undefined){ drawScoreboard(); }
    
    if(reset){
	document.getElementById('audiotag8').pause();
	play_host_revival();
	ctx.fillStyle = 'white';
	ctx.globalAlpha = resettimer/100; 
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	ctx.fillStyle = 'black'
	ctx.font = '160px ubuntu';
	ctx.fillText("REVIVED!",WIDTH/2-300,HEIGHT/2-20);
	resettimer -=1.5;
	ctx.globalAlpha = 1;
	if(resettimer<=0){
	    reset = false;
	    resettimer = 100;
	}
    }
    if (P != undefined) {
	ctx.beginPath();
	ctx.arc(mousex,mousey,500,0,2*Math.PI);
	ctx.stroke();

	// note: can we move this into loop above?
	if (wants) {
	    ctx.font = 'bold 40px Arial';
	    ctx.fillStyle = 'black';
	    if (!tutorsteps[0]) {
		ctx.fillText("Press SPACE to find your viruses",mousex-300,mousey-50);
	    } else {
		if (incircle < max_i) {
		    ctx.fillText("Keep your viruses inside your mouse circle",mousex-400,mousey-50);
		} else if (inmed > 0) {
		    ctx.fillText("Escape the medicine before it kills you!",mousex-300,mousey-50);
		    if(entermed === 0){ entermed = counter; exitmed = 0; }
		} else if ((inmed === 0) && ((entermed > 0) || (exitmed > 0))){
		    if (exitmed === 0) { exitmed = counter+90; entermed =0; }
		    if (counter < exitmed) { ctx.fillText("What doesn't kill you makes you stronger!",mousex-400,mousey-50); }
		} else if (P.infects === 0) {
		    ctx.fillText("Attack a small red cell until it fills up",mousex-350,mousey-50);
		} else if ((P.infects > 0) && (counter < 300)) {
		    ctx.fillText("Congratulations! You replicated your virus.",mousex-400,mousey-50);
		}
	    }
	}
    }

    
    intensity = (numcancer)/(numvirus+1);
    intensity = Math.pow(intensity,2);
    timer++;
    counter++;
    numcancer = 0;
    numcells = 0;
    numvirus = 0;

    // gather performance statistics
    var deltati = gettime() - startti;
    var delay = (1000/24) - deltati;
    if (delay <= 0) { delay = 0; }
    if (debug_performance) {
	perstats[0] += deltati;
	perstats[1] += deltati * deltati;
	if (deltati > perstats[2]) { perstats[2] = deltati; }
	if (delay <= 0) { perstats[3]++; }
	if (counter%trials === 0) {
	    var mut = perstats[0]/trials;
	    console.log("performance," +
			Math.floor(counter/trials) +","+
			trials +","+
			(Math.round(100*mut)/100) +","+
			(Math.round(100*Math.sqrt((perstats[1]/trials)-(mut*mut)))/100) +","+
			(Math.round(10000*perstats[3]/trials)/10000) +","+
			perstats[2]);
	    perstats = [0,0,0,0];
	}
    }
    setTimeout(main,delay);   // note: setImmediate() not defined in some browsers?
} // main()


//+bug: why don't we use yOffset?
//+bug: why are <xOffset,yOffset> always <0,0>?
function drawGrid(x,y,width,height,slotSize,lineColor,xOffset,yOffset) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.translate(x,y);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    for(var i = 0; i < width || i < height; i += slotSize) {
        ctx.moveTo(0,i);
        ctx.lineTo(width,i);
        ctx.moveTo(i+(xOffset % slotSize),0);
        ctx.lineTo(i+(xOffset % slotSize),height);
    };
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

var drawMap = function(){
    var x = WIDTH/2 - selfx;
    var y = HEIGHT/2 - selfy;
    
    if((counter < radstop) || (stage === 4)) {
	ctx.fillStyle = 'white';
	//ctx.fillRect(x,y,sizeX,sizeY);
	drawGrid(x,y,sizeX,sizeY,50,"#BFBFBF",0,0);
    } else if (stage === 1) {
	ctx.fillStyle = '#070707';
	addtooltip(6);
	ctx.fillRect(x,y,sizeX,sizeY);
	drawGrid(x,y,sizeX,sizeY,50,"#404040",0,0);
    } else {
	ctx.fillStyle = 'white';
	//ctx.fillRect(x,y,sizeX,sizeY);
	drawGrid(x,y,sizeX,sizeY,50,"#BFBFBF",0,0);
    }
}

function drawBox(x,y,width,height){
    ctx.fillStyle = "#FFFF00";
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x,y,height,0.5*Math.PI,-0.5*Math.PI);
    ctx.lineTo(x+width,y-height);
    ctx.arc(x+width,y,height,-0.5*Math.PI,0.5*Math.PI);
    ctx.lineTo(x,y+height);
    ctx.stroke();
    ctx.fill();
    ctx.globalAlpha = 1;
}
var widthsofboxes = [690,750,850,500,500,500,400,0];
var heightsofboxes = [50,50,50,20,20,20,50,0];
var drawScoreboard = function(){
    // GAME TIPS
    if(Player.list[selfId].dmg[0]<0.99){ addtooltip(11); }
    if(Player.list[selfId].dmg[1]<0.99){ addtooltip(12); }
    if(Player.list[selfId].dmg[2]<0.99){ addtooltip(13); }

    // DISPLAY TIPS
    if((ontip < 3)||(ontip === 6)) { ctx.font = "40px Crushed"; var w = 30; }
    else { ctx.font = "20px Crushed"; var w = 15; }
    for(var i = 0; i<ontip; i++){ w += heightsofboxes[i]; }
    if(ontip !== 7){ drawBox(0,w,widthsofboxes[ontip]+50,heightsofboxes[ontip]/2); }
    ctx.fillStyle = "black";
    if ((ontip < 3)||(ontip >= 6)){
	if (ontip !== 7) { ctx.fillText(viewtips[ontip]+" \u21b5",150,w+10); }
	else { ctx.fillText("",150,w+10); }
    } else {
	ctx.fillText(viewtips[ontip]+" ("+Math.round(100*(1-Player.list[selfId].dmg[ontip-3]))+"%) "+"\u21b5",150,w+5);
    }
    var tooltip = "<table style='font-size:30px;text-align:left'>";
    for(var i = 0; i<3; i++) {
	tooltip+="<tr><td><b>"+alerts[i]+"</b></td><td>" + tooltips[i]+"</td><td></tr>";;
    }
    tooltip+="</table>";
    if (disscore) {
	document.getElementById("vvv").innerHTML = tooltip;
    } else {
	document.getElementById("vvv").innerHTML = "";
    }

    // SCOREBOARD
    ctx.fillStyle = 'black';
    ctx.font = "30px Crushed";
    var max_h = 30;
    var max_w = ctx.measureText("Scoreboard").width;
    // first get maximum player name width
    ctx.font = "24px Crushed";
    var max_i = scorelist.length;
    for(var i = 0; i < max_i; i++){
	var P = Player.list[scorelist[i]];
	if (P !== undefined) {
	    var w = ctx.measureText(((P.name).substr(0,15))).width;
	    if (w > max_w) { max_w = w; }
	}
    }
    if (debug_scoreboard) {
	const debug_names = ["GS25",":D","hector","([])","Fabien","x","your mother","Canser","HiDead","treplaysgames21","All Might"];
	var max_di = debug_names.length;  max_di = 8;
	for(var i = 0; i < max_di; i++) {
	    var w = ctx.measureText(debug_names[i].substr(0,15)).width;
	    if (w > max_w) { max_w = w; }
	}
    }
    var max_width = 24 + 48 + max_w + 100;
    var score_x = WIDTH-max_width;
    var score_y = 20 + max_h;
    ctx.font = "30px Crushed";
    ctx.fillText("Scoreboard", score_x, score_y);
    ctx.font = "24px Crushed";
    for(var i = 0; i < max_i; i++){
	var P = Player.list[scorelist[i]];
	if (P !== undefined) {
	    var score = Math.round(P.infects*(((1-P.dmg[0])*100)*((1-P.dmg[1])*100))*((1-P.dmg[2])*100));
	    if (score > 1000000) { score = Math.floor(score/1000000)+"M"; }
	    else if (score > 1000) { score = Math.floor(score/1000)+"K"; }
	    var w = ctx.measureText(score +"").width + 40;
	    var name = (P.name).substr(0,15);
	    score_y += max_h;
	    ctx.fillText((i+1)+".", score_x, score_y, 24);
	    ctx.fillText(name, score_x+24+48, score_y, max_w);
	    ctx.fillText(score, WIDTH-w, score_y);
	    drawFlu(score_x+48,score_y-8,8,0,P.color);
	}
    }
    if (debug_scoreboard) {
	const debug_scores = [214225715, 124883136, 1302682, 438719, 327153, 2267, 313, 309, 276, 80, 19, 0];
	const debug_colors = ["#00FF00","#FF00FF","#00FFFF","#FFFF00","#FF6600","#0000FF","#FF0000","#000000","#FFFFFF","#8800FF","#FF0088","#0088FF"];
	for(var i = 0; i < max_di; i++) {
	    var score = debug_scores[i];
	    if (score > 1000000) { score = Math.floor(score/1000000)+"M"; }
	    else if (score > 1000) { score = Math.floor(score/1000)+"K"; }
	    var w = ctx.measureText(score +"").width + 40;
	    var name = debug_names[i].substr(0,15);
	    score_y += max_h;
	    ctx.fillText((max_i+i+1)+".", score_x, score_y, 24);
	    ctx.fillText(name, score_x+24+48, score_y, max_w);
	    ctx.fillText(score, WIDTH-w, score_y);
	    drawFlu(score_x+48,score_y-8,8,0,debug_colors[i]);
	}
    }
    ctx.globalAlpha = 0.5;

    
    // SCORE OVERLAY
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 1;
    drawFlu(20,30,10,timer,Player.list[selfId].color);
    drawCell(20,130,14,'pink','#FF667D');
    drawCell(20,80,14,'#FFECB3','#CC9900');
    
    ctx.font = '40px Crushed';
    ctx.fillText(Math.round(Player.list[selfId].infects),40,140);
    if(Math.round(Player.list[selfId].infects) ===1){addtooltip(9);}
    //ctx.font = '32px ubuntu';
    ctx.fillText(Math.round(Player.list[selfId].infects*(((1-Player.list[selfId].dmg[0])*100)*((1-Player.list[selfId].dmg[1])*100))*((1-Player.list[selfId].dmg[2])*100)),0,250);
    ctx.font = '30px Crushed';
    //ctx.fillText(Math.round((1-Player.list[selfId].dmg[0])*100)+"%",40,190);
    //ctx.fillText(Math.round((1-Player.list[selfId].dmg[1])*100)+"%",40,240);
    //ctx.fillText(Math.round((1-Player.list[selfId].dmg[2])*100)+"%",40,290);
    ctx.font = '40px Crushed';
    if ((numcancer !== 0) && cancerwaslast) {
	play_cancer_spawn();
	cancerwaslast = false;
    }
    if (!cancerwaslast && (numcancer === 0)) {
	addtooltip(10);
    } else if (numcancer === 0) {
	cancerwaslast = true;
    }
    if (numcancer > 0) { addtooltip(7); }
    var xlen = Player.list[selfId].x;
    ctx.fillText(xlen.length,40,40);
    ctx.fillText(numcancer,40,90);
    ctx.strokeStyle = '#39FF14';
    ctx.strokeRect(0,155,100,20);
    //ctx.strokeStyle = '#00CCFF';
    ctx.strokeStyle = '#00CCFF';
    ctx.strokeRect(0,175,100,20);
    ctx.strokeStyle = '#FF1DCE';
    ctx.strokeRect(0,195,100,20);
    
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#39FF14';
    ctx.fillRect(0,155,100*(1-Player.list[selfId].dmg[0]),20);
    ctx.fillStyle = '#00CCFF';
    ctx.fillRect(0,175,100*(1-Player.list[selfId].dmg[1]),20);
    ctx.fillStyle = '#FF1DCE';
    ctx.fillRect(0,195,100*(1-Player.list[selfId].dmg[2]),20);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'gray';
    //ctx.fillText(1-Player.list[selfId].dmg[2],0,300);
    if(intensity>0.5){
	addtooltip(8);
	if(intensity>1){
	    document.getElementById('audiotag7').pause();
	    play_host_death();
	}
    }
} // drawScoreboard

//++opt: optimize state change eg., strokeStyle
//++bug: why so many ctx.beginPath()
//++bug: where is the ctx.stroke() ?
function drawCell(x,y,size,color1,color2){
    ctx.save();
    ctx.translate(x,y);

    // outside circle
    ctx.beginPath();
    ctx.arc(0,0,size,0,2*Math.PI);
    ctx.fillStyle = color1;
    ctx.fill();

    // inside circle
    ctx.beginPath();
    ctx.arc(0,0,size*(0.9+pulser/200),0,2*Math.PI);
    ctx.fillStyle = color2;
    ctx.fill();

    ctx.restore();
}

//+opt: draw entire flu as one polyline
function drawFlu(x,y,rad,angle,color,opacity){
    var o = (opacity === undefined) ? 0.5 : opacity;
    ctx.save();
    ctx.translate(x,y);
    ctx.fillStyle = color;
    ctx.lineWidth = 3;

    //start of body
    ctx.rotate((angle)*(Math.PI/180));
    ctx.lineCap = "round";
    ctx.beginPath();  // start polyline
    ctx.arc(0,0,rad,0,2*Math.PI);
    ctx.globalAlpha = o;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.moveTo(0,-1*rad);
    ctx.lineTo(0,-1*(rad*1.5));
    ctx.moveTo(0,1*rad);
    ctx.lineTo(0,1*(rad*1.5));
    ctx.moveTo(-1*rad,0);
    ctx.lineTo(-1*(rad*1.5),0);
    ctx.moveTo(1*rad,0);
    ctx.lineTo(1*(rad*1.5),0);
    ctx.rotate((45)*(Math.PI/180));
    ctx.moveTo(0,-1*rad);
    ctx.lineTo(0,-1*(rad*1.5));
    ctx.moveTo(0,1*rad);
    ctx.lineTo(0,1*(rad*1.5));
    ctx.moveTo(-1*rad,0);
    ctx.lineTo(-1*(rad*1.5),0);
    ctx.moveTo(1*rad,0);
    ctx.lineTo(1*(rad*1.5),0);
    ctx.stroke();     // render polyline

    ctx.restore();
}

/*
function drawListeria(x,y,rad,angle,color){
    ctx.save();

    ctx.translate(x,y);
    ctx.lineWidth = 3;
    ctx.rotate((angle)*(Math.PI/180));
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0,0,rad,0,1*Math.PI);
    ctx.lineTo(-1*rad,-2*rad);
    ctx.arc(0,-2*rad,rad,1*Math.PI,2*Math.PI);
    ctx.lineTo(rad,0);
    ctx.stroke();

    ctx.moveTo(0,-3*rad);
    ctx.lineTo(0,-1*(rad*3.5));
    ctx.stroke();
    ctx.moveTo(0,1*rad);
    ctx.lineTo(0,1*(rad*1.5));
    ctx.stroke();

    ctx.moveTo(-1*rad,0);
    ctx.lineTo(-1*(rad*1.5),0);
    ctx.stroke();
    ctx.moveTo(1*rad,0);
    ctx.lineTo(1*(rad*1.5),0);
    ctx.stroke();
    ctx.rotate((45)*(Math.PI/180));
    ctx.moveTo(0,1*rad);
    ctx.lineTo(0,1*(rad*1.5));
    ctx.stroke();
    ctx.moveTo(1*rad,0);
    ctx.lineTo(1*(rad*1.5),0);
    ctx.stroke();
    ctx.rotate((-45)*(Math.PI/180));
    ctx.moveTo(1*rad,-1*rad*1);
    ctx.lineTo(1*(rad*1.5),-1*rad*1);
    ctx.stroke();
    ctx.moveTo(-1*rad,-1*rad*1);
    ctx.lineTo(-1*(rad*1.5),-1*rad*1);
    ctx.stroke();
    ctx.moveTo(0,-3*rad);
    ctx.lineTo(0,-1*(rad*3.5));
    ctx.stroke();
    ctx.moveTo(-1*rad,-2*rad);
    ctx.lineTo(-1*(rad*1.5),-2*rad);
    ctx.stroke();

    ctx.moveTo(1*rad,-2*rad);
    ctx.lineTo(1*(rad*1.5),-2*rad);
    ctx.stroke();

    ctx.moveTo(-0.75*rad,-2.75*rad);
    ctx.lineTo(-1.15*rad,-3.15*rad);
    ctx.stroke();
    ctx.moveTo(0.75*rad,-2.75*rad);
    ctx.lineTo(1.15*rad,-3.15*rad);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.fill();

    ctx.restore();
}
*/

var disscore = true;
var a1 = ["","Infect!","Caution!","Warning!","Danger!","Immune!","Wait!","Cancer!","Death!","Reproduce!","Survivor!","Green!","Blue!","Purple!","Mutate!","Mutate!"];
var a2 = ["","Use your mouse to guide your viruses to infect the red cells.<br>Smaller red cells are easier to infect.",
	  "Unhealthy green anti-viral medicine has spawned!<br>If your viruses survive, they develop green resistance.",
	  "Crippling blue anti-viral medicine has spawned!<br>If your viruses survive, they develop blue resistance.",
	  "Deadly purple anti-viral medicine has spawned!<br>If your viruses survive, they develop purple resistance.",
	  "Red cells with black membranes are now immune to your viruses.<br>Infect a red cell with another player to mutate.",
	  "Infected cells are being irradiated, killing the viruses trapped inside.<br>Wait until radiation ends before infecting.",
	  "Cancer cells have spawned!<br>Find and infect the brown cells to stop the host from dying.",
	  "The host is near death!<br>Destroy the brown cancer cells to stop the host from dying.",
	  "Your viruses have infected a red cell!<br>The cell will release your trapped viruses plus one new one.",
	  "You saved the host by defeating the cancer! \uD83C\uDF97",
	  "Exposure to green medicine has strengthened your viruses.<br>Your score has increased.",
	  "Exposure to blue medicine has strengthened your viruses.<br>Your score has increased.",
	  "Exposure to purple medicine has strengthened your viruses.<br>Your score has increased.",
	  "Many red cells are immune to your viruses.<br>Infect a red cell with another player to mutate.",
	  "Your viruses have exchanged genes! Fewer red cells are immune."];
var a3 = [true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];


// position of mouse relative to document element (ie., browser window or canvas)
document.onmousemove = function(event){
    mousex = event.clientX;
    mousey = event.clientY;
    //console.log("x "+x+" y "+y);
}

window.onresize = function(event){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    document.getElementById("ctx").width = WIDTH;
    document.getElementById("ctx").height = HEIGHT;
}
