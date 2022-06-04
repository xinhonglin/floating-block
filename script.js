//遊戲音效
var point_audio = new Audio("https://drive.google.com/uc?export=view&id=1beZbtynhtU0lyyaOyFml7hl7BEN3qdTZ")

point_audio.volume = 0.5

var dead_audio = new Audio("https://drive.google.com/uc?export=view&id=1cOGxwcWpw7NXngEHgKxYFFds7RzuFFhY")

var firstTime = true

//類別 - 遊戲物件
var GameObject = function(position,size,selector){
  this.position = position
  this.size = size
  this.$el = $(selector)
  this.$el.css("position","absolute")
  this.updateCSS()
}

//更新遊戲物件(資料->實際的css)
GameObject.prototype.updateCSS = function(){
  
  //更新位置
  this.$el.css("left",this.position.x)
  this.$el.css("top",this.position.y)
  
  //設定大小 - 預設會帶px嗎？
  this.$el.css("width",this.size.width)
  this.$el.css("height",this.size.height)
}

//偵測碰撞
GameObject.prototype.collide = function(otherObject){
  
  //15為加上方塊的寬度
  var inRangeX = otherObject.position.x+15 > this.position.x && otherObject.position.x < this.position.x+this.size.width
  
  //15為加上方塊的高度
  var inRangeY = otherObject.position.y+15 > this.position.y && otherObject.position.y < this.position.y+this.size.height
  return inRangeX && inRangeY
}






//-------[類別] 柱子 -- //繼承遊戲物件
var Tube = function(position,size,selector){
  // this.top = 0
  // this.bottom = 0
  this.timer = null
  GameObject.call(this,position,size,selector)
}
Tube.prototype = Object.create(GameObject.prototype)
Tube.prototype.constructor = Tube.prototype


//柱子 移動func - 待評估是否寫在遊戲迴圈
Tube.prototype.move = function(){
  var _this = this
    this.timer = setInterval(function(){
    if(game.grade<=500){
      _this.position.x -= 1
    }
    else if(game.grade>500&&game.grade<=800){
      _this.position.x -= 1.25
    }
    else if(game.grade>800&&game.grade<=1000){
      _this.position.x -= 1.5
    }
    else if(game.grade>1000&&game.grade<=1500){
      _this.position.x -= 1.75
    }
    else {
      _this.position.x -= 2
    }
    
    tubeT.position.x = _this.position.x
    tubeB.position.x = _this.position.x
    //console.log("tubeT : "+tubeT.position.x+","+tubeT.position.y+" height : "+tubeT.size.height)
    //console.log("tubeB : "+tubeB.position.x+","+tubeB.position.y+" height : "+tubeB.size.height)
    _this.updateCSS()

    if(_this.position.x + _this.size.width < 0){
      //game.grade +=20
      //$(".grade").text(game.grade)
      _this.position.x = 600
      tubeT.position.x = 0
      tubeB.position.x = 0
      _this.randomHeight(tubeT,tubeB)
      
      // if(100%game.grade==0){
      //   point_audio.play()
      // }
    }
  },4)
}

//更新Tube的x數值
Tube.prototype.update = function(){
  this.position.x -=8
}

//柱子更新
// Tube.prototype.update = function(){
//   this.$el.css("top",this.top)
// }

var space = 0

//柱子 隨機長度func 
Tube.prototype.randomHeight = function(tube1,tube2){
  
  //var space = 0
  
  if(game.grade>0 && game.grade<=500){
    space = parseInt(Math.random()*30)+120
  }
  else if(game.grade>500 && game.grade<=1000){
    space = parseInt(Math.random()*40)+80
  }
   else if(game.grade>1000){
    space = parseInt(Math.random()*60)+60
    
  }
  
  
  //柱子最大高度 - 300px(.tubes) - 中間空隙 (60px)  
  var totalHeight = 300-space
  
  //上方柱子 30px - 210px
  var randomTop = parseInt(Math.random()*150)
  
  //下方柱子 240px - ( 30-210px )
  var randomBot = totalHeight-randomTop
  
  tube1.size.height = randomTop
  tube2.size.height = randomBot
  
  // tube1.$el.css("height",randomTop+"px")
  // tube2.$el.css("height",randomBot+"px")
    
  //下方柱子起始位置
  // tube2.$el.css("top",randomTop+60)
  tube2.position.y = 300-randomBot
  
  
  //console.log(random1+","+tube2.position.y)
  tube1.updateCSS()
  tube2.updateCSS()
  //this.updateCSS()
}


//建立柱子物件
var tubes = new Tube(
  {x: 600, y: 0},
  {width: 50, height: 300},
  ".tubes"
)

var tubeT = new Tube(
  {x: 0, y: 0},
  {width: 50, height: 50},
  ".tubeT"
)

var tubeB = new Tube(
  {x: 0, y: 180},
  {width: 50, height: 120},
  ".tubeB"
)
  






//-------[類別] 方塊 -- //繼承遊戲物件

