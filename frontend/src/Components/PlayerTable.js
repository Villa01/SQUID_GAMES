import React from 'react'
import { isEmptyObj } from '../helpers/shared';
import { Loader } from './Loader';

export const PlayerTable = ({ player }) => {
    const { data: { id, name, winner, broker, datetime } } = player;
    return (
        !player.loading ?
            isEmptyObj(player.data) ?
                <table className="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th>Game#</th>
                            <th>Game Name</th>
                            <th>State</th>
                            <th>Broker</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{id}</td>
                            <td>{name}</td>
                            <td>{winner === name ? 'win' : 'defeat'}</td>
                            <td>{broker}</td>
                            <td>{datetime}</td>
                        </tr>
                    </tbody>
                </table>
                : <p> Información no disponible</p>
            : <Loader />
    )
}
