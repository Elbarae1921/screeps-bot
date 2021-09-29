import { PRIORITY_BUILDS } from 'helpers/constants';
import { withdraw } from 'creeps/actions/withdraw';
import { getConstructionSites, getCreepsArray } from 'helpers/common';

export const buildersWorker = () => {
    const builderCreeps = getCreepsArray().filter(c => c.memory.role === 'builder');
    let buildCount = 0;
    for (const creep of builderCreeps) {
        if (creep.store.getUsedCapacity() > 0) {
            const constructionSites = getConstructionSites(creep.room);
            // so far only one room, but needs to be changed in the future
            if (constructionSites.length == 0) break;
            if (!constructionSites[buildCount]) buildCount = 0;
            const site = constructionSites[buildCount];
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site);
            }
            if (!PRIORITY_BUILDS[site.structureType]) buildCount++;
        } else {
            withdraw(creep, RESOURCE_ENERGY, 50);
        }
    }
};
