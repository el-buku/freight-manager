import {useState,useEffect} from 'react';
import {Button, Divider, Grid, Paper, TextField, Typography} from '@material-ui/core'
import firebase from '../config/firebase'
import {useCollectionDataOnce} from 'react-firebase-hooks/firestore'
import {useRouter} from 'next/router'

function Edit(props) {
    console.log(props)
    const {classes, email, pass, template, callback, template2} = props
    const [email1, setEmail] = useState()
    const [pass1, setPass] = useState()
    const [template1, setTemplate] = useState()
    const [templateNotif, setTemplate2] = useState()
    console.log(template2)
    useEffect(()=>{setEmail(email);setPass(pass);setTemplate(template);setTemplate2(template2)},[])
    return (

        <>
            {/*<div style={{display:'flex'}}>*/}
            {/*    <TextField fullWidth variant={"outlined"} label={"Email"} value={email1} style={{marginBottom:8, marginRight:4}}*/}
            {/*               onChange={event => setEmail(event.target.value)}/>*/}
            {/*    <TextField fullWidth variant={"outlined"} label={"Pass"} value={pass1} style={{marginBottom:8, marginLeft:4}} type={"password"}*/}
            {/*               onChange={event => setPass(event.target.value)}/>*/}
            {/*</div>*/}
            <TextField fullWidth multiline variant={"outlined"} label={"Order Notificatiom Template"} value={template1} style={{marginBottom:8}}
                       onChange={event => setTemplate(event.target.value)}/>
            <TextField fullWidth multiline variant={"outlined"} label={"New Driver Template"} value={templateNotif} style={{marginBottom:8}}
                       onChange={event => setTemplate2(event.target.value)}/>
            <Button variant={"contained"} color={"primary"} fullWidth onClick={()=>callback({email1, pass1, template1, templateNotif})} >Save</Button>
        </>


    )
}

function Display(props){
    console.log(props)
    const {email,pass, template, template2} = props
    return(<>
        {/*<div style={{display:'flex'}}>*/}
        {/*    <TextField fullWidth disabled variant={"outlined"} label={"Email"} value={email} style={{marginBottom:8, marginRight:4}}/>*/}
        {/*    <TextField fullWidth disabled variant={"outlined"} label={"Pass"} value={pass} style={{marginBottom:8, marginLeft:4}} type={"password"}/>*/}
        {/*</div>*/}
        <TextField fullWidth disabled multiline variant={"outlined"} label={"New Order Template"} value={template} style={{marginBottom:8}}/>
        <TextField fullWidth disabled multiline variant={"outlined"} label={"New Driver Template"} value={template2} style={{marginBottom:8}}/>

    </>)
}

export default function SettingsPage({classes}) {
    const [settings, loading, error] = useCollectionDataOnce(
        firebase.firestore().collection('settings')
    )
    const [settingsobj, setSettings] = useState({})
    const router=useRouter()
    const [edit, setEdit] = useState(false)
    const callback = (settingsf) => {
        const objs = {template:settingsf.template1, template2:settingsf.templateNotif}
        firebase.firestore().collection('settings').doc('settings').set(objs).then(()=> {
            setEdit(false);setSettings(objs)
        })
    }
    useEffect(()=>{
        setSettings(settings?settings[0]:{})
    }, [loading])
    console.log(settings)
    if (!loading) return (
        <>
            <div style={{display: 'flex', marginBottom: '0.5em'}}>
                <Typography component="h2" variant="h4" color="primary" gutterBottom style={{marginBottom: 0}}>
                    Settings
                </Typography>
                {edit ?
                    <Button variant={"contained"} color={"secondary"} style={{marginLeft: 'auto'}}
                            onClick={() => setEdit(false)}>
                        Cancel
                    </Button> :
                    <Button variant={"contained"} color={"primary"} style={{marginLeft: 'auto'}}
                            onClick={() => setEdit(true)}>
                        Edit
                    </Button>
                }
            </div>
            <Divider style={{marginBottom: '0.5em'}}/>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {edit ?
                        <Edit callback={callback} classes={classes} {...settingsobj}/>
                            :<Display {...settingsobj}/>
                        }
                    </Grid>
                </Grid>
            </Paper>

        </>
    )
    else return <></>
}