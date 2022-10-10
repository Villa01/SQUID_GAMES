import React from 'react'
import { GenericTable } from './PlayersTable'

export const Top10Players = ({setShow, show, players}) => {
    return (
        <section>
            <div className='d-flex justify-content-between'>
                <h2>Top 10 jugadores</h2>
                <button
                    className='btn btn-primary'
                    onClick={() => setShow({ ...show, players: !show.players })}
                >
                    Show/Hide
                </button>
            </div>
            <br></br>
            {show.players && <GenericTable header={['name', 'wins']} rows={players} />}
        </section>
    )
}
