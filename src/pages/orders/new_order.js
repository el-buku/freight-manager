import {useState, useEffect} from 'react';
import {useRouter} from 'next/router'
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Button from '@material-ui/core/Button'
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {FormHelperText, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Divider, InputAdornment} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';

import Alert from '@material-ui/lab/Alert'

import NumberFormat from 'react-number-format'

import firebase from '../../config/firebase'
import {usStates} from '../../config/usStates'
import {useCollectionData} from 'react-firebase-hooks/firestore'

import AddBrokerForm from '../../components/brokers/AddBrokerForm'
import AddDriverForm from '../../components/drivers/AddDriverForm'

import EditIcon from '@material-ui/icons/Edit';

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles((theme) => (
    {
        root: {
            backgroundColor: 'rgba(0, 0, 0, .03)',
            borderBottom: '1px solid rgba(0, 0, 0, .125)',
            marginBottom: -1,
            minHeight: 56,
            '&$expanded': {
                minHeight: 56,
            }
        },
        content: {
            '&$expanded': {
                margin: '12px 0',
            },
        },
        expanded: {},
    }
))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            marginBottom: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        '&:last-child': {
            marginRight: 0
        },
        '& > div': {

        }

    },


}))(MuiAccordionDetails);

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
            flex: 1,
            margin: theme.spacing(1),
        }

    },
}));

function NumberFormatCustom(props) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange(values);
            }}
            thousandSeparator
            isNumericString
            prefix="$"
        />
    );
}


function TextMaskCustom(props) {
    const {inputRef, ...other} = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};


function validateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return (true)
    }
    return (false)
}

