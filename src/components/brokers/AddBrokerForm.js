import {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import {green, grey} from '@material-ui/core/colors'

import Head from 'next/head'

import firebase from '../../config/firebase'

const useStyles = makeStyles((theme) => ({
    root: {
        display:'flex',
        flexDirection:'column',
        '& > *': {
            flex:1,
            margin: theme.spacing(1),
        },
    },
}));

const GreenSwitch = withStyles({
    switchBase: {
        color: grey[700],
        '&$checked': {
            color: green[500],
        },
        '&$checked + $track': {
            backgroundColor: green[500],
        },
    },
    checked: {},
    track: {},
})(Switch);

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

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
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
    {
        return (true)
    }
    return (false)
}

export default function BrokerForm(props) {

    const query = useMediaQuery('(max-width:768px)')
    const {callback, broker} = props
    const classes = useStyles();
    const [name, setName] = useState(broker?.name || '')
    const [email,setEmail] = useState(broker?.email || '')
    const [error, setErr] = useState({})
    const [address, setAddress] = useState(broker?.address||'')
    const [phoneNo, setPhoneNo] = useState(broker?.phoneNo||'')
    const [city, setCity] = useState(broker?.city||'')
    const [state, setState] = useState(broker?.state||'')
    const [zip, setZip] = useState(broker?.zip||'')
    const [contactEmail, setContactEmail] = useState(broker?.contactEmail||'')
    const [factoring, setFactoring] = useState(broker?.factoring || false)
    const history= broker?.history || []
    const validateForm = () => {
        // console.log(validateEmail(email))
        if (email!=''&&name!=''){
            const brokerobj = {name, email, address, phoneNo, city, state, zip, contactEmail, factoring, history:[]}
            firebase.firestore().collection('brokers').doc(name).set(brokerobj).then(()=>callback('success', brokerobj)).catch(()=>callback('error'))
            setErr({})
        }else{
            var n,e
            if(name=='')n=true
            if(email=='')e=true
            setErr({name:n, email:e})
        }
    }
    return (
        <div className={classes.root} style={query?{flexDirection:"column"}:null}>
            <TextField label={"Name"} variant={"outlined"} value={name} error={error.name}onChange={(event)=>setName(event.target.value)}/>

            <TextField label={"Address"} variant={"outlined"} value={address} onChange={(event)=>setAddress(event.target.value)} />
            <TextField label={"City"} variant={"outlined"} value={city} onChange={(event)=>setCity(event.target.value)}></TextField>
            <TextField label={"State"} variant={"outlined"} value={state} onChange={(event)=>setState(event.target.value)}></TextField>
            <TextField label={"ZIP"} variant={"outlined"} value={zip} onChange={(event)=>setZip(event.target.value)}></TextField>
            <TextField label={"Phone"} variant={"outlined"} value={phoneNo} onChange={(event)=> {
                setPhoneNo(event.target.value);
            }} InputProps={{inputComponent:TextMaskCustom}}/>
            <TextField label={"Contact Email"} variant={"outlined"} value={contactEmail} onChange={(event)=>setContactEmail(event.target.value)}></TextField>
            <TextField label={"Accounting Email"} variant={"outlined"} value={email} error={error.email} onChange={(event)=>setEmail(event.target.value)}/>

            <FormControlLabel
                control={  <GreenSwitch
                    checked={factoring}
                    onChange={event=>setFactoring(event.target.checked)}
                ></GreenSwitch>}
                label={factoring?"Accepts factoring":"Does not accept factoring"}
            />



            <Button variant={"contained"} color={"primary"} onClick={validateForm}>Submit</Button>
        </div>
    );
}
