module.exports = {
    run: function(creep){
        const inventory = _.sum(creep.carry);
        
        if(creep.memory.working === true){
            if(inventory === 0){
                creep.memory.working = false;
            }else{
                //Build
                const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(creep.build(target) === ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }else if(target === null){
                    //Recycle me
                    const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
                    if(spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE){
                        creep.moveTo(spawn);
                    }
                }
            }
        }else{
            if(creep.carryCapacity <= inventory){
                //Creep full inventory
                creep.memory.working = true;
            }else{
                //Gather resources
                const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if(source !== null && creep.harvest(source) === ERR_NOT_IN_RANGE){
                    creep.moveTo(source);
                }
            }
        }
    }
}