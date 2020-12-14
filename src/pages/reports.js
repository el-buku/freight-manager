import {useState,useEffect} from 'react'
import {Button, Grid, Paper, Typography, Divider} from '@material-ui/core'
import {Alert} from '@material-ui/lab';
import {useCollectionDataOnce} from 'react-firebase-hooks/firestore'
import firebase from '../config/firebase'
import excel from 'exceljs'

import dynamic from 'next/dynamic'


import {Select, InputLabel, makeStyles, MenuItem, TextField} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    label: {
        marginBottom:8
    },
}));

export default function Data({classes}){
    const [orders, loading0, error0] = useCollectionDataOnce(
        firebase.firestore().collection('orders')
    )
    const [dispatchers, loading1, error1] = useCollectionDataOnce(
        firebase.firestore().collection('dispatchers')
    )
    const [drivers, loading2, error2] = useCollectionDataOnce(
        firebase.firestore().collection('drivers')
    )
    const [brokers, loading3, error3] = useCollectionDataOnce(
        firebase.firestore().collection('brokers')
    )
    const [customers, loading4, error4] = useCollectionDataOnce(
        firebase.firestore().collection('customers')
    )
    if(!loading0&&!loading1&&!loading2&&!loading3&&!loading4) {
        dispatchers.push({name: 'Admin'}, {name: 'Any'})
        brokers.push({name: 'Any'})
        drivers.push({name: 'Any'})
        customers.push({name: 'Any'})
    }
    return(
        <>
            {!loading0&&!loading1&&!loading2&&!loading3&&!loading4?
                <Reports classes={classes} orders={orders} dispatchers={dispatchers} drivers={drivers} customers={customers} brokers={brokers}></Reports>
                :null
            }
        </>
    )
}

function Reports({classes, orders, dispatchers, drivers, customers, brokers}) {
    const [alert, setAlert] = useState(false)
    const [dispatcher, setDispatcher] = useState('Any')
    const [driver, setDriver] = useState('Any')
    const [broker, setBroker] = useState('Any')
    const [pickUp, setPickUp] = useState('Any')
    const [delivery, setDelivery] = useState('Any')
    const [from, setFrom] = useState()
    const [to, setTo] = useState()
    useEffect(()=>console.log(from),[from])
    const checkOrder = (order) => {
        var check= true
        if(dispatcher!='Any' && order.dispatcher.name!=dispatcher) check=false;
        if(driver!='Any' && order.driver.name!=driver) check=false;
        if(broker!='Any' && order.broker.name!=broker) check=false;
        if(pickUp!='Any' && order.pickup.name!=pickUp) check=false;
        if(delivery!='Any' && order.delivery.name!=delivery) check=false;
        if (from) if(new Date(order.date.seconds*1000)<new Date(from)) check=false
        if (to) if(new Date(order.date.seconds*1000)>new Date(to)) check=false

        if(check==true) return order


    }

    const generateExcel = (reportOrders)=>{
        const wb = new excel.Workbook()
        const ws = wb.addWorksheet('Orders')
        ws.columns = [
            {header:'Load ID', key:'id'},
            {header:'Date', key:'date'},
            {header:'Broker', key:'brname'},
            {header:'Driver', key:'drname'},
            {header:'Load Info', key: 'description'},
            {header:'Pickup Address',key:'paddress'},
            {header:'Pickup City', key:'pcity'},
            {header:'Pickup State', key:'pstate'},
            {header:'Pickup Zip', key:'pzip'},
            {header:'Delivery Address', key:'daddress'},
            {header:'Delivery City', key:'dcity'},
            {header:'Delivery State', key:'dstate'},
            {header:'Delivery ZIP', key:'dzip'},
            {header:'Payment Notes', key:'paymentNotes'},
            {header:'Payment Method', key:'paymentMethod'},
            {header:'Price', key:'price'},
            {header:'Dispatcher', key:'diname'},
            {header:'Invoiced', key:'invoiced'},
            {header:'Status', key:'status'}
        ]
        var orders = reportOrders.map(order=>{
            const {pickup, delivery, driver, dispatcher, broker}=order
            const p = pickup
            const d = delivery
            return {...order, brname:broker.name, drname:driver.name, paddress:p.address, pcity:p.city, pstate:p.state, pzip:p.zip, daddress:d.address,dcity:d.city,dstate:d.state,dzip:d.zip,diname:dispatcher?.name }
        })
        ws.addRows(orders)
        return wb.xlsx
    }

    const generateReport = () => {
        const reportOrders =  orders.filter(
            order=>checkOrder(order)
        )
        console.log(reportOrders)
        if(reportOrders.length){
            if(window){
                setAlert(false)
                fetch(`/api/get_report`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reportOrders:reportOrders
                    }),
                }).then(async res => {
                    console.log(res)
                    if (res.status === 200) {
                        const blob = await res.blob();
                        console.log(blob)
                        const fileSaver =  require('file-saver')
                        fileSaver.saveAs(blob, 'report.xlsx')
                    }
                })

            }
        }else setAlert(true)

    }
    return (
        <>
            {alert ?
                <Alert
                    severity="error" onClose={() => setAlert(false)} style={{marginBottom: '0.5em'}}>No matching orders.</Alert>
                :null
            }
            <div style={{display: 'flex', marginBottom: '0.5em'}}>
                <Typography component="h2" variant="h4" color="primary" gutterBottom style={{marginBottom: 0}}>
                    Reports
                </Typography>
                <Button variant={"contained"} color={"primary"} style={{marginLeft: 'auto'}}>
                    Generate Report
                </Button>
            </div>
            <Divider style={{marginBottom: '0.5em'}}/>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div style={{marginBottom:10}}>
                            <InputLabel className={classes.label}>Dispatcher</InputLabel>
                            <Select variant={"outlined"} value={dispatcher} fullWidth
                                    onChange={(event) => setDispatcher(event.target.value)}>
                                {dispatchers.map(item => <MenuItem key={item.name}
                                                               value={item.name}>{item.name}</MenuItem>)}
                            </Select>
                        </div>
                        <div style={{marginBottom:10}}>
                            <InputLabel className={classes.label}>Driver</InputLabel>
                            <Select variant={"outlined"} value={driver} fullWidth
                                    onChange={(event) => setDriver(event.target.value)}>
                                {drivers.map(item => <MenuItem key={item.name}
                                                               value={item.name}>{item.name}</MenuItem>)}
                            </Select>
                        </div>
                        <div style={{marginBottom:10}}>
                            <TextField
                                id="datetime-local"
                                label="From"
                                variant={"outlined"}
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                name={"from"}
                                value={from}
                                onChange={evt=>setFrom(evt.target.value)}
                                style={{width: 'fit-content', marginRight:10}}
                            />


                            <TextField
                                id="datetime-local"
                                label="To"
                                type="date"
                                variant={"outlined"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                name={"to"}
                                value={to}
                                onChange={evt=>setTo(evt.target.value)}
                                style={{width: 'fit-content'}}
                            />
                        </div>
                        <Button fullWidth color={'primary'} variant={"outlined"} onClick={generateReport}>Generate Report</Button>
                    </Grid>
                </Grid>
            </Paper>

        </>
    );
}