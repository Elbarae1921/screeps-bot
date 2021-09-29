import { transfer } from 'creeps/actions/transfer';
import { getCreepsArray } from 'helpers/common';

let lastSource: Source;

const isSource = (val: Source | Structure): val is Source => {
    return (<Source>val).energy !== undefined;
};

export const minersWorker = () => {
    const minerCreeps = getCreepsArray().filter(c => c.memory.role === 'miner');
    for (const creep of minerCreeps) {
        if (creep.store.getFreeCapacity() > 0) {
            let target: Source;
            if (creep.memory.target && isSource(creep.memory.target)) {
                target = Game.getObjectById(creep.memory.target.id) || creep.memory.target;
            } else {
                const sources = creep.room.find(FIND_SOURCES);
                if (!lastSource) {
                    target = sources[0];
                } else {
                    target = sources.filter(s => s.id !== lastSource.id)[0];
                }
                lastSource = target;
                creep.memory.target = target;
            }
            const result = creep.harvest(target);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {
                    visualizePathStyle: { stroke: '#ffffff' }
                });
            }
        } else {
            if (creep.memory.target) delete creep.memory.target;
            transfer(creep, RESOURCE_ENERGY);
        }
    }
};
