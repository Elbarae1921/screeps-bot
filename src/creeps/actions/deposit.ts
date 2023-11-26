import { getWithdrawableOrStorableStructures } from 'helpers/common';
import { StorableOrWithdrawableStructure } from 'types';

const transfer = (
    creep: Creep,
    target: StorableOrWithdrawableStructure,
    resource: ResourceConstant
) => {
    if (creep.transfer(target, resource) == ERR_NOT_IN_RANGE) {
        return creep.moveTo(target);
    }
};

const getClosestTarget = (creep: Creep, structures: StorableOrWithdrawableStructure[]) => {
    return creep.pos.findClosestByPath(structures, {
        ignoreCreeps: true
    });
};

export const deposit = (creep: Creep, resource: ResourceConstant) => {
    const storableStructures = getWithdrawableOrStorableStructures(creep.room);

    let target: StorableOrWithdrawableStructure | null = null;

    // ordered by priority

    const spawns = storableStructures.filter(s => s.structureType == STRUCTURE_SPAWN);
    target = getClosestTarget(creep, spawns);
    if (!target) {
        const extensions = storableStructures.filter(s => s.structureType == STRUCTURE_EXTENSION);
        target = getClosestTarget(creep, extensions);
    }

    if (!target) {
        const containers = storableStructures.filter(s => s.structureType == STRUCTURE_CONTAINER);
        target = getClosestTarget(creep, containers);
    }

    if (!target) {
        const storages = storableStructures.filter(s => s.structureType == STRUCTURE_STORAGE);
        target = getClosestTarget(creep, storages);
    }

    if (target) {
        return transfer(creep, target, resource);
    }
};
