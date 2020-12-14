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


import {useRouter} from 'next/router'
import {useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List'

import MoreIcon from '@material-ui/icons/MoreHoriz'

import Fab from '@material-ui/core/Fab'
import TextField from '@material-ui/core/TextField'

import {Divider, FormControlLabel, Popover, Switch} from '@material-ui/core'
import {Alert} from '@material-ui/lab'

import firebase from '../../config/firebase'


import {Dialog, Select, MenuItem, DialogContent, DialogActions, Button, InputLabel} from '@material-ui/core'

import PopupState, {bindPopover, bindTrigger} from 'material-ui-popup-state';

import {html} from '../../config/invoice.js'
import Handlebars from 'handlebars'

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={1}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}






export function Row({ order_id, row, deleteCallback, level, refresh }) {
    const display=(query?'block':'flex')
    const mTop=()=>{
        if (order_id) return '-46px'
        else return '-37px'
    }
    const useStyles = makeStyles((theme) => ({
        root: {
            backgroundColor: 'white',
            flexGrow: 1,
            position: 'relative'
        },
        fab2: {
            position: '',
            float: 'right',
            marginBottom: 25
        },
        alert: {
            margin: '0.5em 0'
        },
        fab: {
            width:'fit-content', float:'right', marginTop:mTop(), paddingRight: 13,
            '&>*': {
                fontWeight: 530
            }
        },
        dialog:{
            padding:8
        },
        label:{
            marginBottom:4
        }
    }));
    const useRowStyles = makeStyles({
        root: {
            position:'relative',
            '& > *': {
                borderBottom: 'unset',
            }
        },
        div:{marginTop: '0!important'},
        inline:{display:'inline'},
        th:{display:display, alignItems:'center',paddingRight:40,justifyContent:'space-between',
            '& > *': {
                marginRight:8,
            },
            '& > div':{
                marginTop:1
            }

        },
        New: {
            color:'white',
            backgroundColor:'turquoise'
        },
        Loaded:{
            backgroundColor:"yellow",
        },
        Paid:{
            color: 'white',
            backgroundColor: '#0cdc0c'
        },
        Delivered:{
            color:'white',
            backgroundColor:'#3f51b5'
        },
        price:{

            color: 'white',
            backgroundColor: 'darkblue'
    },driver:{
            color:'white',backgroundColor:'darkcyan'
        },
        route:{color:'black', backgroundColor:'aliceblue'},
        broker:{color:'white', backgroundColor:'blue'},

    });
    const [openAcc, setOpenAc] = React.useState(false);
    const classes = useRowStyles();
    const [btnRef, setBtn] = React.useState(null)
    const router = useRouter()
    const archive = router.pathname.includes('archive')
    var col
    if (archive) col = 'archive'
    else col = 'orders'
    const classes2 = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [edit, setEdit] = React.useState(false);
    const [alert, setAlert] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [method, setMethod] = React.useState('')
    const methods = ['Cash','Check','Factoring Company', 'Comcheck', 'Credit Card', 'Direct Deposit', 'Other']
    const [notes, setNotes] = React.useState(row.paymentNotes)
    const [del, setDel] = React.useState(0)
    const detailsRef = React.createRef()
    var fnstateObj = row
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    console.log(row)
    const query = useMediaQuery('(max-width:532px)')
    const handleChangeIndex = (index) => {
        setValue(index);
    };


    const duplicate = () => {
        firebase.firestore().collection('orders').doc(`test${row.id}`).set({...row, id: `test${row.id}`}).then(
            () => refresh()
        )
    }
    const progressOrder = () => {
        var status
        switch (row.status) {
            case 'New': {
                status = 'In Transit'
                break
            }
            case 'In Transit': {
                status = 'Delivered'
                break
            }
            case 'Delivered': {
                status = 'Paid'
                row.paymentNotes=notes
                row.paymentMethod=method
                break
            }
        }
        firebase.firestore().collection('orders').doc(row.id).set({...row, status: status}).then(
            () => refresh()
        )

    }
    const markAs = (as) =>{
        var status;
        switch(as){
            case 'new': {
                status = 'New';
                break
            }
            case 'intransit': {
                status = 'In Transit'
                break
            }
            case 'delivered': {
                status = 'Delivered'
                break
            }
            case 'paid':{
                status='Paid'

                break
            }
        }
        firebase.firestore().collection('orders').doc(row.id).set({...row, status: status}).then(
            () => refresh()
        )

    }
    const markAsPaid =()=>{
        setOpen(true)
    }
    const archiveOrder = () => {
        firebase.firestore().collection('archive').doc(row.id).set(row)

        firebase.firestore().collection('orders').doc(row.id).delete()
        router.push('orders/archive')
    }
    const restoreOrder = () => {
        firebase.firestore().collection('orders').doc(row.id).get().then(
            doc => {
                if (!doc.exists) {
                    firebase.firestore().collection('archive').doc(row.id).delete()
                    firebase.firestore().collection('orders').doc(row.id).set(row).then(
                        () => {
                            router.push('/orders')
                        }
                    )
                }
            }
        )

    }

    const deleteResourceHistory = (collection, resource, id) =>  firebase.firestore().collection(collection).doc(row[resource].name).get().then(
        doc=>{
            try{
                var data = doc.data()
                var history = data.history

                history.map(
                    item=> {
                        if (item.id == id)
                            history.splice(history.indexOf(item), 1)
                    }
                )
                data.history=history
                firebase.firestore().collection(collection).doc(row[resource].name).set(data)
            } catch (e) {
                console.log(e)
            }
        }
    )

    const deleteHistory = row => {
        deleteResourceHistory('brokers','broker', row.id)
        deleteResourceHistory('drivers','driver', row.id)
        deleteResourceHistory('customers','pickup', row.id)
        deleteResourceHistory('customers','delivery', row.id)
    }
    const deleteOrder = (popup) => {

        if(del==0){setDel(1)}else{
            popup.close()
            firebase.firestore().collection(col).doc(row.id).delete().then(
                () => {
                    deleteHistory(row)
                    refresh()
                }
            )
        }
    }
    const downloadInvoice = (e) => {
        if (window) {
            console.log(row)
            const template = Handlebars.compile(html)
            const pdf = require('html2pdf.js')
            pdf(template({...row, date:new Date(row.date.seconds*1000).toLocaleDateString()}),{
                filename:`${row.id}.pdf`,
                html2canvas:{scale:2}, jsPDF:{format:'a4'}
            })
            firebase.firestore().collection(col).doc(row.id).set({...row, invoiced:true}).then(
                // () => refresh()
            )
        }
        // fetch(`/api/invoice`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         filename: "test",
        //         content: "Testing Content"
        //     }),
        // }).then(async res => {
        //     if (res.status === 200) {
        //         const blob = await res.blob();
        //         const file = new Blob(
        //             [blob],
        //             {type: 'application/pdf'}
        //         );
        //         //Build a URL from the file
        //         const fileURL = URL.createObjectURL(file);
        //         //Open the URL on new Window
        //         window.open(fileURL);
        //     }
        // })
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root} >
                <TableCell className={classes.th} align={"left"} component="th" scope="row" onClick={() => setOpenAc(!openAcc)}>
                        <Typography style={{width:'10%'}} variant="h6">{row.id}</Typography>
                    {level=="Admin"?
                        <>
                            <Chip style={{width:'20%', fontWeight: 500}}label={`${row.pickup.city},${row.pickup.state} - ${row.delivery.city},${row.delivery.state}`} className={classes.route}/>
                            <Chip style={{width:'20%',margin:'0 8'}} label={`${row.broker.name}`} className={classes.broker}/>
                            <Chip style={{width:'20%'}} label={row.driver.name} className={classes.driver}/>
                            <Chip style={{width:'10%'}}label={`$${parseFloat(row.price).toFixed(2)}`} className={classes.price}/>
                            <Chip style={row.invoiced==true && row.status != 'Paid'?{width:'10%'}:{width:'10%',marginRight:112}}label={row.status} className={row.status!='In Transit'?classes[row.status]:classes['Loaded']}/>
                            {row.invoiced==true && row.status != 'Paid'?
                                <Chip style={{width:'100px'}}label={"Invoiced"}/>
                                :null}
                        </>
                        :                            <Chip label={row.status} style={{marginLeft:'auto'}} className={row.status!='In Transit'?classes[row.status]:classes['Loaded']}/>
                    }

                    <IconButton aria-label="expand row" size="small" style={{marginLeft:''}} >
                        {openAcc ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </IconButton>
                </TableCell>
                <div  className={classes2.fab}>
                    <PopupState variant="popover" popupId="popup">
                        {(popupState) => {
                            return (
                                <>
                                    <IconButton size="small" color="primary" aria-label="add" {...bindTrigger(popupState)}>
                                        <MoreIcon/>
                                    </IconButton>
                                    <Popover
                                        PaperProps={
                                            {
                                                style: {
                                                    minWidth: '300px!important'
                                                }
                                            }
                                        }
                                        {...bindPopover(popupState)}
                                        anchorOrigin={{
                                            vertical: 'center',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                    >


                                        <Box p={0} style={{display: 'flex', flexDirection: 'column'}}>
                                            <List disablePadding>
                                                {/*<ListItem button onClick={()=>{duplicate();popupState.close()}}*/}
                                                {/*          disabled={row.status=='Pending' || row.status=='In Transit'?false:true}>*/}
                                                {/*    <ListItemText>Duplicate order</ListItemText>*/}
                                                {/*</ListItem>*/}
                                                <ListItem button onClick={() => {
                                                    progressOrder();
                                                    popupState.close()
                                                }}
                                                          disabled={row.status == 'New' || row.status == 'In Transit' ? false : true}>
                                                    <ListItemText>Progress order</ListItemText>
                                                </ListItem>


                                                {level == 'Admin'    ?
                                                    <ListItem button onClick={() => {
                                                        downloadInvoice();
                                                        popupState.close()
                                                    }}>
                                                        <ListItemText>Download Invoice</ListItemText>
                                                    </ListItem>
                                                    : null}
                                                {/*<ListItem button onClick={()=>{setStatus('Pending');popupState.close()}}>*/}
                                                {/*    <ListItemText>Pending</ListItemText>*/}
                                                {/*</ListItem>*/}
                                                {/*<ListItem button onClick={()=>{setStatus('In Transit');popupState.close()}}>*/}
                                                {/*    <ListItemText>In Transit</ListItemText>*/}
                                                {/*</ListItem>*/}
                                                {/*<ListItem button onClick={()=>{setStatus('Delivered');popupState.close()}}>*/}
                                                {/*    <ListItemText>Delivered</ListItemText>*/}
                                                {/*</ListItem>*/}
                                                {/*<ListItem button onClick={()=>{setStatus('Paid');popupState.close()}}>*/}
                                                {/*    <ListItemText>Paid</ListItemText>*/}
                                                {/*</ListItem>*/}

                                            </List>
                                        </Box>
                                        <Divider></Divider>
                                        {level == 'Admin' ?
                                            <Box p={0}>
                                                <List disablePadding>
                                                    {archive ?
                                                        <ListItem button onClick={() => {
                                                            restoreOrder();
                                                            popupState.close()
                                                        }}>
                                                            <ListItemText>Restore Order</ListItemText>
                                                        </ListItem> :
                                                        <ListItem button onClick={() => {
                                                            archiveOrder();
                                                            popupState.close()
                                                        }}>
                                                            <ListItemText>Archive Order</ListItemText>
                                                        </ListItem>
                                                    }
                                                    {archive?null:
                                                        <ListItem button onClick={() => {
                                                            router.push(`/orders/edit/${row.id}`)
                                                        }}>
                                                            <ListItemText>Edit Order</ListItemText>
                                                        </ListItem>
                                                    }
                                                    <ListItem button onClick={() => {
                                                        deleteOrder(popupState);
                                                    }}>
                                                        <ListItemText>{del==1?"Are you sure?":"Delete order"}</ListItemText>
                                                    </ListItem>
                                                </List>
                                            </Box>
                                            : null}

                                        <Divider/>
                                        {level=='Admin'?
                                            <>
                                                <Box p={0}>
                                                    <ListItem button disabled={row.status=='New'?true:false} onClick={() => {
                                                        markAs('new');
                                                        popupState.close()
                                                    }}>
                                                        <ListItemText>Mark as New</ListItemText>
                                                    </ListItem>
                                                    <ListItem button disabled={row.status=='In Transit'?true:false} onClick={() => {
                                                        markAs('intransit');
                                                        popupState.close()
                                                    }}>
                                                        <ListItemText>Mark as In Transit</ListItemText>
                                                    </ListItem>
                                                    <ListItem button disabled={row.status=='Delivered'?true:false} onClick={() => {
                                                        markAs('delivered');
                                                        popupState.close()
                                                    }}>
                                                        <ListItemText>Mark as Delivered</ListItemText>
                                                    </ListItem>
                                                    <ListItem button disabled={row.status=='Paid'?true:false} onClick={() => {
                                                        markAsPaid();
                                                        popupState.close()
                                                    }}>
                                                        <ListItemText>Mark as paid</ListItemText>
                                                    </ListItem>
                                                </Box>
                                                <Divider></Divider>
                                            </>
                                            :null}
                                    </Popover>
                                </>
                            )
                        }}
                    </PopupState>

                    <Dialog className={classes2.dialog} open={open} onClose={()=>setOpen(false)}>
                        <DialogContent>
                            <div style={{marginBottom:10}}>
                                <InputLabel className={classes2.label}>Payment Method</InputLabel>
                                <Select variant={"outlined"} value={method} fullWidth
                                        onChange={(event) => setMethod(event.target.value)}>
                                    {methods.map(item => <MenuItem key={item}
                                                                   value={item}>{item}</MenuItem>)}
                                </Select>
                            </div>
                            <InputLabel className={classes2.label}>Payment Notes</InputLabel>
                            <TextField
                                variant={"outlined"}
                                fullWidth
                                multiline
                                rows={3}
                                value={notes}
                                onChange={(event)=>setNotes(event.target.value)}
                            ></TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button color={'primary'} fullWidth onClick={
                                ()=>{
                                    markAs('paid');setOpen(false)
                                }
                            }>
                                Mark as paid
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </TableRow>
            <TableRow>
                <TableCell style={{ padding:'0 1px'  }} colSpan={6}>
                    <Collapse in={openAcc} timeout="auto" unmountOnExit style={{paddingBottom:10}}>
                        <div className={classes.root}>

                            {alert ?
                                <Alert className={classes.alert} onClose={() => setAlert(false)}>Saved</Alert>
                                : null}

                            <Details level={level} handleChangeIndex={handleChangeIndex} row={row} value={value} theme={theme} query={query}
                                     edit={edit} callback={(stateObj) => {
                                fnstateObj = stateObj;
                                console.log(fnstateObj)
                            }}></Details>



                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

