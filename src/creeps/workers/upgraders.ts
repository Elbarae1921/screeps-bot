import { temporaryMining } from 'creeps/actions/temporaryMining';
import { withdraw } from 'creeps/actions/withdraw';
import { getCreepsArray } from 'helpers/common';
import { CreepRole } from 'types';

export const upgradersWorker = () => {
    const upgraderCreeps = getCreepsArray().filter(c => c.memory.role === CreepRole.Upgrader);
    for (const creep of upgraderCreeps) {
        const controller = creep.room.controller;
        if (controller) {
            if (
                (creep.store.getFreeCapacity() <= 0 && creep.memory.shouldMine) ||
                (creep.store.getUsedCapacity() > 0 && !creep.memory.shouldMine)
            ) {
                creep.memory.shouldMine = false;
                if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller, {
                        visualizePathStyle: { stroke: '#ffffff' }
                    });
                }
            } else {
                if (creep.memory.shouldMine) {
                    temporaryMining(creep);
                } else {
                    withdraw(creep, RESOURCE_ENERGY, 50);
                }
            }
        }
    }
};
