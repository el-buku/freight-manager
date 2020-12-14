import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Link from 'next/link'

export default function OrdersTable({row}) {
    return (
        <Table size="small" aria-label="purchases">
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Order ID</TableCell>

                </TableRow>
            </TableHead>
            <TableBody>
                {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date.toLocaleString()}>
                        <TableCell style={{borderBottom: "none"}} component="th" scope="row">
                            {new Date(historyRow.date.seconds*1000).toLocaleDateString()}
                        </TableCell>
                        <TableCell style={{borderBottom: "none"}}>
                            <Link href={`orders/${historyRow.id}`}>
                                <a >{historyRow.id}</a>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
