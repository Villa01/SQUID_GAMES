

import React from 'react'

export const LogTableItem = ({log}) => {
    const { gameid, players, gamename, winner, queue, datetime } = log;
    return (
        <tr>
            <td>{gameid}</td>
            <td>{players}</td>
            <td>{gamename}</td>
            <td>{winner}</td>
            <td>{queue}</td>
            <td>{datetime}</td>
        </tr>
    )
}
