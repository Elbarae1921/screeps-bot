import { creepWorkers } from 'creeps/workers/index';
import { logCreeps } from 'helpers/log';
import { cleanMemory } from 'helpers/memory';
import { spawnCreeps } from 'spawns/actions/spawnCreeps';
import { rebuildStructures } from 'spawns/actions/rebuildStructures';

export const loop = () => {
    spawnCreeps();
    creepWorkers();
    rebuildStructures();
    cleanMemory();
    logCreeps();
};
