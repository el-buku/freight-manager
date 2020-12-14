import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField'

import {FormControlLabel, Switch, Typography} from '@material-ui/core'




export default function Details({row, edit, callback, value, theme, query, handleChangeIndex, level}) {
    const getDirection = ()=>{
        if (level!='Admin') return 'column';
        else return ''
    }
    const getItem = () => {
        if (level!='Admin') return {display:'flex', flexWrap:'wrap'};
        else return {display:'block'}
    }
    const detailStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexDirection: getDirection(),
            flexWrap: 'wrap!important',
            justifyContent: 'space-between',
            padding: 20
        },
        item: {
            paddingBottom: 35, flexGrow:1, display:getItem().display, flexWrap:getItem().flexWrap
        },
        li: {
            margin:0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            width: 'fit-content',
            height: 'fit-content',
            justifyContent: 'space-between'
        }
    }));
    const classes = detailStyles()
    const [state, setVals] = React.useState(row)
    const [update, setUpdate] = React.useState('')
    const handleChange = (key, val) => {
        state[key] = val
        setUpdate(val)
        setVals(state)
    }
    React.useEffect(() => callback(state), [update])
    console.log(state)

    function getListMarkup(row, key, label) {
       if (label) {
           if (row[key] != '' && key != 'factoring' && key!='estTime' && key!='estTime2') {
               return (
                   <ListItemText
                       className={classes.li}
                       primary={key != 'date' ? row[key] : new Date(row[key].seconds * 1000).toLocaleDateString()}
                       secondary={key != 'factoring' ? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : "Accepts factoring?"}

                   />
               )
           } else if (key == 'factoring') return (
               <ListItemText
                   className={classes.li}
                   primary={row[key] ? 'Yes' : 'No'}
                   secondary={"Accepts factoring?"}/>
           ); else if (key == 'estTime'){
               if (row.estTime2!=null){
                   return (
                       <ListItemText
                           className={classes.li}
                           primary={`${row[key].split('T')[0]} ${row[key].split('T')[1]} - ${row.estTime2.split('T')[0]} ${row.estTime2.split('T')[1]}`}
                           secondary={key != 'factoring' ? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : "Accepts factoring?"}

                       />
                   )
               }
               else if(row.estTime!=null){
                   return(
                       <ListItemText
                           className={classes.li}
                           primary={`${row[key].split('T')[0]} ${row[key].split('T')[1]}`}
                           secondary={key != 'factoring' ? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : "Accepts factoring?"}

                       />
                   )
               }
           }
       }else{
           if (row[key] != '' && key != 'factoring' && key!='estTime' && key!='estTime2') {
               return (
                   <ListItemText
                       className={classes.li}
                       primary={key != 'date' ? row[key] : new Date(row[key].seconds * 1000).toLocaleDateString()}
                   />
               )
           } else if (key == 'factoring') return (
               <ListItemText
                   className={classes.li}
                   primary={row[key] ? 'Yes' : 'No'}
                   secondary={"Accepts factoring?"}/>
           ); else if (key == 'estTime'){
               if (row.estTime2!=null){
                   return (
                       <ListItemText
                           className={classes.li}
                           primary={`${row[key].split('T')[0]} ${row[key].split('T')[1]} - ${row.estTime2.split('T')[0]} ${row.estTime2.split('T')[1]}`}

                       />
                   )
               }
               else if(row.estTime!=null){
                   return(
                       <ListItemText
                           className={classes.li}
                           primary={`${row[key].split('T')[0]} ${row[key].split('T')[1]}`}

                       />
                   )
               }
           }
       }
    }

    const sortArr = (arr) => {
        // var ret = []
        // if (arr.indexOf('name') > -1) ret.push('name')
        // arr.map(
        //     key => {
        //         if (key != 'name' && key != 'address' && key != 'factoring') {
        //             ret.push(key)
        //         }
        //     }
        // )
        // if (arr.indexOf('address') > -1) ret.push('address')
        // if (arr.indexOf('factoring') > -1) {
        //     ret.push('factoring')
        // }
        // return ret
        var ret = []
        if(arr.includes('phone')) ret  = ['name','address','phone']
        else if(arr.includes('phoneNo'))ret  = ['name','address','phoneNo']
        arr.map(key=> {
            if (!ret?.includes(key)) ret.push(key)
        })
        return ret
    }
    const getMap = (stateObj, label=true) => sortArr(Object.keys(stateObj)).map(key => {
        // if (key != 'history' && key != 'id' && key!='broker' && key != 'pickup' && key !='delivery' && key !='driver' && key!='files' && key!='ext') {
        if (key!='verified'&& key != 'history' && key != 'id' && key != 'broker' && key != 'pickup' && key != 'delivery' && key != 'driver' && key != 'files' && key != 'city' && key != 'state' && key != 'zip' && key != 'address' && key != 'status' && key != 'dispatcher' && key != 'price') {
            return (
                <ListItem key={key}
                          className={classes.li}>
                    {!edit ? getListMarkup(stateObj, key, label) : key != 'factoring' ? <TextField
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
        } else if (key == 'address') {
            return (

                ['address', 'city', 'state', 'zip'].map(
                    key => {
                        return (

                            <ListItem key={key} className={classes.li}
                            >

                                {getListMarkup(stateObj, key)}
                            </ListItem>
                        )
                    }
                )
            )
        }else return <></>
    } )
    return (
        <div className={classes.root}>
            <div className={classes.item} style={level=='Admin'?null:{marginTop: '13px'}}>
                <Typography variant={"button"} style={{marginTop: 8}}  style={level=='Admin'?{marginTop: 8}:{marginTop: '-23px',position:'absolute'}}>
                    Info
                </Typography>
                {getMap(state)}

            </div>
            {level == "Admin" ?
                <div className={classes.item}>
                    <Typography variant={"button"} style={{marginTop: 8}}>
                        Driver
                    </Typography>
                    {getMap({name:state.driver.name, email:state.driver.email, phoneNo:state.driver.phoneNo})}
                </div>
                :null}

            <div className={classes.item}>

                <Typography variant={"button"} style={{marginTop: 8}}>
                    Pickup
                </Typography>
                {
                    getMap(state.pickup, false)
                }
            </div>
            <div className={classes.item}>

                <Typography variant={"button"} style={{marginTop: 8}}  style={level=='Admin'?{marginTop: 8}:{marginTop: '-23px',position:'absolute'}}>
                    Delivery
                </Typography>
                {
                    getMap(state.delivery, false)
                }
            </div>
            {level == "Admin" ?
                <div className={classes.item}>
                    <Typography variant={"button"} style={{marginTop: 8}}>
                        Broker
                    </Typography>
                    {getMap(state.broker, false)}
                </div>
                : null}


        </div>

    )
}

