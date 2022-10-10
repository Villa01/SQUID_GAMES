

import React from 'react'

export const GamesTableItem = ({game}) => {
    const {id, name, winner, broker, datetime, players} = game;
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{winner}</td>
            <td>{broker}</td>
            <td>{datetime}</td>
            <td>
                {
                    players? players.map(({ name }) => ` ${name}`) : 'No hay jugadores registrados'
                }
            </td>
        </tr>
    )
}
