import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import {useRouter} from 'next/router'
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List'

import MoreIcon from '@material-ui/icons/MoreHoriz'
import SaveIcon from '@material-ui/icons/SaveAlt'
import ClearIcon from '@material-ui/icons/Clear'

import Fab from '@material-ui/core/Fab'
import TextField from '@material-ui/core/TextField'

import {FormControlLabel, Switch} from '@material-ui/core'
import {Alert} from '@material-ui/lab'

import firebase from '../../config/firebase'

import Orders from "../shared/InnerOrdersTable"
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Typography from '@material-ui/core/Typography'

import PopupState, {bindPopover, bindTrigger, usePopupState} from 'material-ui-popup-state';

import {Popover, Divider} from '@material-ui/core'

import {Refresh} from '../../pages/orders/index.js'

import html from '../../config/invoice.js'

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

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'white',
        flexGrow: 1,
        position: 'relative'
    },
    fab2:{
        position:'unset',
        float:'right',
        marginBottom:25
    },
    alert:{
        margin:'0.5em 0'
    },
    fab: {
        position: 'absolute',
        right: 30,
        bottom:25,
        '&>*':{
            fontWeight:530
        }
    }
}));

export default function FullWidthTabs({row, editCallback, level, refresh}) {
    const router=useRouter()
    const archive=router.pathname.includes('archive')
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [edit, setEdit] = React.useState(false);
    const [alert, setAlert] = React.useState(false)
    const detailsRef = React.createRef()
    var fnstateObj=row
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    console.log(row)
    const query = useMediaQuery('(max-width:532px)')
    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleEdit = () => {
        setEdit(true)
    }

    const handleSave = () => {
        console.log(fnstateObj)
        firebase.firestore().collection('customers').doc(fnstateObj.name).set(fnstateObj).then(
            ()=>{
                setEdit(false);
                setAlert(true)
            }
        )
    }
    const duplicate = ()=>{
        firebase.firestore().collection('orders').doc(`test${row.id}`).set({...row, id:`test${row.id}`}).then(
            ()=>refresh()
        )
    }
    const progressOrder=()=>{
        var status
        switch (row.status){
            case 'Pending':{
                status='In Transit'
                break
            }
            case 'In Transit':{
                status='Delivered'
                break
            }
            case 'Delivered':{
                status='Paid'
                break
            }
        }
        firebase.firestore().collection('orders').doc(row.id).set({...row,status:status}).then(
            ()=>refresh()
        )

    }
    const archiveOrder = ()=>{
        firebase.firestore().collection('archive').doc(row.id).set(row)

        firebase.firestore().collection('orders').doc(row.id).delete()
        router.push('orders/archive')
    }

    const restoreOrder=()=>{
        firebase.firestore().collection('orders').doc(row.id).get().then(
            doc=>{
                if(!doc.exists){
                    firebase.firestore().collection('archive').doc(row.id).delete()
                    firebase.firestore().collection('orders').doc(row.id).set(row).then(
                        ()=>{
                            router.push('/orders')
                        }
                    )
                }
            }
        )

    }

    const deleteOrder = ()=>{
        var col
        if(archive) col = 'archive'
        else col = 'orders'
        firebase.firestore().collection(col).doc(row.id).delete().then(
            ()=>refresh()
        )
    }

    const downloadInvoice =  (e) => {
        if(window)
        {
            const pdf = require('html2pdf.js')
            pdf(html)
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
        <div className={classes.root}>

            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Info" {...a11yProps(0)} />
                    <Tab label="Broker" {...a11yProps(1)} />
                    <Tab label="Pickup" {...a11yProps(2)} />
                    <Tab label="Delivery" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            {alert?
                <Alert className={classes.alert} onClose={()=>setAlert(false)}>Saved</Alert>
                :null}

                <Details handleChangeIndex={handleChangeIndex} row={row} value={value} theme={theme} query={query} edit={edit} callback={(stateObj)=>{fnstateObj=stateObj;console.log(fnstateObj)}} ></Details>
            <div className={classes.fab} >
                <PopupState variant="popover" popupId="popup">
                    {(popupState) => {
                        return (
                            <>
                                <Fab size="medium" color="primary" aria-label="add" {...bindTrigger(popupState)}>
                                    <MoreIcon/>
                                </Fab>
                                <Popover
                                    PaperProps={
                                        {
                                            style:{
                                                minWidth:'300px!important'
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


                                    <Box p={0} style={{display:'flex',flexDirection:'column'}}>
                                        <List disablePadding>
                                            {/*<ListItem button onClick={()=>{duplicate();popupState.close()}}*/}
                                            {/*          disabled={row.status=='Pending' || row.status=='In Transit'?false:true}>*/}
                                            {/*    <ListItemText>Duplicate order</ListItemText>*/}
                                            {/*</ListItem>*/}
                                            <ListItem button onClick={()=>{progressOrder();popupState.close()}}
                                                      disabled={row.status=='Pending' || row.status=='In Transit'?false:true}>
                                                <ListItemText>Progress order</ListItemText>
                                            </ListItem>

                                            {level=='Admin' && row.status=='Delivered'?
                                                <ListItem button onClick={()=>{progressOrder();popupState.close()}}>
                                                    <ListItemText>Mark as paid</ListItemText>
                                                </ListItem>
                                                :null}
                                            {level=='Admin' && row.status=='Paid'?
                                                <ListItem button onClick={()=>{downloadInvoice();popupState.close()}}>
                                                    <ListItemText>Download Invoice</ListItemText>
                                                </ListItem>
                                                :null}
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
                                    {level=='Admin'?
                                        <Box p={0}>
                                            <List disablePadding>
                                                {archive?
                                                    <ListItem button onClick={()=>{restoreOrder();popupState.close()}}>
                                                        <ListItemText>Restore Order</ListItemText>
                                                    </ListItem>:
                                                    <ListItem button onClick={()=>{archiveOrder();popupState.close()}}>
                                                        <ListItemText>Archive Order</ListItemText>
                                                    </ListItem>
                                                }
                                                <ListItem button onClick={()=>{deleteOrder();popupState.close()}}>
                                                    <ListItemText>Delete Order</ListItemText>
                                                </ListItem>
                                            </List>
                                        </Box>
                                        :null}

                                    <Divider/>
                                </Popover>
                            </>
                        )
                    }}
                </PopupState>


        </div>


        </div>
    );
}

const detailStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap!important',
        maxHeight:'300px'
    },
    li:{
        paddingTop:0, paddingRight:0,paddingBottom:0, width:'fit-content!important'
    }
}));




