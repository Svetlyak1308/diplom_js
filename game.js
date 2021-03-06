'use strict';
class Vector{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    };
    plus(vector){
        if(!(vector instanceof Vector )){
      throw  new Error ("Можно прибавлять к вектору только вектор типа Vector") ;  
        }
    return new Vector(this.x + vector.x, this.y + vector.y);
    };
    times(factor){
        return new Vector(this.x * factor, this.y *factor)
    }
};
class Actor{
    constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)){
    if(!(pos instanceof Vector)){
        throw new Error ("pos не является объектом типа Vector");
    }
    if(!(size instanceof Vector)){
        throw new Error ("size не является объектом типа Vector");
    }
    if(!(speed instanceof Vector)){
        throw new Error ("speed не является объектом типа Vector");    
    };
        this.pos = pos;
        this.size = size;
        this.speed = speed;
    };
    act(){
        
    };
    get left(){
        return this.pos.x;
    };
    get top(){
        return this.pos.y;
    };
    get  right(){
        return this.pos.x + this.size.x;
    };
    get bottom(){
        return this.pos.y + this.size.y;
    };
    get type(){
        return 'actor';//
    };
    isIntersect(actor){
    if(!(actor instanceof Actor)|| (arguments.length === 0)){
        throw new Error('actor не является объектом типа Actor');
    };
    if(this === actor){
        return false;
    };
    if (this.top >= actor.bottom){
        return false;
    }
    if (this.right <= actor.left){
            return false;
    }
    if (this.left >= actor.right){
            return false;
    }
    if (this.bottom <= actor.top){ 
            return false;
    }
		return true;    
    };
};
class Level{
    constructor(grid = [], actors = []){
        this.grid = grid;
        this.actors = actors;
        for(const actor of actors){
			if(actor.type === 'player'){
				this.player = actor;
				break;
			};
		};
                
        this.height = 0;
        this.width = 0;
        this.status = null;
        if (grid) {
			this.height = grid.length;
			
			for (let width of grid) { 
					if (width === undefined){
                        break;
                    };
					if (this.width <= width.length){
                        this.width = width.length;
                    };
			}; 
		};
        this.finishDelay = 1;
    };
    isFinished(){
        if((this.status !== null)&&(this.finishDelay < 0)){
            return true;
        }else{ 
            return false;
                
        };
            
        };
    actorAt(actor){
        if(!(actor instanceof Actor)||(arguments.length === 0)){
            throw new Error('Аргумента нет либо передан не объект Actor');
        };
        if(this.grid === undefined ){
			 return undefined;
        };
		
		for(let act of this.actors){
			if (actor.isIntersect(act)){
				return act;
            };			
		};
		return undefined;	
        };
    
    obstacleAt(pos, size){
        if((!(pos instanceof Vector))&&(!(size instanceof Vector))){
            throw new Error('Аргументы не являются объектом Vector');
        };
        let xStart = Math.floor(pos.x);
		let xEnd = Math.ceil(pos.x + size.x);
		let yStart = Math.floor(pos.y);
		let yEnd = Math.ceil(pos.y + size.y);

		if (xStart < 0 || xEnd > this.width || yStart < 0) {
			return 'wall';
		}

		if (yEnd > this.height) {
			return 'lava';
		}

		for (let y = yStart; y < yEnd; y++) {
			for (let x = xStart; x < xEnd; x++) {
				const obstacle = this.grid[y][x];
				if (typeof obstacle !== 'undefined') {
					return obstacle;
				}
			}
		}
		return undefined;
	}
	
    removeActor(actor){
		let indexActor = this.actors.indexOf(actor);
		if(indexActor != -1){
			this.actors.splice(indexActor, 1);
		};
	};
    