const customerInitialState = {
    email: "",
    address: "",
    city: "",
    contactPerson: "",
    estTime: null,
    estTime2:null,
    name: "",
    phone: "",
    state: "",
    zip: "",
    ext: "",
}
export default function OrderForm({order, ...props}) {
    const [edit, setEdit] = useState(false)
    const [search, setSearch] = useState('')
    const router = useRouter()
    const query = useMediaQuery('(max-width:768px)')
    const {callback, user} = props
    console.log(user)
    const classes = props.classes;
    const [orderId, setId] = useState(order?.id || '')
    const [weight, setWeight] = useState(order?.weight || null)
    const [price, setPrice] = useState(order?.price || null)
    const [description, setDescription] = useState(order?.description || '')
    const [notes, setNotes] = useState(order?.notes || '')

    const [useCustomerAddress, setUseCustomerAddress] = useState(true)


    const [add, setAdd] = useState({driver: false, broker: false, customer: true})
    const [alert, setAlert] = useState({driver: false, broker: false, customer: false})

    const [pickup, setPickup] = useState(order?.pickup || customerInitialState)
    const [delivery, setDelivery] = useState(order?.delivery || customerInitialState)

    const [brokers, loading, error] = useCollectionData(
        firebase.firestore().collection('brokers'),
        {
            snapshotListenOptions: {includeMetadataChanges: true},
        }
    );

    const [broker, setBroker] = useState(order?.broker||{})
    // const [customers, loading2, error2] = useCollectionData(
    //     firebase.firestore().collection('customers'),
    //     {
    //         snapshotListenOptions: {includeMetadataChanges: true},
    //     })
    // const [customer, setCustomer] = useState()
    const [drivers, loading3, error3] = useCollectionData(
        firebase.firestore().collection('drivers'),
        {
            snapshotListenOptions: {includeMetadataChanges: true},
        })
    const [driver, setDriver] = useState(order?.driver||{})

    const [paymentNotes, setPaymentNotes] = useState('')
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })
    const pushToFirestore = (item, id, col) => {
        const firestore = firebase.firestore()
        firestore.collection(col).doc(id).set(item)
    }
    const pushData = (orderInfo, arr) => {
        var c = 0
        for (var item of arr) {
            try {
                item.history.push(orderInfo)
            } catch (e) {
                item.history = [orderInfo]
            }
            switch (c) {
                case 0:
                    pushToFirestore(item, item.name, 'drivers')
                    break;
                case 1:
                    pushToFirestore(item, item.name, 'brokers')
                    break
                default:
                    pushToFirestore(item, item.name, 'customers')
                    break
            }
            c += 1
        }
    }
    const validateForm = () => {
        const date = new Date()

        const order = {
            id: orderId,
            status: 'New',
            statusCode: 0,
            weight,
            price,
            description,
            notes,
            pickup,
            delivery,
            driver,
            broker,
            paymentNotes,
            date,
            files: {},
            paymentMethod:'',
        }
        if(user.dispatcher==true){order.dispatcher={name:user.name, email:user.email}}
        else {order.dispatcher={name:"Admin", email:user.email}}
        const orderInfo = {id: orderId, date}
        pushData(orderInfo, [driver, broker, pickup, delivery])
        firebase.firestore().collection('orders').doc(orderId).set(order).then(
            () => {
                fetch('/api/order_added', {method: 'POST', body: JSON.stringify(order)})
                router.push(`/`)
            }
        )
    }
    const handlePickup = (event, val=null) => {
        if(val!=null) {
            pickup['state'] = val
            setPickup({...pickup})
        }else{
            pickup[event.target.name] = event.target.value
            setPickup({...pickup})
        }
    }
    const handleDelivery = (event, val=null) => {
        if(val!=null){
            delivery['state'] = val
            setDelivery({...delivery})
        }else
        {
            delivery[event.target.name] = event.target.value
            setDelivery({...delivery})
        }
    }
    return (
        <>
            <div style={{display: 'flex', marginBottom: '0.5em'}}>
                <Typography component="h2" variant="h4" color="primary" gutterBottom style={{marginBottom: 0}}>
                    New Order
                </Typography>
            </div>
            <Divider style={{marginBottom: '0.5em'}}/>

            <Paper className={classes.paper} style={{overflow: 'hidden'}}>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Order Info</Typography>
                            </AccordionSummary>
                            <AccordionDetails style={query ? {flexDirection: 'row'} : null}>

                                <div style={{width:'100%', display:'flex'}}>
                                    <TextField  label={"Order ID"} variant={"outlined"} value={orderId}
                                                style={{marginRight: 8, width:'50%'}}
                                                onChange={(event) => setId(event.target.value)}/>
                                    <TextField  type={"number"} label={"Weight"} variant={"outlined"}
                                                style={{width:'50%'}}
                                                value={weight}
                                                onChange={(event) => setWeight(event.target.value)}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">lbs.</InputAdornment>,
                                                }}
                                    />

                                </div>
                                <TextField label={"Order Description"} variant={"outlined"} value={description} fullWidth
                                           multiline
                                           onChange={(event) => setDescription(event.target.value)}/>

                                {
                                    alert.driver ?
                                        <Alert color={"success"} onClose={() => {
                                            setAlert({...alert, driver: !alert.driver})
                                        }} style={{margin: '0.5em 0'}}
                                        >Driver added!</Alert> : null
                                }
                                <InputLabel>Driver</InputLabel>

                                <div style={{width: '100%', display: 'flex'}}>
                                    <Select variant={"outlined"} value={driver} renderValue={item=>item.name} fullWidth
                                            onChange={(event) => setDriver(event.target.value)}>
                                        {drivers?.map(item => <MenuItem key={item.name}
                                                                        value={item}>{item.name}</MenuItem>)}
                                    </Select>
                                    <IconButton
                                        style={{marginRight: '-0.5em'}}
                                        aria-label="delete"
                                        onClick={() => setAdd({...add, driver: !add.driver})}
                                    >
                                        {add.driver ? <CancelIcon/> : <AddCircleIcon/>}
                                    </IconButton>

                                </div>
                                {add.driver ? <AddDriverForm callback={(driver) => {
                                    setAdd({...add, driver: !add.driver})
                                    setAlert({...alert, driver: !alert.driver})
                                }}/> : null}
                                <TextField label={"Driver Notes"} variant={"outlined"} value={notes} fullWidth
                                           multiline
                                           onChange={(event) => setNotes(event.target.value)}/>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Pick-up</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                style={query ? {flexDirection: 'column', flexWrap: 'wrap'} : {flexWrap: 'wrap'}}>
                                <Info resource={pickup} callback={handlePickup}/>

                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Delivery</Typography>
                            </AccordionSummary>
                            <AccordionDetails

                                style={query ? {
                                    borderBottom: '1px solid gainsboro',
                                    flexDirection: 'column', flexWrap: 'wrap'
                                } : {
                                    borderBottom: '1px solid gainsboro',
                                    flexWrap: 'wrap'
                                }}>
                                {/*<FormControlLabel*/}
                                {/*    control={<Switch*/}
                                {/*        checked={useCustomerAddress}*/}
                                {/*        onChange={event => setUseCustomerAddress(event.target.checked)}*/}
                                {/*    ></Switch>}*/}
                                {/*    label={"Use customer's address"}*/}
                                {/*/>*/}
                                <Info resource={delivery} callback={handleDelivery}/>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Broker Info</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                style={{display:'flex',flexWrap:'wrap',flexDirection:'column'}}>

                                {
                                    alert.broker ?
                                        <Alert color={"success"} onClose={() => {
                                            setAlert({...alert, broker: !alert.broker})
                                        }} style={{margin: '0.5em 0'}}
                                        >Broker added!</Alert> : null
                                }

                                <div style={{width: '100%', display: 'flex'}}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        onChange={(event, newVal)=>setBroker(newVal)}
                                        fullWidth
                                        options={brokers}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => <TextField {...params} fullWidth label="Broker" variant="outlined" />}
                                    />
                                    {broker?.name?
                                        <IconButton
                                            style={{marginRight: '-0.5em'}}
                                            aria-label="delete"
                                            onClick={()=> {
                                                setAdd({...add, broker:false})
                                                setEdit(true)
                                            }}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        :null}


                                    <IconButton
                                        style={{marginRight: '-0.5em'}}
                                        aria-label="delete"

                                    >
                                        {add.broker || edit ? <CancelIcon
                                            onClick={() => {
                                                setAdd({...add, broker:false})
                                                setEdit(false)
                                            }}
                                        /> : <AddCircleIcon
                                            onClick={() => {
                                                setAdd({...add, broker:true})
                                                setEdit(false)
                                            }}
                                        />}
                                    </IconButton>
                                </div>
                                {order!=undefined&&order?.broker.name==broker.name?`Currently selected: ${broker.name}`:null}

                                {broker != {} && broker?.factoring == false ?
                                    <FormHelperText style={{color: 'red'}}>This broker does not accept
                                        factoring</FormHelperText>
                                    : null}
                                {add.broker ? <AddBrokerForm callback={() => {
                                    setAdd({...add, broker: !add.broker})
                                    setAlert({...alert, broker: !alert.broker})
                                }}/> : null}
                                {edit?
                                    <AddBrokerForm  broker={broker} callback={(broker)=>{
                                        setAlert({...alert, broker: !alert.broker})
                                        setEdit(false)
                                    }
                                    }/>
                                    :null}
                                {
                                    alert.customer ?
                                        <Alert color={"success"} onClose={() => {
                                            setAlert({...alert, customer: !alert.customer})
                                        }} style={{margin: '0.5em 0'}}
                                        >Customer added!</Alert> : null
                                }

                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Price</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                style={query ? {flexDirection: 'column', flexWrap: 'wrap'} : {flexWrap: 'wrap'}}>
                                <TextField fullWidth type={"number"} label={"Price"} variant={"outlined"} value={price}
                                           style={{marginTop: 8}}
                                           onChange={(event) => {
                                               setPrice(event.target.value);
                                           }}/>
                                <TextField label={"Payment Notes"} variant={"outlined"} value={paymentNotes} fullWidth
                                           multiline
                                           onChange={(event) => setPaymentNotes(event.target.value)}/>
                            </AccordionDetails>
                        </Accordion>
                        <Button fullWidth style={{marginTop: 8}} variant={"contained"} color={"primary"}
                                onClick={validateForm}>Submit</Button>
                    </Grid></Grid></Paper>
        </>
    );
}

