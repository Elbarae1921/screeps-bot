const roles = [
    {
        role: 'miner',
        // change this depending on growth
        parts: [WORK, CARRY, MOVE],
        count: 15
    },
    {
        role: 'upgrader',
        parts: [WORK, CARRY, MOVE],
        count: 11
    },
    {
        role: 'builder',
        parts: [WORK, CARRY, MOVE],
        count: 0
    },
    {
        role: 'ravager',
        parts: [CARRY, MOVE],
        count: 0
    }
];
const priorityBuilds: Record<string, number> = {
    container: 5,
    extension: 10
};

const ALLOW_WITHDRAW_FROM_SPAWN = (room: Room) => {
    // return false;
    const creeps = room.find(FIND_MY_CREEPS);
    const miners = creeps.filter(c => c.memory.role === 'miner').length;
    const builders = creeps.filter(c => c.memory.role === 'builder').length;
    const upgraders = creeps.filter(c => c.memory.role === 'upgrader').length;
    return miners > builders + upgraders;
};

const getCreepsArray = () => Object.keys(Game.creeps).map(x => Game.creeps[x]);
const getSpawnsArray = () => Object.keys(Game.spawns).map(x => Game.spawns[x]);
const getRooms = () => Object.keys(Game.rooms).map(x => Game.rooms[x]);

const oppositeDirection = (direction: DirectionConstant) => {
    switch (direction) {
        case TOP:
            return BOTTOM;
        case BOTTOM:
            return TOP;
        case LEFT:
            return RIGHT;
        case RIGHT:
            return LEFT;
        default:
            return BOTTOM;
    }
};

let lastSource: any;

function cleanMemory() {
    if (Memory.creeps) {
        for (const name of Object.keys(Memory.creeps)) {
            const creep = Game.creeps[name];
            if (!creep) {
                delete Memory.creeps[name];
            }
        }
    }
}

// function makeCreeps() {
//     const spawns = getSpawnsArray();
//     for(const spawn of spawns) {
//         const spawnCreeps = spawn.room.find(FIND_MY_CREEPS);
//         for(const role of roles) {
//             const roleCreeps = spawnCreeps.filter(creep => creep.memory.role === role.role);
//             if(roleCreeps.length < role.count) {
//                 Memory.index = Memory.index ? Memory.index + 1 : 0;
//                 const result = spawn.spawnCreep(role.parts, `${role.role}_${Memory.index}`, { memory: { role: role.role }});
//                 break;
//             }
//         }
//     }
// }

