import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";


export const Top3Games = ({ logs }) => {

    const data = logs.map( ({name, uv}) => {
        return {
            name, 
            cantidad: uv
        }
    });

    return <div>
        <h2>Top 3 Juegos</h2>
        <BarChart width={500} height={300} data={data}>
            <YAxis />

            <Tooltip />
            <Legend />
            <XAxis dataKey="name" />
            <Bar dataKey="cantidad" fill="#8884d8" />
        </BarChart>
    </div>
}

