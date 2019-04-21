module.exports = {
    run: function(creep){
        const inventory = _.sum(creep.carry);

        if(creep.memory.working === true){
            if(inventory === 0){
                creep.memory.working = false;
            }else{
                //Transfer energy to structure
                const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => {
                    if(s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN){
                        return (s.energyCapacity - s.energy) > 0
                    }
                    return false;
                }});
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
        }else{
            if(creep.carryCapacity <= inventory){
                //Creep full inventory
                creep.memory.working = true;
            }else{
                //Sweep resources
                let targets = creep.room.find(FIND_DROPPED_RESOURCES);
                if(targets.length) {
                    creep.moveTo(targets[0]);
                    creep.pickup(targets[0]);
                    return;
                }
                targets = creep.room.find(FIND_TOMBSTONES);
                if(targets.length) {
                    creep.moveTo(targets[0]);
                    creep.withdraw(targets[0], RESOURCES_ALL);
                }
            }
        }
    }
}