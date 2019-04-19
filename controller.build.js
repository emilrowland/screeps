RoomPosition.prototype.findWalkableOnRange = function(range){
    const res = [];
    //Search in range
    const terrain = new Room.Terrain(this.roomName);
    for(let x = -range; x <= range; x++){
        for(let y = -range; y <= range; y++){
            if(x === 0 && y === 0){
                continue;
            }
            if((x !== range && x !== -range) && (y !== range && y !== -range)){
                continue;
            }
            if(terrain.get(this.x + x, this.y + y) === 1){
                continue;
            }
            //console.log('x: ' + x + ' y: ' + y);
            const pos = new RoomPosition(this.x + x, this.y + y, this.roomName);
            res.push(pos);
        }
    }
    return res;
};

module.exports = {
    run: function(){
        const startCpu = Game.cpu.getUsed();
        for(let spawnName in Game.spawns){
            const spawn = Game.spawns[spawnName];
            buildRoads(spawn);
        }
        for(let roomName in Game.rooms){
            const room = Game.rooms[roomName];
            if(room.controller.my){
                buildContainers(room);
            }
        }
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log('Controller.build has used ' + elapsed.toFixed(2) + ' CPU time');
    }
}

function buildRoads(spawn){
    const sources = spawn.room.find(FIND_SOURCES);
    sources.push(spawn.room.controller);
    for(let source of sources){
        const path = spawn.room.findPath(spawn.pos, source.pos, {ignoreCreeps: true});
        for(let pos of path){
            pos = new RoomPosition(pos.x, pos.y, spawn.room.name);
            //Don't build on Structures or sources
            if(pos.look().find((p) => [LOOK_SOURCES, LOOK_STRUCTURES].includes(p.type)) === undefined){
                spawn.room.createConstructionSite(pos, STRUCTURE_ROAD);
            }
        }
    }
}

function buildContainers(room){
    //Place containers at source
    const sources = room.find(FIND_SOURCES);
    for(let source of sources){
        if(source.pos.findInRange(FIND_STRUCTURES, 2, {filter: { structureType: STRUCTURE_CONTAINER }}).length > 0){
            continue;
        }
        const validBuildPos = source.pos.findWalkableOnRange(2);
        const pos = room.find(FIND_MY_SPAWNS)[0].pos.findClosestByPath(validBuildPos, {ignoreCreeps: true});
        room.createConstructionSite(pos, STRUCTURE_CONTAINER);
    }
}