function makeCreepsV2() {
    const rooms = getRooms();
    for (const room of rooms) {
        for (const role of roles) {
            const creeps = room
                .find(FIND_MY_CREEPS)
                .filter(c => c.memory.role === role.role);
            if (creeps.length < role.count) {
                const spawns = room.find(FIND_MY_SPAWNS);
                for (const spawn of spawns) {
                    if (!spawn.spawning) {
                        Memory.index = Memory.index ? Memory.index + 1 : 0;
                        const result = spawn.spawnCreep(
                            role.parts,
                            `${role.role}_${Memory.index}`,
                            { memory: { role: role.role } }
                        );
                        if (result == 0) {
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
}

function minersWorker() {
    const minerCreeps = getCreepsArray().filter(c => c.memory.role === 'miner');
    for (const creep of minerCreeps) {
        if (creep.store.getFreeCapacity() > 0) {
            let target: any;
            if (creep.memory.target && creep.memory.target.energy) {
                target = Game.getObjectById(creep.memory.target.id);
            } else {
                const sources = creep.room.find(FIND_SOURCES);
                if (!lastSource) {
                    target = sources[0];
                } else {
                    target = sources.filter(s => s.id !== lastSource.id)[0];
                }
                lastSource = target;
                creep.memory.target = target;
            }
            const result = creep.harvest(target);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {
                    visualizePathStyle: { stroke: '#ffffff' }
                });
            }
        } else {
            if (creep.memory.target) delete creep.memory.target;
            transfer(creep, RESOURCE_ENERGY);
        }
    }
}

function transfer(creep: Creep, resource: ResourceConstant) {
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
        const extensions = storableStructures.filter(
            s => s.structureType == 'extension'
        );
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
            const containers = storableStructures.filter(
                s => s.structureType == 'container'
            );

            const target = creep.pos.findClosestByPath(storableStructures, {
                ignoreCreeps: true
            });

            if (target) {
                if (creep.transfer(target, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
}

function buildersWorker() {
    const builderCreeps = getCreepsArray().filter(
        c => c.memory.role === 'builder'
    );
    let buildCount = 0;
    for (const creep of builderCreeps) {
        if (creep.store.getUsedCapacity() > 0) {
            const constructionSites = creep.room
                .find(FIND_CONSTRUCTION_SITES)
                .sort(
                    (a, b) =>
                        (priorityBuilds[b.structureType] || 0) -
                        (priorityBuilds[a.structureType] || 0)
                );
            // so far only one room, but needs to be changed in the future
            if (constructionSites.length == 0) break;
            if (!constructionSites[buildCount]) buildCount = 0;
            const site = constructionSites[buildCount];
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site);
            }
            if (!priorityBuilds[site.structureType]) buildCount++;
        } else {
            withdraw(creep, RESOURCE_ENERGY, 50);
        }
    }
}

function withdraw(creep: Creep, resource: ResourceConstant, amount: number) {
    const withdrawableStructures = creep.room
        .find(FIND_STRUCTURES)
        .filter((s: any) => !!s.store)
        .filter((s: any) => s.store.getUsedCapacity(resource) > 0);

    // prioritize withdrawal from containers
    const containers = withdrawableStructures.filter(
        s => s.structureType === 'container'
    );

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
        const spawns = withdrawableStructures.filter(
            s => s.structureType === 'spawn'
        );

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
}

function ravagersWorker() {
    const ravagerCreeps = getCreepsArray().filter(
        c => c.memory.role === 'ravager'
    );
    let ruinCount = -1;
    for (const creep of ravagerCreeps) {
        if (creep.store.getFreeCapacity() > 0) {
            const ruins = creep.room
                .find(FIND_RUINS)
                .filter(r => !!r.store)
                .filter(r => r.store.getUsedCapacity() > 0);
            ruinCount++;
            if (!ruins[ruinCount]) ruinCount = 0;
            if (
                creep.withdraw(ruins[ruinCount], RESOURCE_ENERGY) ==
                ERR_NOT_IN_RANGE
            ) {
                creep.moveTo(ruins[ruinCount]);
            }
        } else {
            transfer(creep, RESOURCE_ENERGY);
        }
    }
}

function upgradersWorker() {
    const upgraderCreeps = getCreepsArray().filter(
        c => c.memory.role === 'upgrader'
    );
    for (const creep of upgraderCreeps) {
        const controller = creep.room.controller;
        if (controller) {
            if (creep.store.getUsedCapacity() > 0) {
                if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller, {
                        visualizePathStyle: { stroke: '#ffffff' }
                    });
                }
            } else {
                withdraw(creep, RESOURCE_ENERGY, 50);
            }
        }
    }
}

function rebuildContainers() {
    const rooms = getRooms();
    for (const room of rooms) {
        const ruins = room.find(FIND_RUINS);
        const containerRuins = ruins.filter(
            r => r.structure.structureType === STRUCTURE_CONTAINER
        );
        for (const containerRuin of containerRuins) {
            room.createConstructionSite(containerRuin.pos, STRUCTURE_CONTAINER);
        }
    }
}

function logCreeps() {
    const rooms = Object.keys(Game.rooms).map(r => Game.rooms[r]);
    let html =
        '<table border="1px"><th><td>Room</td><td>Miners</td><td>Builders</td><td>Upgraders</td><td>Ravagers</td></th>';
    for (const room of rooms) {
        html += `<tr>
                    <td></td>
                    <td>${room.name}</td>
                    <td>${
                        room
                            .find(FIND_MY_CREEPS)
                            .filter(c => c.memory.role == 'miner').length
                    }</td>
                    <td>${
                        room
                            .find(FIND_MY_CREEPS)
                            .filter(c => c.memory.role == 'builder').length
                    }</td>
                    <td>${
                        room
                            .find(FIND_MY_CREEPS)
                            .filter(c => c.memory.role == 'upgrader').length
                    }</td>
                    <td>${
                        room
                            .find(FIND_MY_CREEPS)
                            .filter(c => c.memory.role == 'ravager').length
                    }</td>
                </tr>`;
    }
    html += '</table>';
    console.log(html);
}

export const loop = () => {
    // TODO: improve making creeps; make more advanced creepers progressively
    makeCreepsV2();
    minersWorker();
    // TODO: improve buildersWorker (loop through rooms)
    buildersWorker();
    ravagersWorker();
    upgradersWorker();
    rebuildContainers();
    cleanMemory();
    logCreeps();
};
