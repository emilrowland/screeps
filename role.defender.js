module.exports = {
    run: function(creep){
        const target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(target !== null){
            if(creep.attack(target) === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }else{
            //Guard
            const pos = creep.memory.guardPos;
            creep.moveTo(pos.x, pos.y);
        }
    }
}