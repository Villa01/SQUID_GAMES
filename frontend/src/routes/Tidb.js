

import React, { useEffect, useState } from 'react';
import { SearchPlayer } from '../Components/SearchPlayer';
import { Top10Games } from '../Components/Top10Games';
import { Top10Players } from '../Components/Top10Players';
import { getLast10, getPlayer, getTopPlayers } from '../services/tidbData';


// Refresh time to get the info. 
const refreshTime = 10000;

export const Tidb = () => {

  // State variables to control the information shown. 
  const [games, setGames] = useState({
    loading: false,
    data: []
  });

  const [players, setPlayers] = useState({
    loading: false,
    data: []
  });

  // States to show or hide differrent sections.
  const [show, setShow] = useState({
    games: false,
    players: false,
    player: true,
  });


  const getGames = async () => {
    setGames({
      ...games,
      loading: true,
    });
    const gamesData = await getLast10();
    setGames({
      ...games,
      loading: false,
      data: gamesData,
    });
  }

  const getPlayers = async () => {
    setPlayers({
      ...players,
      laoding: true,
    });
    const playersData = await getTopPlayers();
    setPlayers({
      ...players,
      loading: false,
      data: playersData,
    });
  }

  const getAllData = async () => {
    await getGames();
    await getPlayers();
  }

  // Gets the information every refreshTime period. 
  useEffect(() => {
    getAllData();
    const intervalID = setInterval(getAllData, refreshTime);
    return () => clearInterval(intervalID);
  }, [])


  return (
    <div className='mt-4'>
      <h1>Reporte Tidb</h1>
      <hr />

      <Top10Games setShow={setShow} show={show} games={games} />

      <Top10Players setShow={setShow} show={show} players={players} />

      <SearchPlayer setShow={setShow} show={show} searchPlayer= {getPlayer} />
    </div>


  )
}
