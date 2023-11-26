export const deposit = (creep: Creep, resource: ResourceConstant) => {
    const storableStructures = creep.room
        .find(FIND_STRUCTURES)
        .filter((s: any) => !!s.store)
        .filter((s: any) => s.store.getFreeCapacity(resource) > 0);

    // prioritize transferring to spawns
    const spawns = storableStructures.filter(s => s.structureType === 'spawn');

    if (spawns.length > 0) {
        const target = creep.pos.findClosestByPath(spawns, {
            ignoreCreeps: true
        });
        if (target) {
            if (creep.transfer(target, resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    } else {
        // then extensions
        const extensions = storableStructures.filter(s => s.structureType == 'extension');
        if (extensions.length > 0) {
            const target = creep.pos.findClosestByPath(extensions, {
                ignoreCreeps: true
            });
            if (target) {
                if (creep.transfer(target, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            const containers = storableStructures.filter(s => s.structureType == 'container');

            const target = creep.pos.findClosestByPath(containers, {
                ignoreCreeps: true
            });

            if (target) {
                if (creep.transfer(target, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};
