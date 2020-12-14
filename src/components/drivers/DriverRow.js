import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Chip from '@material-ui/core/Chip';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import DeleteIcon from '@material-ui/icons/Delete';

import Details from './DriverRowDetails'


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
    const [msg, setMsg] = React.useState(1)
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>

                <TableCell component="th" style={{display:'flex',border:'none'}} scope="row"  onClick={() => setOpen(!open)}>
                    <Typography variant="h6">{row.name}</Typography>
                    {row.verified?<Chip style={{marginLeft:8}} label="Verified"/>:null}
                </TableCell>
                <TableCell align={"right"} style={{}}>
                    {msg==2?'Are you sure?':null}
                    <IconButton aria-label="delete row" size="small"  onClick={
                        (event)=>{
                            event.preventDefault()
                            if(msg<2)setMsg(msg+1);
                            else deleteCallback(row.name)
                        }}>
                        <DeleteIcon></DeleteIcon>
                    </IconButton>
                    <IconButton aria-label="expand row" size="small"  onClick={() => setOpen(!open)}>
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

