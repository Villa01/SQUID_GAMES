

import React from 'react'
import { GamesTableItem } from './GamesTableItem'
import { Loader } from './Loader';

export const GamesTable = ({ header, rows }) => {
    const { data } = rows;
    return (
        !rows.loading ?
            data.length > 0 ?
                <table className="table table-dark table-hover">
                    <thead>
                        <tr>
                            {header.map(header => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(game => <GamesTableItem game={game} key={game.id} />)
                        }
                    </tbody>
                </table>
                : 'Informacion no disponible'
            : <Loader/>
    )
}


