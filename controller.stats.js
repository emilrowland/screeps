module.exports = {
    run: function(){
        const startCpu = Game.cpu.getUsed();
        //Update stats
        for(let roomName in Game.rooms){
            const room = Game.rooms[roomName];
            //Define memory structure
            if(Memory.rooms[roomName] === undefined){
                Memory.rooms[roomName] = {sources: {}};
                const roomMemory = Memory.rooms[roomName];
                for(let source of room.find(FIND_SOURCES)){
                    console.log(source.id);
                    if(roomMemory.sources[source.id] === undefined){
                        roomMemory.sources[source.id] = 0;
                    }
                }
            }
            const roomMemory = Memory.rooms[roomName];

            //Calc workers at sources
            const counts = Object.keys(Memory.creeps).reduce((p, c) => {
                const source = Memory.creeps[c].source
                if(source !== undefined){
                    if (!p.hasOwnProperty(source)) {
                        p[source] = 0;
                    }
                    p[source]++;
                }
                return p;
              }, {});
            for(let source in counts){
                roomMemory.sources[source] = counts[source];
            }
            //Calc roles
        }
        

        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log('Controller.stats has used ' + elapsed.toFixed(2) + ' CPU time');
    }
};