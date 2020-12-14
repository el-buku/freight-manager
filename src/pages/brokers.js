import React, {useState, useEffect} from 'react'
import {Row} from '../components/brokers/BrokerRow'
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
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel';

import clsx from 'clsx'

import AddBrokerForm from '../components/brokers/AddBrokerForm'

import {
    makeStyles, lighten
} from '@material-ui/core/styles';

import firebase from '../config/firebase'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import EnhancedTableToolbar from '../components/shared/EnhancedTableToolbar'


function BrokersTable({brokers, classes}) {
    const [selected, setSelected] = useState([])
    const [brokersList, setBrokers] = useState(brokers)
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
            setBrokers(brokers)
        } else {
            var list = []
            brokers.map(broker => {
                if (broker.name.toLowerCase().includes(searchVal.toLowerCase()))
                    list.push(broker)
            })
            setBrokers(list)
        }
    }
    const deleteCallback = (name) => {
        firebase.firestore().collection('brokers').doc(name).delete().then(()=>{
                var arr = brokersList.filter(item=>item.name!=name)
                setBrokers(arr)
        })
    }
    const query= useMediaQuery('(max-width:475px)')
    return (
        <Paper className={classes.paper2}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <EnhancedTableToolbar numSelected={selected.length} handleSearch={handleSearch}/>
                    <TableContainer>
                        <Table size={query?"small":"medium"} aria-label="collapsible table">
                            {/*<TableHead>*/}
                            {/*    <TableRow>*/}
                            {/*        <TableCell>Dessert (100g serving)</TableCell>*/}
                            {/*        <TableCell />*/}


                            {/*    </TableRow>*/}
                            {/*</TableHead>*/}
                            <TableBody>
                                {brokersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <Row key={row.name} row={row} deleteCallback={deleteCallback}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className={classes.pagination}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={brokersList.length}
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



function AddBroker({classes,callback}) {
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
                        <AddBrokerForm callback={callback}/>
                    </Grid>
                </Grid>
            </Paper>
            <Divider style={{marginBottom: '0.5em'}}/>
        </>
    )
}

export default function BrokersPage({classes}) {
    const [add, setAdd] = useState(false)
    const [brokers, setBrokers] = useState([]);
    const getBrokers = ()=>{
        firebase.firestore().collection('brokers').get().then(
            (querySnapshot)=>{
                var brokersCol=[]
                querySnapshot.forEach(doc=>{
                    brokersCol.push(doc.data())
                })
                setBrokers(brokersCol)
            }

        )
    }
    useEffect(getBrokers,[])
    const [formStatus, setStatus]  = useState('')
    const formCallback = (status, broker) => {
        brokers.push(broker)
        setBrokers(brokers)
        setAdd(false)
        setStatus(status)
    }
    return (
        <React.Fragment>
            {formStatus!=''?
                <Alert color={formStatus=='error'?"error":"success"}onClose={() => {setStatus('')}} style={{marginBottom: '0.5em'}}>{formStatus=='success'?"Broker added!":"Error"}</Alert>
                :null
            }
            <div style={{display: 'flex', marginBottom: '0.5em'}}>
                <Typography component="h2" variant="h4" color="primary" gutterBottom style={{marginBottom: 0}}>
                    Brokers
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
            {add?             <AddBroker classes={classes} callback={formCallback}  />
            :null}
            {
                brokers.length?
                    <BrokersTable brokers={brokers} classes={classes}></BrokersTable>
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