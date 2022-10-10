

import React, { useState } from 'react'
import { PlayerTable } from './PlayerTable';

export const SearchPlayer = ({ setShow, show, searchPlayer }) => {
    const [name, setName] = useState();

    const [player, setPlayer] = useState({
        loading: false,
        searched: false,
        data: {}
    });

    const getPlayerInfo = async () => {
        setPlayer({
            ...player,
            searched: true,
            laoding: true,
        });
        const playerData = await searchPlayer(name);
        const info = {
            ...playerData,
            name
        }
        setPlayer({
            ...player,
            searched: true,
            loading: false,
            data: info,
        });
    }

    return (
        <section>
            <div className='d-flex justify-content-between'>
                <h2>Estadísticas de Jugador en tiempo Real</h2>
                <button
                    className='btn btn-primary'
                    onClick={() => setShow({ ...show, player: !show.player })}
                >
                    Show/Hide
                </button>
            </div>
            <br></br>
            {show.player &&
                <div className='col-4'>
                    <p>Ingresa el nombre del jugador:</p>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">#</span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <button
                        className='btn btn-primary'
                        onClick={getPlayerInfo}
                    >
                        Enviar
                    </button>
                    <PlayerTable player={player} />
                </div>
            }
        </section>
    )
}
