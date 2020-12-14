import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List'

import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/SaveAlt'
import ClearIcon from '@material-ui/icons/Clear'

import Fab from '@material-ui/core/Fab'
import TextField from '@material-ui/core/TextField'

import {FormControlLabel, Switch} from '@material-ui/core'
import {Alert} from '@material-ui/lab'

import firebase from '../../config/firebase'

import Orders from "../shared/InnerOrdersTable"
import useMediaQuery from '@material-ui/core/useMediaQuery'

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
    fab: {
        position: 'absolute',
        right: 30,
        bottom: 25
    },
    alert:{
        margin:'0.5em 0'
    }
}));

export default function FullWidthTabs({row, editCallback}) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [edit, setEdit] = React.useState(false);
    const [alert, setAlert] = React.useState(false)
    const detailsRef = React.createRef()
    var fnstateObj=row
    const query = useMediaQuery('(max-width:532px)')

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleEdit = () => {
        setEdit(true)
    }

    const handleSave = () => {
        console.log(fnstateObj)
        firebase.firestore().collection('drivers').doc(fnstateObj.name).set(fnstateObj).then(
            ()=>{
                setEdit(false);
                setAlert(true)
            }
        )
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
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="Orders" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            {alert?
                <Alert className={classes.alert} onClose={()=>setAlert(false)}>Saved</Alert>
                :null}
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction} style={query?{paddingBottom:70}:null}>
                    <Details row={row} edit={edit} callback={(stateObj)=>{fnstateObj=stateObj;}}></Details>
                    {!edit ? <Fab size="medium" color="primary" aria-label="add" className={classes.fab} onClick={handleEdit}>
                        <EditIcon/>
                    </Fab> : <>
                        <div className={classes.fab}>
                            <Fab size="medium" color="secondary" aria-label="add" onClick={() => setEdit(false)}
                                 style={{marginRight: 15}}>
                                <ClearIcon/>
                            </Fab>
                            <Fab size="medium" color="primary" aria-label="add" onClick={() => handleSave()}>
                                <SaveIcon/>
                            </Fab>
                        </div>
                    </>}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <Orders row={row}></Orders>
                </TabPanel>
            </SwipeableViews>

        </div>
    );
}

const detailStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
    }
}));

function getListMarkup(row, key) {
    if(row[key]!='')
        return (
            <ListItemText
                primary={key != 'factoring' ? row[key] : row[key].toString().replace(/^./, str => str.toUpperCase())}
                secondary={key != 'factoring' ? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : "Accepts factoring?"}/>
        )
}


function Details({row, edit, callback}) {
    const classes = detailStyles()
    const [state, setVals] = React.useState(row)
    const [update, setUpdate] = React.useState('')
    const handleChange = (key, val) => {
        state[key] = val
        setUpdate(val)
        setVals(state)
    }
    React.useEffect(()=>callback(state),[update])

    const getMap = (stateObj) => Object.keys(stateObj).map(key => {
        if (key != 'history' && key != 'name' ) {
            return (
                <ListItem key={key}>
                    {!edit ? getListMarkup(row, key) : key != 'factoring' ? <TextField
                        variant={"outlined"}
                        label={key}
                        value={state[key]}
                        onChange={(event) => handleChange(key, event.target.value)}
                    /> : <FormControlLabel
                        control={<Switch
                            checked={state[key]}
                            onChange={(event) => handleChange(key, event.target.checked)}
                        ></Switch>}
                        label={key}
                    />
                    }
                </ListItem>
            )
        }
    })
    return (
        <List dense style={{display: 'flex', flexDirection: 'column',}}>
            {getMap(state)}
        </List>
    )
}

