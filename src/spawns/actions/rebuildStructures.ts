import { getRooms } from 'helpers/common';
import { STRUCTURES_TO_REBUILD } from 'helpers/constants';

export const rebuildStructures = () => {
    const rooms = getRooms();
    for (const room of rooms) {
        const ruins = room.find(FIND_RUINS);
        const containerRuins = ruins.filter(r =>
            STRUCTURES_TO_REBUILD.includes(r.structure.structureType)
        );
        for (const containerRuin of containerRuins) {
            room.createConstructionSite(containerRuin.pos, containerRuin.structure.structureType);
        }
    }
};
