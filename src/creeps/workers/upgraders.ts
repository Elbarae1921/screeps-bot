import { withdraw } from 'creeps/actions/withdraw';
import { getCreepsArray } from 'helpers/common';

export const upgradersWorker = () => {
    const upgraderCreeps = getCreepsArray().filter(c => c.memory.role === 'upgrader');
    for (const creep of upgraderCreeps) {
        const controller = creep.room.controller;
        if (controller) {
            if (creep.store.getUsedCapacity() > 0) {
                if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller, {
                        visualizePathStyle: { stroke: '#ffffff' }
                    });
                }
            } else {
                withdraw(creep, RESOURCE_ENERGY, 50);
            }
        }
    }
};
