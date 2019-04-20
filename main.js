const controllerSpawn = require('controller.spawn');
const controllerBuild = require('controller.build');
const controllerCreeps = require('controller.creeps');
const controllerWork = require('controller.work');
const controllerStats = require('controller.stats');

//Init memory structure
if(Memory.rooms === undefined){
    Memory.rooms = {};
}

module.exports.loop = function () {
    //Clear dead memory
    for(let creepName in Memory.creeps){
        if(Game.creeps[creepName] === undefined){
            delete Memory.creeps[creepName];
        }
    }

    //Update stats
    controllerStats.run();

    //Controll creeps
    controllerWork.run();
    controllerCreeps.run();

    //Build
    if(Memory.timeToBuild >= 0){
        controllerBuild.run();
        Memory.timeToBuild = -10;
    }

    //Spawn new creeps
    controllerSpawn.run();

    //Counters
    Memory.timeToBuild++;
}