function Details({row, edit, callback, value, theme, query, handleChangeIndex}) {
    const classes = detailStyles()
    const [state, setVals] = React.useState(row)
    const [update, setUpdate] = React.useState('')
    const handleChange = (key, val) => {
        state[key] = val
        setUpdate(val)
        setVals(state)
    }
    React.useEffect(()=>callback(state),[update])
    console.log(state)
    function getListMarkup(row, key) {
        if(row[key]!='' && key!='factoring') {
            return (
                <ListItemText
                    className={classes.li}
                    primary={key != 'date' ? row[key].split('T')[0] : new Date(row[key].seconds * 1000).toLocaleDateString()}
                    secondary={key != 'factoring' ? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : "Accepts factoring?"}/>
            )
        }else if(key=='factoring') return (
            <ListItemText
                className={classes.li}
                primary={row[key]?'Yes':'No'}
                secondary={"Accepts factoring?"}/>
        )
    }
    const getMap = (stateObj) => Object.keys(stateObj).sort().map(key => {
        // if (key != 'history' && key != 'id' && key!='broker' && key != 'pickup' && key !='delivery' && key !='driver' && key!='files' && key!='ext') {
        if (key != 'history' && key != 'id' && key!='broker' && key != 'pickup' && key !='delivery' && key !='driver' && key!='files' && key!='city' && key!='state' && key!='zip' && key!='address' && key!='ext' && key!='status') {
            return (
                <ListItem key={key}
                    className={classes.li}>
                    {!edit ? getListMarkup(stateObj, key) : key != 'factoring' ? <TextField
                        variant={"outlined"}
                        label={key}
                        value={stateObj[key]}
                        onChange={(event) => handleChange(key, event.target.value)}
                    /> : <FormControlLabel
                        control={<Switch
                            checked={stateObj[key]}
                            onChange={(event) => handleChange(key, event.target.checked)}
                        ></Switch>}
                        label={key}
                    />
                    }
                </ListItem>
            )
        // }
        } else if (key=='address'){
            return(

                ['address', 'city', 'state', 'zip'].map(
                    key=>{
                        return (

                            <ListItem key={key}                 className={classes.li}
                            >

                                {getListMarkup(stateObj, key)}
                            </ListItem>
                        )
                    }
                )
            )

        }
    })
    return (
        <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
        >
            <TabPanel value={value} index={0} dir={theme.direction} style={query?{paddingBottom:70}:null}>
                <List dense className={classes.root}>
                    {getMap(state)}
                    <Typography variant={"button"} style={{marginTop: 8}}>
                        Driver
                    </Typography>
                    {getMap(state.driver)}
                </List></TabPanel>

            {/*<TabPanel value={value} index={1} dir={theme.direction} style={query?{paddingBottom:70}:null}>*/}
            {/*    <List dense className={classes.root}>*/}
            {/*        {getMap(state.driver)}*/}
            {/*    </List>*/}


            {/*</TabPanel>*/}

            <TabPanel value={value} index={1} dir={theme.direction}>
                <List dense className={classes.root}>
                    {getMap(state.broker)}
                </List>
                {/*<Orders row={row}></Orders>*/}
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
                <List dense className={classes.root}>
                    {getMap(state.pickup)}
                </List>
                {/*<Orders row={row}></Orders>*/}
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
                <List dense className={classes.root}>
                    {getMap(state.delivery)}
                </List>
                {/*<Orders row={row}></Orders>*/}
            </TabPanel>

        </SwipeableViews>

    )
}

