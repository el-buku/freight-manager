import React from 'react';
import {useRouter} from 'next/router'

import Login from './login'

//MATERIAL
import {AdminMain, DispatcherMain, DriverMain} from '../components/main';

//FIREBASE
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionDataOnce} from 'react-firebase-hooks/firestore'
import firebase, {auth} from '../config/firebase'


export default function App({Component, pageProps}) {
    const dev = process.env.NODE_ENV == 'development'
    if (!dev) console.log = () => {
    }
    const [user, loading, error] = useAuthState(auth);
    const [drivers, loading2, error2] = useCollectionDataOnce(
        firebase.firestore().collection('drivers')
    )
    const [dispatchers, loading3, error3] = useCollectionDataOnce(
        firebase.firestore().collection('dispatchers')
    )
    const [condition, setCondition] = React.useState({driver: false, dispatcher: false, name: null, obj:null})
    React.useEffect(() =>
            drivers?.map(driver => {
                if (driver.email == user?.email) {
                    setCondition({...condition, driver: true, name: driver.name, obj:driver})
                }
            })
        , [loading2])
    React.useEffect(() =>
            dispatchers?.map(dispatcher => {
                if (dispatcher.email == user?.email) {
                    setCondition({...condition, dispatcher: true, name: dispatcher.name})
                }
            })
        , [loading3])
    console.log(dispatchers)
    const router = useRouter()
    // React.useEffect(()=>router.push('/'),[])
    console.log(condition)
    console.log(user)



    if ((user != null || auth.currentUser != null) && !loading) {
        if(!loading2 && !loading3){
            console.log(process.env.ADMIN_EMAILS)
            const adm = process.env.ADMIN_EMAILS.includes(user?.email)
            if (adm) {
                user.accessLevel = 'Admin'
                user.dispatcher = false
                return <AdminMain Component={Component} pageProps={pageProps} user={user}/>;
            } else if ((router.pathname == '/' || router.pathname.includes('orders')) && condition.driver === true) {
                //TODO: Routes access
                console.log(condition)
                user.accessLevel = 'User'
                firebase.firestore().collection('drivers').doc(condition.name).set({...condition.obj, verified:true})
                return <DriverMain Component={Component} pageProps={pageProps} user={user}/>;
            } else if (condition.dispatcher === true) {
                user.accessLevel = 'Admin'
                user.dispatcher = true
                user.name = condition.name
                return <DispatcherMain Component={Component} pageProps={pageProps} user={user}/>
            } else {
                return (<>
                    <button onClick={() => auth.signOut()}>Sign Out</button>
                    <button onClick={()=>window.location.reload()} style={{marginLeft:8}}>Retry</button>
                </>)
            }
        } else return <></>
    } else {
        return <Login/>
    }
}
