const isSource = (val: Source | Structure): val is Source => {
    return (<Source>val).energy !== undefined;
};

export const mine = (creep: Creep) => {
    let target: Source;
    if (creep.memory.target && isSource(creep.memory.target)) {
        target = Game.getObjectById(creep.memory.target.id) || creep.memory.target;
    } else {
        const sources = creep.room.find(FIND_SOURCES);
        const lastSource = Memory.lastSource;
        if (!lastSource) {
            target = sources[0];
        } else {
            target = sources.filter(s => s.id !== lastSource.id)[0];
        }
        Memory.lastSource = target;
        creep.memory.target = target;
    }
    const result = creep.harvest(target);
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' }
        });
    }
};
