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
        return 'actor';
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
        
        if (pos.x < 0){
            return 'wall';
        };
		if (pos.y < 0){
            return 'wall';
        };
		if ((pos.x + size.x) > this.height) return 'wall';
		if ((pos.y + size.y) > this.width) return 'lava';
		for (let x = Math.ceil(pos.x); x <= Math.ceil(pos.x + size.x); x++)
			for (let y = Math.ceil(pos.y); y < Math.ceil(pos.y + size.y); y++) {
				if (this.grid[y][x] === 'wall'){
                    return 'wall';
                };
			};
		for (let x = Math.ceil(pos.x); x <= Math.ceil(pos.x + size.x); x++)
			for (let y = Math.ceil(pos.y); y <= Math.ceil(pos.y + size.y); y++) {
				if (this.grid[y][x] === 'lava'){
                    return 'lava';
                };
		};
		return undefined;		
        
	};
    
    removeActor(actor){
        
    }    
        
        
    
}
    