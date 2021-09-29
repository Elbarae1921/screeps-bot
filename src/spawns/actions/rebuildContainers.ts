import { getRooms } from 'helpers/common';

export const rebuildContainers = () => {
    const rooms = getRooms();
    for (const room of rooms) {
        const ruins = room.find(FIND_RUINS);
        const containerRuins = ruins.filter(r => r.structure.structureType === STRUCTURE_CONTAINER);
        for (const containerRuin of containerRuins) {
            room.createConstructionSite(containerRuin.pos, STRUCTURE_CONTAINER);
        }
    }
};
