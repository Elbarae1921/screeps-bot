import { ALLOW_WITHDRAW_FROM_SPAWN, oppositeDirection } from 'helpers/common';

const isStoreStructure = (structure: AnyStructure): structure is AnyStoreStructure => {
    return !!(structure as AnyStoreStructure).store;
};

export const withdraw = (creep: Creep, resource: ResourceConstant, amount: number) => {
    const withdrawableStructures = creep.room
        .find(FIND_STRUCTURES)
        .filter(isStoreStructure)
        .filter(
            (s: AnyStoreStructure) =>
                (s.store.getUsedCapacity(resource) ?? 0) >= creep.store.getFreeCapacity()
        );

    // prioritize withdrawal from containers
    const containers = withdrawableStructures.filter(s => s.structureType === 'container');

    if (containers.length > 0) {
        const target = creep.pos.findClosestByPath(containers, {
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
    } else if (ALLOW_WITHDRAW_FROM_SPAWN(creep.room)) {
        const spawns = withdrawableStructures
            .filter(s => s.structureType === 'spawn')
            .filter(s => (s.store.getUsedCapacity() ?? 0) > creep.store.getFreeCapacity());

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
    // otherwise, go mine energy
    creep.memory.shouldMine = true;
};
