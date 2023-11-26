import { getRooms } from 'helpers/common';
import { buildCreepBody, creepConfigByRole } from 'helpers/creeps';

export const spawnCreeps = () => {
    const rooms = getRooms();
    for (const room of rooms) {
        for (const role of creepConfigByRole) {
            const requiredCount = role.count(room);
            if (requiredCount === 0) {
                continue;
            }
            const creeps = room.find(FIND_MY_CREEPS).filter(c => c.memory.role === role.role);
            if (creeps.length < requiredCount) {
                const spawns = room.find(FIND_MY_SPAWNS);
                for (const spawn of spawns) {
                    if (!spawn.spawning) {
                        Memory.index = (Memory.index ?? 0) + 1;
                        const body = buildCreepBody(
                            role.maxParts,
                            role.parts,
                            spawn.room.energyAvailable
                        );
                        const result = spawn.spawnCreep(body, `${role.role}_${Memory.index}`, {
                            memory: { role: role.role }
                        });
                        if (result == OK) {
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
};