function Info({resource, callback}) {
    return (
        <>
            <TextField label={"Business Name"} name={"name"} variant={"outlined"} value={resource.name}
                       style={{flexGrow:1}}
                       onChange={callback}/>
            <TextField label={"Email"} name={"email"} variant={"outlined"} value={resource.email}
                       style={{flexGrow:1}}
                       onChange={callback}/>

            <TextField label={"Address"} name={"address"}
                       variant={"outlined"} value={resource.address}
                       multiline
                       onChange={callback}/>
            <TextField label={"City"} name="city" variant={"outlined"} value={resource.city}
                       onChange={callback}></TextField>

            <Autocomplete
                id="combo-box-demo"
                name="state"
                onChange={(event, newVal)=>callback(event, newVal)}

                options={usStates}
                renderInput={(params) => <TextField {...params} fullWidth label="State" variant="outlined" />}
            />

            <TextField label={"ZIP"} name="zip" variant={"outlined"} value={resource.zip}

                       onChange={callback}></TextField>
            <TextField label={"Contact Person"} name={"contactPerson"} variant={"outlined"}
                       value={resource.contactPerson} onChange={callback}/>
            <div style={{display: 'flex'}}>


                <TextField fullWidth label={"Phone"} name={"phone"} variant={"outlined"} value={resource.phone}
                           onChange={callback}
                           style={{marginRight:8}}
                           InputProps={{inputComponent: TextMaskCustom}}/>
                <TextField label={"Ext."} name={"ext"} variant={"outlined"} value={resource.ext} onChange={callback}
                           defaultValue={"+1"}/>
            </div>
            <div>
                <TextField
                    id="datetime-local"
                    label="Est. Time "
                    type="datetime-local"
                    defaultValue={resource.estTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    name={"estTime"}
                    value={resource.estTime}
                    onChange={callback}
                    style={{width: 'fit-content'}}
                />
                <TextField
                    id="datetime-local"
                    type="datetime-local"
                    label = {'Est Time 2'}
                    defaultValue={resource.estTime2}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    name={"estTime2"}
                    value={resource.estTime2}
                    onChange={callback}
                    style={{width: 'fit-content'}}
                />
            </div>

        </>
    )
}
