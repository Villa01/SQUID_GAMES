

import React from 'react'
import { LogTableItem } from './LogTableItem'

export const LogsTable = ({header, logs}) => {
    return (
        <table className="table table-dark table-hover">
            <thead>
                <tr>
                    {header.map(header => <th key={header}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {
                    logs.map(log => <LogTableItem log={log} key={log._id} />)
                }
            </tbody>
        </table>
    )
}