var Square = function(){
  this.size = {width: 15, height: 15}
  this.position = {x: 50, y: 150}
  
  this.velocity = {x: 0, y: 5}
  
  GameObject.call(this,this.position,this.size,".square")
}
Square.prototype = Object.create(GameObject.prototype)
Square.prototype.constructor = Square.prototype


//update func
// Square.prototype.update = function(){
//   this.position.y += this.velocity.y
// }



var square = new Square()



//-------[類別] 遊戲
var Game = function(){
  this.timer = null
  this.timer_grade = null
  this.grade = 0
  this.highGrade = 0
  this.initControl()
  this.control ={}
}

//設置鍵盤控制
Game.prototype.initControl = function(){
  let _this = this
  $(window).keydown(function(evt){
    
    //中括號代表設定屬性值
    _this.control[evt.key] = true
    //console.log(_this.control)
  })
  
  $(window).keyup(function(evt){
    _this.control[evt.key] = false
    //console.log(_this.control)
  }) 
}


//開始遊戲
Game.prototype.startGame = function(){
  this.grade = 0
  tubes.position = {x: 600, y: 0}
  square.position = {x: 50, y: 150}
  $(".grade").text("0")
  $(".scence").css("cursor","none")
  
  
  //顯示最佳分數
  // if(this.highGrade > 0){
  //   $(".high").text("Best : "+this.highGrade)
  // }
  
  //顯示遊戲說明
  $(".des").css("opacity","1")
  
  //變回夜晚設定
  $("body").css("background-color","#222")
  $(".scence").removeClass("day_mode")
  $(".score").removeClass("scoreD")
  $(".square").removeClass("squareD")
  $(".info").removeClass("infoD")
  $(".high").removeClass("highD")
  
  
  if($("button").text()=="Start"){
    $(".infoText").text("Ready")
    $("button").hide()
    var time = 3
    let _this = this
  
  var timer = setInterval(function(){
    $(".infoText").text(time)
    time--
    
    if(time<0){
      clearInterval(timer)
      $(".info").hide()
      _this.startGameMain()
    }
   },1000)
  }
  
  if($("button").text()=="Again"){
    $(".info").hide()
    this.startGameMain()
  }
  
  //倒數3秒
  
}

//遊戲分數計算
Game.prototype.calScore = function(){
  let _this = this
  this.timer_grade = setInterval(function(){
    _this.grade+=1
    $(".grade").text(_this.grade)
    if(_this.grade%100==0){
      point_audio.play()
    }
  },50)
}


//主要遊戲的迴圈
Game.prototype.startGameMain = function(){
  let _this = this
  tubes.move()
  this.calScore()
  this.timer = setInterval(function(){
    if(_this.control[" "]){
      //square.$el.addClass("rotate")
      square.position.y-=5
      
    }      
    else{
      //square.$el.removeClass("rotate")
      square.position.y+=5
    }
    
    if(tubeT.collide(square)){
      //console.log("hit tubeT")
      //console.log("square : "+square.position.x+","+square.position.y)
      _this.endGame()
    }
    
    if(tubeB.collide(square)){
      //console.log("hit tubeB")
      //console.log("square : "+square.position.x+","+square.position.y)
      _this.endGame()
    }
    
    if(square.position.y < 0){
      _this.endGame()
    }
    
    if(square.position.y > 285){
      //clearInterval(_this.timer)
      _this.endGame()
    }
    
    if(_this.grade>=500&&_this.grade<1000){
      $("body").css("background-color","#fff")
      $(".scence").addClass("day_mode")
      $(".score").addClass("scoreD")
      $(".square").addClass("squareD")
      $(".info").addClass("infoD")
      $(".high").addClass("highD")
    }
    
    else if(_this.grade>=1000&&_this.grade<1500){
      $("body").css("background-color","#222")
    $(".scence").removeClass("day_mode")
    $(".score").removeClass("scoreD")
    $(".square").removeClass("squareD")
    $(".info").removeClass("infoD")
    $(".high").removeClass("highD")
    }
    
    else if(_this.grade>=1500){
      $("body").css("background-color","#fff")
      $(".scence").addClass("day_mode")
      $(".score").addClass("scoreD")
      $(".square").addClass("squareD")
      $(".info").addClass("infoD")
      $(".high").addClass("highD")
    }
    
    //console.log(tubeT.position.x+","+tubeT.position.y)
    
    //tubeT.update()
    //tubeB.update()
    square.updateCSS()
    
  },30) 
}




//遊戲結束func
Game.prototype.endGame = function(){
  
  //清除timer
  clearInterval(this.timer)
  clearInterval(tubes.timer)
  clearInterval(this.timer_grade)
  
  //$(".infoText").html("遊戲結束<br>分數："+this.grade)
  $(".infoText").html("遊戲結束")
  $("button").text("Again")
  $(".info").show()
  $("button").show()
  $(".scence").css("cursor","default")
  $(".des").css("opacity","0")
  $(".info").css("background-color","transparent")
  dead_audio.play()
  
  //最高分數更新
  if(this.grade > this.highGrade){
    this.highGrade = this.grade
    $(".high").text("HI "+this.highGrade)
  }
}


var game = new Game()