import { PRIORITY_BUILDS, PRIORITY_REPAIRS } from 'helpers/constants';
import { withdraw } from 'creeps/actions/withdraw';
import {
    getConstructionSites,
    getCreepsArray,
    getObjectById,
    getStructuresToBeRepaired
} from 'helpers/common';
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
): [Structure, number] => {
    const repairablesWithHigherPriority = getStructuresToBeRepaired(creep.room).filter(
        structure =>
            PRIORITY_REPAIRS[structure.structureType] >
            PRIORITY_REPAIRS[(target as Structure).structureType]
    );
    if (repairablesWithHigherPriority.length) {
        if (!repairablesWithHigherPriority[repairIndex]) repairIndex = 0;
        target = repairablesWithHigherPriority[repairIndex];
        creep.memory.target = target.id;
    }
    return [target, repairIndex];
};

const getHigherPriorityConstructionSitesIfAny = (
    creep: Creep,
    target: ConstructionSite,
    buildIndex: number
): [ConstructionSite, number] => {
    const constructionSitesOfHigherPriority = getConstructionSites(creep.room).filter(
        s =>
            PRIORITY_BUILDS[s.structureType] >
            PRIORITY_REPAIRS[(target as ConstructionSite).structureType]
    );
    if (constructionSitesOfHigherPriority.length) {
        if (!constructionSitesOfHigherPriority[buildIndex]) buildIndex = 0;
        target = constructionSitesOfHigherPriority[buildIndex];
        creep.memory.target = target.id;
    }
    return [target, buildIndex];
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
            let target = getObjectById(creep.memory.target);
            if (target) {
                if (isStructure(target)) {
                    if (target.hits === target.hitsMax) {
                        creep.memory.target = undefined;
                        continue;
                    }
                    const [newTarget, newRepairIndex] = getHigherPriorityRepairablesIfAny(
                        creep,
                        target,
                        repairIndex
                    );
                    target = newTarget;
                    repairIndex = newRepairIndex;
                    repair(creep, target);
                    if (
                        !PRIORITY_REPAIRS[target.structureType] ||
                        PRIORITY_REPAIRS[target.structureType] < i + 1
                    )
                        repairIndex++;
                    continue;
                } else if (isConstructionSite(target)) {
                    // drop construction if there are structures to be repaired
                    if (getStructuresToBeRepaired(creep.room).length) {
                        creep.memory.target = undefined;
                        continue;
                    }
                    const [newTarget, newBuildIndex] = getHigherPriorityConstructionSitesIfAny(
                        creep,
                        target,
                        buildIndex
                    );
                    target = newTarget;
                    buildIndex = newBuildIndex;
                    build(creep, target);
                    if (
                        !PRIORITY_BUILDS[target.structureType] ||
                        PRIORITY_BUILDS[target.structureType] < i + 1
                    )
                        buildIndex++;
                    continue;
                } else {
                    // not a structure nor a construction site
                    creep.memory.target = undefined;
                    break;
                }
            } else {
                // repairs first
                const structuresToBeRepaired = getStructuresToBeRepaired(creep.room);
                if (structuresToBeRepaired.length) {
                    if (!structuresToBeRepaired[repairIndex]) repairIndex = 0;
                    const structure = structuresToBeRepaired[repairIndex];
                    creep.memory.target = structure.id;
                    repair(creep, structure);
                    if (
                        !PRIORITY_REPAIRS[structure.structureType] ||
                        PRIORITY_REPAIRS[structure.structureType] > i + 1
                    )
                        repairIndex++;
                    continue;
                }

                const constructionSites = getConstructionSites(creep.room);
                if (constructionSites.length) {
                    if (!constructionSites[buildIndex]) buildIndex = 0;
                    const site = constructionSites[buildIndex];
                    creep.memory.target = site.id;
                    build(creep, site);
                    if (
                        !PRIORITY_BUILDS[site.structureType] ||
                        PRIORITY_BUILDS[site.structureType] > i + 1
                    )
                        buildIndex++;
                    continue;
                }
            }
            break;
        } else {
            if (creep.memory.shouldMine) {
                temporaryMining(creep);
            } else {
                withdraw(creep, RESOURCE_ENERGY);
            }
        }
    }
};
