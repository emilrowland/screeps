module.exports = {
    run: function(creep){
        const inventory = _.sum(creep.carry);
        
        if(creep.memory.working === true){
            if(inventory === 0){
                creep.memory.working = false;
            }else{
                //Transfer energy to controller
                const controller = Game.getObjectById(creep.memory.controller);
                if(creep.upgradeController(controller) === ERR_NOT_IN_RANGE){
                    creep.moveTo(controller);
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