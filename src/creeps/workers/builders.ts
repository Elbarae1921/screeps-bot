import { PRIORITY_BUILDS, PRIORITY_REPAIRS } from 'helpers/constants';
import { withdraw } from 'creeps/actions/withdraw';
import { getConstructionSites, getCreepsArray, getStructuresToBeRepaired } from 'helpers/common';
import { temporaryMining } from 'creeps/actions/temporaryMining';

export const buildersWorker = () => {
    const builderCreeps = getCreepsArray().filter(c => c.memory.role === 'builder');
    let buildCount = 0;
    let repairCount = 0;
    for (const creep of builderCreeps) {
        if (
            (creep.store.getFreeCapacity() <= 0 && creep.memory.shouldMine) ||
            (creep.store.getUsedCapacity() > 0 && !creep.memory.shouldMine)
        ) {
            creep.memory.shouldMine = false;
            const constructionSites = getConstructionSites(creep.room);
            if (constructionSites.length) {
                if (!constructionSites[buildCount]) buildCount = 0;
                const site = constructionSites[buildCount];
                if (creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site, {
                        visualizePathStyle: { stroke: '#ffffff' }
                    });
                }
                if (!PRIORITY_BUILDS[site.structureType]) buildCount++;
                continue;
            }
            const structuresToBeRepaired = getStructuresToBeRepaired(creep.room);
            if (structuresToBeRepaired.length) {
                if (!structuresToBeRepaired[repairCount]) repairCount = 0;
                const site = structuresToBeRepaired[repairCount];
                if (creep.repair(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site, {
                        visualizePathStyle: { stroke: '#ffffff' }
                    });
                }
                if (!PRIORITY_REPAIRS[site.structureType]) repairCount++;
                continue;
            }
            break;
        } else {
            if (creep.memory.shouldMine) {
                temporaryMining(creep);
            } else {
                withdraw(creep, RESOURCE_ENERGY, 50);
            }
        }
    }
};
