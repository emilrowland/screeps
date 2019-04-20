module.exports = {
    run: function(creep){
        const inventory = _.sum(creep.carry);

        if(creep.memory.working === true){
            if(inventory === 0){
                creep.memory.working = false;
            }else{
                //Transfer energy to spawn
                const spawn = Game.getObjectById(creep.memory.spawn);
                if(creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.moveTo(spawn);
                }
            }
        }else{
            if(creep.carryCapacity <= inventory){
                //Creep full inventory
                creep.memory.working = true;
            }else{
                //Sweep resources
                const targets = creep.room.find(FIND_DROPPED_RESOURCES);
                if(targets.length) {
                    creep.moveTo(targets[0]);
                    creep.pickup(targets[0]);
                }
            }
        }
    }
}