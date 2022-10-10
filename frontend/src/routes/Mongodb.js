
import React, { useEffect, useState } from 'react'
import { Loader } from '../Components/Loader';
import { LogsTable } from '../Components/LogsTable'
import { SubsChart } from '../Components/SubsChart';
import { Top3Games } from '../Components/Top3Games';
import { getAllLogs } from '../services/mongoData';

export const Mongodb = () => {

  const [logs, setLogs] = useState({
    loading: false,
    data: []
  });

  const [chartInfo, setChartInfo] = useState([]);

  const [subscriberInfo, setSubscriberInfo] = useState([])


  const getChartInfo = (array) => {
    const top = {}
    array.forEach(({ gamename }) => {
      if (top[gamename]) {
        top[gamename] = top[gamename] + 1
      } else {
        top[gamename] = 1;
      }
    });

    const chartData = Object.keys(top).map(key => {
      return {
        name: key,
        uv: top[key]
      }
    })

    chartData.sort((a, b) => {
      if (a.uv > b.uv) {
        return -1;
      }
      if (a.uv < b.uv) {
        return 1;
      }
      return 0;
    });


    setChartInfo(chartData.slice(0, 3))
  }


  const subscribersInfo = (array) => {
    const top = {}
    array.forEach(({ queue }) => {
      if (top[queue]) {
        top[queue] = top[queue] + 1
      } else {
        top[queue] = 1;
      }
    });

    const subData = Object.keys(top).map(key => {
      return {
        name: key,
        uv: top[key]
      }
    })
    setSubscriberInfo(subData)
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const logsData = await getAllLogs();
      setLogs({
        loading: false,
        data: logsData
      });

      getChartInfo(logsData);
      subscribersInfo(logsData);
    }, 3000)

    return () => {
      clearInterval(intervalId)
    }
  }, []);



  return (
    <div >
      <br></br>
      <h2>Información MongoDb</h2>
      {
        chartInfo.length !== 0 ?
          <Top3Games logs={chartInfo} />
          : <Loader />
      }
      <br />
      <br />
      {
        subscriberInfo.length !== 0 ?
          <SubsChart subs={subscriberInfo} />
          : <Loader />
      }

      <br />
      <br />
      {
        logs.data.length !== 0 ?
          <LogsTable header={['gameid', 'players', 'gamename', 'winner', 'queue', 'datetime']} logs={logs.data} />
          : <Loader />
      }

    </div>
  )
}
