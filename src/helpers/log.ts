import { CreepRole } from 'types';

export const logCreeps = () => {
    const rooms = Object.keys(Game.rooms).map(r => Game.rooms[r]);
    let html =
        '<table border="1px"><th><td>Room</td><td>Miners</td><td>Builders</td><td>Upgraders</td><td>Ravagers</td></th>';
    for (const room of rooms) {
        html += `<tr>
                    <td></td>
                    <td>${room.name}</td>
                    <td>${
                        room.find(FIND_MY_CREEPS).filter(c => c.memory.role == CreepRole.Miner)
                            .length
                    }</td>
                    <td>${
                        room.find(FIND_MY_CREEPS).filter(c => c.memory.role == CreepRole.Builder)
                            .length
                    }</td>
                    <td>${
                        room.find(FIND_MY_CREEPS).filter(c => c.memory.role == CreepRole.Upgrader)
                            .length
                    }</td>
                    <td>${
                        room.find(FIND_MY_CREEPS).filter(c => c.memory.role == CreepRole.Ravager)
                            .length
                    }</td>
                </tr>`;
    }
    html += '</table>';
    console.log(html);
};
