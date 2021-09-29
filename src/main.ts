import { creepWorkers } from 'creeps/workers/index';
import { logCreeps } from 'helpers/log';
import { cleanMemory } from 'helpers/memory';
import { makeCreeps } from 'spawns/actions/makeCreeps';
import { rebuildContainers } from 'spawns/actions/rebuildContainers';

export const loop = () => {
    makeCreeps();
    creepWorkers();
    rebuildContainers();
    cleanMemory();
    logCreeps();
};
