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
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Chip from '@material-ui/core/Chip';

import DeleteIcon from '@material-ui/icons/Delete';

import Details from './OrderRowDetails'




export function Row({ row, deleteCallback, level, refresh }) {
    const query=useMediaQuery('(max-width:480px)')
    const display=(query?'block':'flex')
    const useRowStyles = makeStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            }
        },
        div:{marginTop: '0!important'},
        inline:{display:'inline'},
        th:{display:display, alignItems:'center',
            '& > *': {
                marginRight:8,
            },
            '& > div':{
                marginTop:1
            }

        },
        Pending: {
        },
        Loaded:{
            backgroundColor:"yellow",
        },
        Paid:{
            color: '#fff',
            backgroundColor: '#3f51b5'
        },
        Delivered:{
            color:'white',
            backgroundColor:'limegreen'
        }
    });
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root} onClick={() => setOpen(!open)}>


                <TableCell className={classes.th} align={"left"} component="th" scope="row">
                        <Typography  variant="h6">{row.id}</Typography>
                    <Chip label={new Date(row.date.seconds*1000).toLocaleDateString()} style={{margin:'0 8'}}/>
                    <Chip label={row.status} className={row.status!='In Transit'?classes[row.status]:classes['Loaded']}/>
                    <IconButton aria-label="expand row" size="small" style={{marginLeft:'auto'}} >
                        {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </IconButton>
                </TableCell>
                {/*<TableCell align={"right"} style={{}}>*/}
                {/*    <IconButton aria-label="delete row" size="small"  onClick={*/}
                {/*        (event)=>{*/}
                {/*            event.preventDefault()*/}
                {/*            deleteCallback(row.name)*/}
                {/*        }}>*/}
                {/*        <DeleteIcon></DeleteIcon>*/}
                {/*    </IconButton>*/}
                {/*   */}
                {/*</TableCell>*/}
            </TableRow>
            <TableRow>
                <TableCell style={{ padding:'0 1px'  }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit style={{paddingBottom:10}}>
                        <Details row={row} refresh={refresh} level={level}></Details>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

