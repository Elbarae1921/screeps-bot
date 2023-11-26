import { getObjectById } from 'helpers/common';
import { CreepTarget } from 'types';

const isSource = (val: CreepTarget): val is Source => {
    return (<Source>val).energy !== undefined;
};

export const mine = (creep: Creep) => {
    let target = getObjectById(creep.memory.target);
    if (!target || !isSource(target)) {
        const sources = creep.room.find(FIND_SOURCES);
        const lastSource = getObjectById(Memory.lastSource);
        if (!lastSource) {
            target = sources[0];
        } else {
            target = sources.filter(s => s.id !== lastSource.id)[0];
        }
        Memory.lastSource = target.id;
        creep.memory.target = target.id;
    }
    const result = creep.harvest(target);
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' }
        });
    }
};
