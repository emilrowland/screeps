module.exports = {
    run: function(){
        const startCpu = Game.cpu.getUsed();
        //Workers
        for(let creepName in Game.creeps){
            const creep = Game.creeps[creepName];
            const sources = Object.keys(Memory.rooms[creep.room.name].sources).map(key => {return {id: key, num: Memory.rooms[creep.room.name].sources[key]}}).sort((a,b) => a.num - b.num);
            if(creep.memory.role === 'harvester'){
                if(creep.memory.source === undefined || creep.memory.spawn === undefined){
                    creep.memory.source = sources[0].id;
                    creep.memory.spawn = creep.room.find(FIND_MY_SPAWNS)[0].id;
                }
            }else if(creep.memory.role === 'upgrader'){
                if(creep.memory.source === undefined || creep.memory.controller === undefined){
                    creep.memory.source = sources[0].id;
                    creep.memory.controller = creep.room.controller.id;
                }
            }else if(creep.memory.role === 'defender'){
                if(creep.memory.guardPos === undefined){
                    let exits = creep.room.find(FIND_EXIT);
                    exits = exits.filter((p) => {
                        const structures = p.lookFor(LOOK_STRUCTURES);
                        if(structures.length === 0){
                            return true;
                        }
                        return false;
                    });

                    const pos = creep.pos.findClosestByPath(exits);
                    if(pos.x === 0){
                        pos.x = 1;
                    }else if(pos.x === 49){
                        pos.x = 48;
                    }
                    if(pos.y === 0){
                        pos.y = 1;
                    }else if(pos.y === 49){
                        pos.y = 48;
                    }
                    creep.memory.guardPos = pos;
                }
            }
        }
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log('Controller.work has used ' + elapsed.toFixed(2) + ' CPU time');
    }
}