import { CREEP_ROLES_AND_PARTS } from 'helpers/constants';
import { getConstructionSites, getRooms, getUsefulRuins } from 'helpers/common';
import { creepBody } from 'helpers/creeps';

export const makeCreeps = () => {
    const rooms = getRooms();
    for (const room of rooms) {
        for (const role of CREEP_ROLES_AND_PARTS) {
            if (!role.need(getConstructionSites(room), getUsefulRuins(room))) {
                continue;
            }
            const creeps = room.find(FIND_MY_CREEPS).filter(c => c.memory.role === role.role);
            if (creeps.length < role.count) {
                const spawns = room.find(FIND_MY_SPAWNS);
                for (const spawn of spawns) {
                    if (!spawn.spawning) {
                        Memory.index = Memory.index ? Memory.index + 1 : 0;
                        const body = creepBody(
                            role.maxParts,
                            role.parts,
                            spawn.room.energyAvailable
                        );
                        const result = spawn.spawnCreep(body, `${role.role}_${Memory.index}`, {
                            memory: { role: role.role }
                        });
                        if (result == 0) {
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
};
