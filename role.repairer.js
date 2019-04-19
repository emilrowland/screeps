module.exports = {
    run: function(creep){
        const inventory = _.sum(creep.carry);
        
        if(creep.memory.working === true){
            if(inventory === 0){
                creep.memory.working = false;
            }else{
                //Repair
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                targets.sort((a,b) => a.hits - b.hits);
                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }else{
                    //Move away from roads
                    if(creep.pos.lookFor(LOOK_STRUCTURES).length !== 0){
                        creep.move(TOP);
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