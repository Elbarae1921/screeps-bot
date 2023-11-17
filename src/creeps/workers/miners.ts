import { mine } from 'creeps/actions/mine';
import { transfer } from 'creeps/actions/transfer';
import { getCreepsArray } from 'helpers/common';

export const minersWorker = () => {
    const minerCreeps = getCreepsArray().filter(c => c.memory.role === 'miner');
    for (const creep of minerCreeps) {
        if (creep.store.getFreeCapacity() > 0) {
            mine(creep);
        } else {
            if (creep.memory.target) delete creep.memory.target;
            transfer(creep, RESOURCE_ENERGY);
        }
    }
};
