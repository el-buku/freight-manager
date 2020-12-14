import React, {useState, useEffect} from 'react'
import {Row} from '../components/drivers/DriverRow'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import {Skeleton, Alert} from '@material-ui/lab';

import {
    Toolbar,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    TextField,
    useMediaQuery,
    TablePagination
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'


import clsx from 'clsx'

import AddDriverForm from '../components/drivers/AddDriverForm'

import {
    makeStyles, lighten
} from '@material-ui/core/styles';

import firebase from '../config/firebase'
import {useCollectionData} from 'react-firebase-hooks/firestore'

import EnhancedTableToolbar from '../components/shared/EnhancedTableToolbar'

function DriversTable({drivers, classes}) {
    const [selected, setSelected] = useState([])
    const [driversList, setDrivers] = useState(drivers)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearch = (searchVal) => {
        if (searchVal == '') {
            setDrivers(drivers)
        } else {
            var list = []
            drivers.map(driver => {
                if (driver.name.toLowerCase().includes(searchVal.toLowerCase()))
                    list.push(driver)
            })
            setDrivers(list)
        }
    }
    const deleteCallback = (name) => {
        firebase.firestore().collection('drivers').doc(name).delete().then(()=>{
            var arr = driversList.filter(item=>item.name!=name)
            setDrivers(arr)
        })
    }
    return (
        <Paper className={classes.paper2}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <EnhancedTableToolbar numSelected={selected.length} handleSearch={handleSearch}/>
                    <TableContainer>
                        <Table aria-label="collapsible table">
                            <TableBody>
                                {driversList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <Row key={row.name} row={row} deleteCallback={deleteCallback}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className={classes.pagination}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={driversList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}



function AddDriver({classes,callback}) {
    return (
        <>

            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {/*<ReactGoogleMapLoader*/}
                        {/*    params={{*/}
                        {/*        key: process.env.MAPS_API_KEY, // Define your api key here*/}
                        {/*        libraries: "places", // To request multiple libraries, separate them with a comma*/}
                        {/*    }}*/}
                        {/*    render={googleMaps => googleMaps && <AddBrokerForm></AddBrokerForm>}*/}
                        {/*/>*/}
                        <AddDriverForm callback={callback}/>
                    </Grid>
                </Grid>
            </Paper>
            <Divider style={{marginBottom: '0.5em'}}/>
        </>
    )
}

export default function DriversPage({classes}) {
    const [add, setAdd] = useState(false)
    const [drivers, setDrivers] = useState([]);
    const getDrivers = ()=>{
        firebase.firestore().collection('drivers').get().then(
            (querySnapshot)=>{
                var customersCol=[]
                querySnapshot.forEach(doc=>{
                    customersCol.push(doc.data())
                })
                setDrivers(customersCol)
            }
        )
    }
    useEffect(getDrivers,[])
    const [formStatus, setStatus]  = useState('')
    const formCallback = (status, driver) => {
        drivers.push(driver)
        setDrivers([])
        getDrivers()
        setAdd(false)
        setStatus(status)
    }
    return (
        <React.Fragment>
            {formStatus!=''?
                <Alert color={formStatus=='error'?"error":"success"}onClose={() => {setStatus('')}} style={{marginBottom: '0.5em'}}>{formStatus=='success'?"Driver added!":"Error"}</Alert>
                :null
            }
            <div style={{display: 'flex', marginBottom: '0.5em'}}>
                <Typography component="h2" variant="h4" color="primary" gutterBottom style={{marginBottom: 0}}>
                    Drivers
                </Typography>
                {add ?
                    <Button variant={"contained"} color={"secondary"} style={{marginLeft: 'auto'}}
                            onClick={() => setAdd(false)}>
                        Cancel
                    </Button> :
                    <Button variant={"contained"} color={"primary"} style={{marginLeft: 'auto'}}
                            onClick={() => setAdd(true)}>
                        Add New
                    </Button>
                }
            </div>
            <Divider style={{marginBottom: '0.5em'}}/>
            {add?             <AddDriver classes={classes} callback={formCallback}  />
                :null}
            {
                drivers.length?
                    <DriversTable drivers={drivers} classes={classes}></DriversTable>
                    :
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Skeleton variant={"text"} animation={"pulse"}/>
                                <Skeleton variant={"text"} animation={"wave"}/>
                                <Skeleton variant={"text"} animation={"pulse"}/>
                            </Grid>
                        </Grid>
                    </Paper>


            }

        </React.Fragment>
    );
}