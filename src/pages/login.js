import firebase, {auth} from '../config/firebase'
import {useRouter} from 'next/router'
import React from 'react'
import dynamic from "next/dynamic";
const FirebaseAuth = dynamic(() => import('react-firebaseui/StyledFirebaseAuth'), {
    ssr: false,
});


export default function Login(){
    const router=useRouter()
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => router.push('/')
        },
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
    };
    return (
        <>
            <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        </>
    )
}