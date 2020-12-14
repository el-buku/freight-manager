import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from '../../../config/firebase'

import {Grid, Paper, Table, TableContainer, TableBody} from '@material-ui/core'

import OrderForm from '../new_order.js'

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
    if (order!=undefined)return <OrderForm order={order}classes={classes}user={user}/>
    else return <></>
}