import { PRIORITY_BUILDS, PRIORITY_REPAIRS } from 'helpers/constants';
import { withdraw } from 'creeps/actions/withdraw';
import { getConstructionSites, getCreepsArray, getStructuresToBeRepaired } from 'helpers/common';
import { temporaryMining } from 'creeps/actions/temporaryMining';
import { CreepRole, CreepTarget } from 'types';

const isStructure = (val: CreepTarget): val is Structure => {
    return <Structure>val instanceof Structure;
};

const isConstructionSite = (val: CreepTarget): val is ConstructionSite => {
    return <ConstructionSite>val instanceof ConstructionSite;
};

const getHigherPriorityRepairablesIfAny = (
    creep: Creep,
    target: Structure,
    repairIndex: number
) => {
    const repairablesWithHigherPriority = getStructuresToBeRepaired(creep.room).filter(
        structure =>
            PRIORITY_REPAIRS[structure.structureType] >
            PRIORITY_REPAIRS[(target as Structure).structureType]
    );
    if (repairablesWithHigherPriority.length) {
        if (!repairablesWithHigherPriority[repairIndex]) repairIndex = 0;
        target = creep.memory.target = repairablesWithHigherPriority[repairIndex];
    }
    return target;
};

const getHigherPriorityConstructionSitesIfAny = (
    creep: Creep,
    target: ConstructionSite,
    buildIndex: number
) => {
    const constructionSitesOfHigherPriority = getConstructionSites(creep.room).filter(
        s =>
            PRIORITY_BUILDS[s.structureType] >
            PRIORITY_REPAIRS[(target as ConstructionSite).structureType]
    );
    if (constructionSitesOfHigherPriority.length) {
        if (!constructionSitesOfHigherPriority[buildIndex]) buildIndex = 0;
        target = creep.memory.target = constructionSitesOfHigherPriority[buildIndex];
    }
    return target;
};

const repair = (creep: Creep, target: Structure) => {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' }
        });
    }
};

const build = (creep: Creep, target: ConstructionSite) => {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' }
        });
    }
};

export const buildersWorker = () => {
    const builderCreeps = getCreepsArray().filter(c => c.memory.role === CreepRole.Builder);
    let buildIndex = 0;
    let repairIndex = 0;
    for (let i = 0; i < builderCreeps.length; i++) {
        const creep = builderCreeps[i];
        if (
            (creep.store.getFreeCapacity() <= 0 && creep.memory.shouldMine) ||
            (creep.store.getUsedCapacity() > 0 && !creep.memory.shouldMine)
        ) {
            creep.memory.shouldMine = false;
            let target = creep.memory.target?.id
                ? Game.getObjectById(creep.memory.target.id)
                : null;
            if (target) {
                if (isStructure(target)) {
                    if (target.hits === target.hitsMax) {
                        creep.memory.target = undefined;
                        continue;
                    }
                    target = getHigherPriorityRepairablesIfAny(creep, target, repairIndex);
                    repair(creep, target);
                    if (
                        !PRIORITY_REPAIRS[target.structureType] ||
                        PRIORITY_REPAIRS[target.structureType] > i + 1
                    )
                        repairIndex++;
                    continue;
                } else if (isConstructionSite(target)) {
                    target = getHigherPriorityConstructionSitesIfAny(creep, target, buildIndex);
                    build(creep, target);
                    if (
                        !PRIORITY_BUILDS[target.structureType] ||
                        PRIORITY_BUILDS[target.structureType] > i + 1
                    )
                        buildIndex++;
                    continue;
                } else {
                    // not a structure nor a construction site
                    creep.memory.target = undefined;
                    break;
                }
            } else {
                const constructionSites = getConstructionSites(creep.room);
                if (constructionSites.length) {
                    if (!constructionSites[buildIndex]) buildIndex = 0;
                    const site = constructionSites[buildIndex];
                    creep.memory.target = site;
                    build(creep, site);
                    if (
                        !PRIORITY_BUILDS[site.structureType] ||
                        PRIORITY_BUILDS[site.structureType] > i + 1
                    )
                        buildIndex++;
                    continue;
                }

                const structuresToBeRepaired = getStructuresToBeRepaired(creep.room);
                if (structuresToBeRepaired.length) {
                    if (!structuresToBeRepaired[repairIndex]) repairIndex = 0;
                    const structure = structuresToBeRepaired[repairIndex];
                    creep.memory.target = structure;
                    repair(creep, structure);
                    if (
                        !PRIORITY_REPAIRS[structure.structureType] ||
                        PRIORITY_REPAIRS[structure.structureType] > i + 1
                    )
                        repairIndex++;
                    continue;
                }
            }
            break;
        } else {
            if (creep.memory.shouldMine) {
                temporaryMining(creep);
            } else {
                withdraw(creep, RESOURCE_ENERGY, 50);
            }
        }
    }
};
