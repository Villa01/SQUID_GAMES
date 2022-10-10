

import React from 'react'
import { PlayersTableItem } from './PlayersTableItem'

export const GenericTable = ({ header, rows }) => {
    const { data, loading } = rows;
    console.log(data);
    return (
        !loading ?
            data.length > 0 ?
                <table className="table table-dark table-hover">
                    <thead>
                        <tr>
                            {header.map(header => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(item => <PlayersTableItem data={item} headers={header} />)
                        }
                    </tbody>
                </table>
                : 'Informacion no disponible'
            : <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
    )
}


