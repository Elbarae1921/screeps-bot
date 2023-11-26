export type CreepTarget = Source | Structure | ConstructionSite;
export type CreepTargetId = Id<CreepTarget>;

export enum CreepRole {
    Miner = 'miner',
    Builder = 'builder',
    Upgrader = 'upgrader',
    Ravager = 'ravager'
}
