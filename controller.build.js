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
                const controllerLevel = room.controller.level;
                if(controllerLevel >= 2){
                    buildExtensions(room);
                    buildContainers(room);
                }
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
        const path = spawn.room.findPath(spawn.pos, source.pos, {ignoreCreeps: true, swampCost: 1});
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
        if(source.pos.findInRange(FIND_STRUCTURES, 1, {filter: { structureType: STRUCTURE_CONTAINER }}).length > 0){
            continue;
        }
        const validBuildPos = source.pos.findWalkableOnRange(1);
        const pos = room.find(FIND_MY_SPAWNS)[0].pos.findClosestByPath(validBuildPos, {ignoreCreeps: true});
        console.log(room.createConstructionSite(pos, STRUCTURE_CONTAINER));
    }
}

function buildExtensions(room){
    let extensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level] - room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const sources = room.find(FIND_SOURCES);
    for(let source of sources){
        let maxBuild = Math.ceil(extensions/sources.length);
        const validBuildPos = source.pos.findWalkableOnRange(3);
        for(let pos of validBuildPos){
            if(pos.lookFor(LOOK_STRUCTURES).length === 0 && pos.lookFor(LOOK_CONSTRUCTION_SITES).length === 0 && pos.x > 3 && pos.x < 47 && pos.y > 3 && pos.y < 47){
                if(maxBuild > 0 && extensions-- > 0){
                    room.createConstructionSite(pos, STRUCTURE_EXTENSION);
                    maxBuild--;
                }
            }
        }
    }
}