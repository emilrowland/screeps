const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleDefender = require('role.defender');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');

module.exports = {
    run: function(){
        const startCpu = Game.cpu.getUsed();
        for(let creepName in Game.creeps){
            const creep = Game.creeps[creepName];
            if(creep.memory.role === 'harvester'){
                roleHarvester.run(creep);
            }else if(creep.memory.role === 'upgrader'){
                roleUpgrader.run(creep);
            }else if(creep.memory.role === 'defender'){
                roleDefender.run(creep);
            }else if(creep.memory.role === 'builder'){
                roleBuilder.run(creep);
            }else if(creep.memory.role === 'repairer'){
                roleRepairer.run(creep);
            }
        }
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log('Controller.creeps has used ' + elapsed.toFixed(2) + ' CPU time');
    }
}