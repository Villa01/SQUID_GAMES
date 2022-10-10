

import React from 'react'

export const PlayersTableItem = ({data:{name, wins}}) => {
    return (
        <tr>
            <td>{name}</td>
            <td>{wins}</td>
            
        </tr>
    )
}
