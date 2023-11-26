import { transfer } from 'creeps/actions/transfer';
import { getCreepsArray, getUsefulRuins } from 'helpers/common';
import { CreepRole } from 'types';

export const ravagersWorker = () => {
    const ravagerCreeps = getCreepsArray().filter(c => c.memory.role === CreepRole.Ravager);
    let ruinCount = -1;
    for (const creep of ravagerCreeps) {
        if (creep.store.getFreeCapacity() > 0) {
            const ruins = getUsefulRuins(creep.room);
            if (ruins.length) {
                ruinCount++;
                if (!ruins[ruinCount]) ruinCount = 0;
                if (creep.withdraw(ruins[ruinCount], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ruins[ruinCount]);
                    continue;
                }
            }
        }
        transfer(creep, RESOURCE_ENERGY);
    }
};
