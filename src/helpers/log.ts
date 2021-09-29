export const logCreeps = () => {
    const rooms = Object.keys(Game.rooms).map(r => Game.rooms[r]);
    let html =
        '<table border="1px"><th><td>Room</td><td>Miners</td><td>Builders</td><td>Upgraders</td><td>Ravagers</td></th>';
    for (const room of rooms) {
        html += `<tr>
                    <td></td>
                    <td>${room.name}</td>
                    <td>${
                        room.find(FIND_MY_CREEPS).filter(c => c.memory.role == 'miner').length
                    }</td>
                    <td>${
                        room.find(FIND_MY_CREEPS).filter(c => c.memory.role == 'builder').length
                    }</td>
                    <td>${
                        room.find(FIND_MY_CREEPS).filter(c => c.memory.role == 'upgrader').length
                    }</td>
                    <td>${
                        room.find(FIND_MY_CREEPS).filter(c => c.memory.role == 'ravager').length
                    }</td>
                </tr>`;
    }
    html += '</table>';
    console.log(html);
};
