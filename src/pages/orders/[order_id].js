import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from '../../config/firebase'

import {Grid, Paper, Table, TableContainer, TableBody} from '@material-ui/core'

import {Row} from '../../components/orders/OrdersRow'

export default function OrderPage({classes, user}){
    const router = useRouter()
    const {order_id} = router.query
    var order
    const [orders, loading, error] = useCollectionData(
        firebase.firestore().collection('orders'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )
    const [archive, loading1, error1]= useCollectionData(
        firebase.firestore().collection('archive'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )
    useEffect(()=>{

    },[orders])
    if(!loading){
        if(orders.length && order_id){
            orders.map(item=>{
                console.log(item)
                if(item.id==order_id.toString()) order=item;
            })
        }
    }
  
    console.log(order)
    if (order!=undefined)return(
        <Paper className={classes.paper}>
            <style>{"td{border:none}"}</style>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table aria-label="collapsible table">
                            <TableBody>
            <Row order_id={order_id} row={{name:order.id,...order} }user={user} level = {user.accessLevel} classes={classes} refresh={
                ()=>router.push(`/orders/${order_id}`)
            }/>
                            </TableBody></Table></TableContainer></Grid></Grid></Paper>)
    else return <></>
}