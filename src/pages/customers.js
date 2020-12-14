import React, {useState, useEffect} from 'react'
import {Row} from '../components/customers/CustomerRow'
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

import AddCustomerForm from '../components/customers/AddCustomerForm'

import {
    makeStyles, lighten
} from '@material-ui/core/styles';

import firebase from '../config/firebase'
import {useCollectionData} from 'react-firebase-hooks/firestore'

import EnhancedTableToolbar from '../components/shared/EnhancedTableToolbar'

function CustomersTable({customers, classes}) {
    const [selected, setSelected] = useState([])
    const [customersList, setCustomers] = useState(customers)
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
            setCustomers(customers)
        } else {
            var list = []
            customers.map(customer => {
                if (customer.name.toLowerCase().includes(searchVal.toLowerCase()))
                    list.push(customer)
            })
            setCustomers(list)
        }
    }
    const deleteCallback = (name) => {
        firebase.firestore().collection('customers').doc(name).delete().then(()=>{
            var arr = customersList.filter(item=>item.name!=name)
            setCustomers(arr)
        })
    }
    return (
        <Paper className={classes.paper2}>
            <Grid container>
                <Grid item xs={12}>
                    <EnhancedTableToolbar numSelected={selected.length} handleSearch={handleSearch}/>
                    <TableContainer>
                        <Table aria-label="collapsible table">
                            <TableBody>
                                {customersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <Row key={row.name} row={row} deleteCallback={deleteCallback}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className={classes.pagination}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={customersList.length}
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



function AddCustomer({classes,callback}) {
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
                        <AddCustomerForm callback={callback}/>
                    </Grid>
                </Grid>
            </Paper>
            <Divider style={{marginBottom: '0.5em'}}/>
        </>
    )
}

export default function CustomersPage({classes}) {
    const [add, setAdd] = useState(false)
    const [customers, setCustomers] = useState([]);
    const getCustomers = ()=>{
        firebase.firestore().collection('customers').get().then(
            (querySnapshot)=>{
                var customersCol=[]
                querySnapshot.forEach(doc=>{
                    customersCol.push(doc.data())
                })
                setCustomers(customersCol)
            }

        )
    }
    useEffect(getCustomers,[])
    const [formStatus, setStatus]  = useState('')
    const formCallback = (status, customer) => {
        customers.push(customer)
        setCustomers(customers)
        setAdd(false)
        setStatus(status)
    }
    return (
        <React.Fragment>
            {formStatus!=''?
                <Alert color={formStatus=='error'?"error":"success"}onClose={() => {setStatus('')}} style={{marginBottom: '0.5em'}}>{formStatus=='success'?"Customer added!":"Error"}</Alert>
                :null
            }
            <div style={{display: 'flex', marginBottom: '0.5em'}}>
                <Typography component="h2" variant="h4" color="primary" gutterBottom style={{marginBottom: 0}}>
                    Customers
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
            {add?             <AddCustomer classes={classes} callback={formCallback}  />
                :null}
            {
                customers.length?
                    <CustomersTable customers={customers} classes={classes}></CustomersTable>
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