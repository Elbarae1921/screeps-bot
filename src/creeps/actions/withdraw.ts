import { ALLOW_WITHDRAW_FROM_SPAWN, oppositeDirection } from 'helpers/common';

export const withdraw = (creep: Creep, resource: ResourceConstant, amount: number) => {
    const withdrawableStructures = creep.room
        .find(FIND_STRUCTURES)
        .filter((s: any) => !!s.store)
        .filter((s: any) => s.store.getUsedCapacity(resource) > 0);

    // prioritize withdrawal from containers
    const containers = withdrawableStructures.filter(s => s.structureType === 'container');

    if (containers.length > 0) {
        const target = creep.pos.findClosestByPath(containers, {
            ignoreCreeps: true
        });

        if (target) {
            const result = creep.withdraw(target, resource, amount);

            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                creep.move(oppositeDirection(creep.pos.getDirectionTo(target)));
            }
        }
    } else if (ALLOW_WITHDRAW_FROM_SPAWN(creep.room)) {
        const spawns = withdrawableStructures.filter(s => s.structureType === 'spawn');

        const target = creep.pos.findClosestByPath(spawns, {
            ignoreCreeps: true
        });

        if (target) {
            const result = creep.withdraw(target, resource, amount);

            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                creep.move(oppositeDirection(creep.pos.getDirectionTo(target)));
            }
        }
    }
};
