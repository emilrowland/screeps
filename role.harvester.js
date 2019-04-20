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
                //Gather resources
                const source = Game.getObjectById(creep.memory.source);
                if(source !== null && creep.harvest(source) === ERR_NOT_IN_RANGE){
                    creep.moveTo(source);
                }
            }
        }
    }
}