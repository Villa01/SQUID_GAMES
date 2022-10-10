import React from 'react'
import { GamesTable } from './GamesTable'

export const Top10Games = ({setShow, show, games}) => {
  return (
    <section>
        <div className='d-flex justify-content-between'>
          <h2>Últimos 10 juegos</h2>
          <button
            className='btn btn-primary'
            onClick={() => setShow({ ...show, games: !show.games })}
          >
            Show/Hide
          </button>
        </div>
        <br></br>

        {show.games &&
          <GamesTable header={['id', 'Game Name', 'Winner', 'Broker', 'Date', 'Players']} rows={games} />
        }
      </section>
  )
}
