import { allowWithdrawFromSpawn, oppositeDirection } from 'helpers/common';

const isStoreStructure = (structure: AnyStructure): structure is AnyStoreStructure => {
    return !!(structure as AnyStoreStructure).store;
};

export const withdraw = (creep: Creep, resource: ResourceConstant, amount: number) => {
    const withdrawableStructures = creep.room.find(FIND_STRUCTURES).filter(isStoreStructure);

    // prioritize withdrawal from containers
    const containers = withdrawableStructures.filter(
        s => s.structureType === STRUCTURE_CONTAINER
    ) as StructureContainer[];

    if (containers.length > 0) {
        const fullContainers = containers.filter(
            (s: AnyStoreStructure) =>
                (s.store.getUsedCapacity(resource) ?? 0) >= creep.store.getFreeCapacity()
        );
        const target = creep.pos.findClosestByPath(fullContainers, {
            ignoreCreeps: true
        });

        if (target) {
            const result = creep.withdraw(target, resource, amount);

            if (result == ERR_NOT_IN_RANGE) {
                return creep.moveTo(target);
            } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                return creep.move(oppositeDirection(creep.pos.getDirectionTo(target)));
            }
        }
        // only consider withdrawing from spawn if there are no containers (regardless of whether they are full or not)
    } else if (allowWithdrawFromSpawn(creep.room)) {
        const spawns = withdrawableStructures
            .filter(s => s.structureType === 'spawn')
            .filter(s => s.store.getFreeCapacity(resource) === 0);

        if (spawns) {
            const target = creep.pos.findClosestByPath(spawns, {
                ignoreCreeps: true
            });

            if (target) {
                const result = creep.withdraw(target, resource, amount);

                if (result == ERR_NOT_IN_RANGE) {
                    return creep.moveTo(target);
                } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                    return creep.move(oppositeDirection(creep.pos.getDirectionTo(target)));
                }
            }
        }
    }
    // no full structure was found, go mine energy
    // note: this usually shouldn't happen if you have enough containers/storage. But it's here just in case
    creep.memory.shouldMine = true;
};
