import {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'


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

export default function DriverForm(props) {

    const query = useMediaQuery('(max-width:768px)')
    const {callback} = props
    const classes = useStyles();
    const [name, setName] = useState('')
    const [email,setEmail] = useState('')
    const [error, setErr] = useState({})
    // const [address, setAddress] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    // const [city, setCity] = useState('')
    // const [state, setState] = useState('')
    // const [zip, setZip] = useState('')
    // const [factoring, setFactoring] = useState(false)
    const validateForm = () => {
        // console.log(validateEmail(email))
        if (email!=''&&name!=''){
            const customer = {name, email, phoneNo, history:[], verified:false}
            fetch('/api/driver_added', {method: 'POST', body: JSON.stringify(customer)}).then(
                (r)=>{
                    console.log(r)
                }
            )
            firebase.firestore().collection('drivers').doc(name).set(customer).then(
                () => {
                    callback('success', customer)
                }
            ).catch(()=>callback('error'))
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
            <TextField label={"Name"} variant={"outlined"} value={name} error={error.name} onChange={(event)=>setName(event.target.value)}/>
            <TextField label={"Email"} variant={"outlined"} value={email} error={error.email} onChange={(event)=>setEmail(event.target.value)}/>
            <TextField label={"Phone"} variant={"outlined"} value={phoneNo} onChange={(event)=> {
                setPhoneNo(event.target.value);
            }} InputProps={{inputComponent:TextMaskCustom}}/>
            {/*<TextField label={"Address"} variant={"outlined"} value={address} onChange={(event)=>setAddress(event.target.value)} />*/}
            {/*<TextField label={"City"} variant={"outlined"} value={city} onChange={(event)=>setCity(event.target.value)}></TextField>*/}
            {/*<TextField label={"State"} variant={"outlined"} value={state} onChange={(event)=>setState(event.target.value)}></TextField>*/}
            {/*<TextField label={"ZIP"} variant={"outlined"} value={zip} onChange={(event)=>setZip(event.target.value)}></TextField>*/}
            <Button variant={"contained"} color={"primary"} onClick={validateForm}>Submit</Button>
        </div>
    );
}