    noMoreActors(type){
		if(this.actors){
			for(let actor of this.actors){
				if(actor.type === type){
					return false;
				};
			};
		};
		return true;
	};
    playerTouched(type, actor){
		if(this.status != null){
			return;
		};
		
		if(type === 'lava' || type === 'fireball'){
			this.status = 'lost';
		};
		
		if(type === 'coin' && actor.type === 'coin'){
			this.removeActor(actor);
			if(this.noMoreActors('coin')){
				this.status = 'won';
			};
		};
	};
};
class LevelParser{
    constructor(dictionary){
        this.dictionary = dictionary;
    };
    actorFromSymbol(symbol){
        if(typeof symbol === 'undefined'){
            return undefined;
        };
        if(typeof this.dictionary === 'undefined'){
            return undefined;
        };
        return this.dictionary[symbol];
    };
    obstacleFromSymbol(symbol){
		let symbols = { 
            'x': 'wall',
            '!': 'lava' 
        };
		return symbols[symbol];
	};
    
    
	createGrid(plan) {
		return plan.map(line => {
		  let arr = [];
		  for(let i = 0; i < line.length; i++) {
		    arr.push(this.obstacleFromSymbol(line[i]));
		  }
		  return arr;
		});
	};
    createActors(arrStrings){
        const array =[];
        let j = 0;
		
		for(let x = 0; x < arrStrings.length; x++ ){
			const string = arrStrings[x];
			for(let i = 0; i < string.length; i++){
				const symbol = string.charAt(i);
				const actors = this.actorFromSymbol(symbol);
				if(typeof actors === 'function'){
					const actor = new actors();
					if(actor instanceof Actor){
						array[j] = new actors();
						array[j].pos = new Vector(i,x);
						j++;
					};
				};
			};
		};
		
		return array;
	};
    parse(arrStrings){
        return new Level(this.createGrid(arrStrings), this.createActors(arrStrings));
    };
	
};
class Fireball extends Actor{
    constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)){
       super(pos, new Vector(1, 1), speed);
    };
    get type(){
        return 'fireball';
    };
   getNextPosition(time = 1){
       return this.pos.plus(this.speed.times(time));
       
   };
    handleObstacle(){
      this.speed = this.speed.times(-1);  
    };
    act(time, pole =new Level){
       let newPos = this.getNextPosition(time);
        if(pole.obstacleAt(newPos, this.size)){
            this.handleObstacle();
        }else{
            this.pos = newPos;
        };
    };
    
};
class HorizontalFireball extends Fireball{
    constructor(pos = new Vector(0, 0)){
       super(pos,new Vector(2, 0));
        
       };  
    };

class VerticalFireball extends Fireball{
    constructor(pos = new Vector(0, 0)){
        super(pos, new Vector(0,2));
    };
};
class FireRain extends Fireball{
    constructor(pos = new Vector(0, 0)){
        super(pos, new Vector(0,3));
        this.startPos = pos;
    };
    get type(){
		return 'firerain';
	};

	handleObstacle(){
		this.pos = this.startPos;
	};
};

class Coin extends Actor{
    constructor(pos = new Vector(1, 1)){
        super(new Vector(pos.x + 0.2, pos.y + 0.1), new Vector(0.6, 0.6));
        this.startPos = pos;
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.spring = Math.random() * 2 * Math.PI;
    };
    get type(){
        return 'coin';
    };
    updateSpring(time = 1){
        this.spring += this.springSpeed*time;
    };
    getSpringVector(){
        return new Vector(0, Math.sin(this.spring) * this.springDist);
    };
    getNextPosition(time = 1){
		this.updateSpring(time);
		const springVector = this.getSpringVector();
		return new Vector(this.pos.x,this.pos.y + springVector.y*time);
        
	};
    
    act(time){
		this.pos = this.getNextPosition(time);
    
    
};

};
class Player extends Actor{
  constructor(pos = new Vector(0, 0)){
    super(new Vector(pos.x, pos.y - 0.5), new Vector(0.8, 1.5),/* new Vector(0, 0)*/);  
  };
    get type(){
        return 'player';
    };
};
const schemas = [
  [
    '         ',
    '         ',
    '    =    ',
    '       o ',
    '     !xxx',
    ' @       ',
    'xxx!     ',
    '         '
  ],
  [
    '      v  ',
    '    v    ',
    '  v      ',
    '        o',
    '        x',
    '@   x    ',
    'x        ',
    '         '
  ]
];
const actorDict = {
  '@': Player,
  'v': FireRain,
  'o': Coin,
  '=': HorizontalFireball,
  '|': FireRain,
  '!': Lava,
  'x': Wall    
    
};
const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => console.log('Вы выиграли приз!'));




    
    



    
    
    
    
    