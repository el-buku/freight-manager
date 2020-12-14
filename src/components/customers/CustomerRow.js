import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import DeleteIcon from '@material-ui/icons/Delete';

import Details from './CustomerRowDetails'


const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: '',
        }
    },
});

export function Row(props) {
    const { row, deleteCallback } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root} onClick={() => setOpen(!open)}>

                <TableCell component="th" scope="row">
                    <Typography variant="h6">{row.name}</Typography>
                </TableCell>
                <TableCell align={"right"} style={{}}>
                    <IconButton aria-label="delete row" size="small"  onClick={
                        (event)=>{
                            event.preventDefault()
                            deleteCallback(row.name)
                        }}>
                        <DeleteIcon></DeleteIcon>
                    </IconButton>
                    <IconButton aria-label="expand row" size="small" >
                        {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ padding:'0 1px'  }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit style={{paddingBottom:10}}>
                        <Details row={row}></Details>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

