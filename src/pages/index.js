import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'

import {Row} from '../components/orders/OrdersRow'
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

import EnhancedTableToolbar from '../components/orders/EnhancedTableToolbar'

export function OrdersTable({orders, classes, user, refresh}){
    const [selected, setSelected] = useState([])
    const [ordersList, setOrders] = useState(orders)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [sort, setSort] = React.useState('DESC')

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearch = (searchVal, filter) => {
        if (searchVal == '') {
            setOrders(orders)
        } else {
            var list = []
            orders.map(order => {
                switch (filter) {
                    case 'Order ID':{
                        if(order.id.toLowerCase().includes(searchVal.toLowerCase())) list.push(order)
                        break
                    }
                    case 'Driver name':{
                        if(order.driver.name.toLowerCase().includes(searchVal.toLowerCase())) list.push(order)
                        break
                    }
                    case 'Broker name':{
                        if(order.broker.name.toLowerCase().includes(searchVal.toLowerCase())) list.push(order)
                        break
                    }
                    case 'Pickup name':{
                        if(order.pickup.name.toLowerCase().includes(searchVal.toLowerCase())) list.push(order)
                        break
                    }
                    case 'Delivery name':{
                        if(order.pickup.name.toLowerCase().includes(searchVal.toLowerCase())) list.push(order)
                        break
                    }
                    case 'Pickup address':{
                        if(order.pickup.address.toLowerCase().includes(searchVal.toLowerCase()) || order.pickup.city.toLowerCase().includes(searchVal.toLowerCase()) || order.pickup.state.toLowerCase().includes(searchVal.toLowerCase()) || order.pickup.zip.toLowerCase().includes(searchVal.toLowerCase())) list.push(order)
                        break
                    }
                    case 'Delivery address':{
                        if(order.delivery.address.toLowerCase().includes(searchVal.toLowerCase()) || order.delivery.city.toLowerCase().includes(searchVal.toLowerCase()) || order.delivery.state.toLowerCase().includes(searchVal.toLowerCase()) || order.delivery.zip.toLowerCase().includes(searchVal.toLowerCase())) list.push(order)
                        break
                    }
                }
            })
            setOrders(list)
        }
    }
    const handleStatus = (status) => {
        switch(status){
            case 'All':{
                setOrders(orders)
                break
            }
            case 'Invoiced':{

                var list=[]
                orders.map(
                    order=>{
                        if(order.invoiced) list.push(order)
                    }
                )
                setOrders(list)
                break
            }
            default:{
                var list=[]
                orders.map(
                    order=>{
                        if(order.status==status) list.push(order)
                    }
                )
                setOrders(list)
            }
        }
    }

    const deleteCallback = (name) => {
        firebase.firestore().collection('orders').doc(name).delete().then(()=>{
            var arr = ordersList.filter(item=>item.name!=name)
            setCustomers(arr)
        })
    }

    const sortFn = (a,b) => {
        if(sort=='DESC'){
            if(a.date.seconds>b.date.seconds) return -1;
            else return 1;
        } else {
            if(a.date.seconds>b.date.seconds) return 1;
            else return -1;
        }
    }

    return (
        <Paper className={classes.paper2}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <EnhancedTableToolbar numSelected={selected.length} handleSort={setSort} handleSearch={handleSearch} handleStatus={handleStatus}/>
                    <TableContainer style={user.accessLevel=='Admin'?null:{marginTop:20}}>
                        <Table aria-label="collapsible table" size="small">
                            <TableBody>
                                {ordersList.sort(sortFn).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <Row key={row.name} row={row} level={user.accessLevel} refresh={refresh} deleteCallback={deleteCallback}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className={classes.pagination}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={ordersList.length}
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

export default function OrdersPage({classes, user}) {
    const [orders, setOrders] = useState([]);
    const router = useRouter()
    const getOrders = ()=>{
        firebase.firestore().collection('orders').get().then(
            (querySnapshot)=>{
                var customersCol=[]
                querySnapshot.forEach(doc=>{
                    if(user.accessLevel=="Admin") customersCol.push(doc.data());
                    else if (doc.data().driver.email==user.email){
                        customersCol.push(doc.data())
                    }
                })
                setOrders(customersCol)
            }

        )
    }
    const refreshHook=()=>{
        setOrders([]);
        getOrders()
    }
    useEffect(getOrders,[])
    const [formStatus, setStatus]  =  useState('')
    useEffect(()=>setStatus(router.query.status),[])
    // const formCallback = (status, customer) => {
    //     customers.push(customer)
    //     setCustomers(customers)
    //     setAdd(false)
    //     setStatus(status)
    // }

    return (
        <>
            {formStatus!='' && formStatus!=undefined?
                <Alert color={formStatus!='success'?"error":"success"}onClose={() => {setStatus('')}} style={{marginBottom: '0.5em'}}>{formStatus=='success'?"Order added!":"Error"}</Alert>
                :null
            }
            <div style={{display: 'flex', marginBottom: '0.5em'}}>
                <Typography component="h2" variant="h4" color="primary" gutterBottom style={{marginBottom: 0}}>
                    Orders
                </Typography>
                {
                    user.accessLevel=="Admin"?<Button variant={"contained"} color={"primary"} style={{marginLeft: 'auto'}}
                                                      onClick={() => router.push('/orders/new_order')}>
                        Add New
                    </Button>:null
                }
            </div>

            {
                orders.length?
                    <OrdersTable orders={orders} user={user} classes={classes} refresh={refreshHook}></OrdersTable>
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
        </>
    );
}