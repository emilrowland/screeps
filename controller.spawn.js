module.exports = {
    run: function(){
        const startCpu = Game.cpu.getUsed();
        for(let spawnName in Game.spawns){
            const spawn = Game.spawns[spawnName];
            //Skip if spawning
            if(spawn.spawning !== null){
                continue;
            }
    
            //Roles
            const numOfConstructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES).length;
            const numOfContainers = spawn.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}}).length;

            const roles = {
                harvester: {
                    min: 2,
                    max: 4,
                    body: [WORK, CARRY, MOVE]
                },
                carrier: {
                    min: numOfContainers > 0? 1 : 0,
                    max: numOfContainers,
                    body: [CARRY, CARRY, MOVE]
                },
                upgrader: {
                    min: 1,
                    max: 4,
                    body: [WORK, CARRY, MOVE]
                },
                defender: {
                    min: 1,
                    max: 2,
                    body: [MOVE, ATTACK, ATTACK]
                },
                builder: {
                    min: numOfConstructionSites > 0? 1 : 0,
                    max: numOfConstructionSites > 0? 2 : 0,
                    body: [WORK, CARRY, MOVE]
                },
                repairer: {
                    min: 1,
                    max: 2,
                    body: [WORK, CARRY, MOVE]
                }
            };

            //Count
            const myCreeps = spawn.room.find(FIND_MY_CREEPS);
            for(roleName in roles){
                const role = roles[roleName]
                role.num = _.sum(myCreeps, (c) => c.memory.role === roleName);
                console.log(roleName + ': ' + role.num );
            }
            //Select role
            let spawnRole = undefined;
            let spawnBody = undefined;
            //Min
            for(roleName in roles){
                const role = roles[roleName]
                if(role.num < role.min){
                    spawnRole = roleName;
                    spawnBody = role.body;
                    break;
                }
            }
            if(spawnRole === undefined){
               //Max
                for(roleName in roles){
                    const role = roles[roleName]
                    if(role.num < role.max){
                        spawnRole = roleName;
                        spawnBody = role.body;
                        break;
                    }
                } 
            }    
            //Spawn
            if(spawnRole !== undefined){
                const creepName = spawnRole + '_' + Math.floor(Math.random() * 100);
                const status = spawn.spawnCreep(spawnBody, creepName, {memory: {role: spawnRole, working: false}});
                if(status === OK){
                    console.log(spawnName + ': spawned new ' + spawnRole);
                }else{
                    console.log(spawnName + ': can\'t spawn new ' + spawnRole + ' becuse of error: ' + status);
                }
            }
        }
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log('Controller.spawn has used ' + elapsed.toFixed(2) + ' CPU time');
    }
}