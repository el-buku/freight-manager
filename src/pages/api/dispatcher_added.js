const nodemailer = require("nodemailer");
const send = require('gmail-send')
import Handlebars from 'handlebars'

import firebase from '../../config/firebase'

export default async (req, res) =>{
    console.log('start')
    firebase.firestore().collection('settings').doc('settings').get().then(
        snapShot=>{
            const settings = snapShot.data()
            const template = Handlebars.compile(settings.template2)
            const body = JSON.parse(req.body)

            console.log(body.email)
            const mailjet = require ('node-mailjet')
                .connect('c3acf6a43207c66a6cad8a0629aaa59f', 'ea8176b236ec9df639936ceefcd9627d')
            mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages":[
                        {
                            "From": {
                                "Email": "acrlogisticscarrier@gmail.com",
                                "Name": "ACRLogistics"
                            },
                            "To": [
                                {
                                    "Email": body.email,
                                    "Name": "Driver"
                                }
                            ],
                            "Subject": "ACR Logistics - New Dispatcher",
                            "TextPart": "ACR Logistics has invited you to sign up as a dispatcher. Please click the link below to create an account. https://acrlogistics.vercel.app",
                            "HTMLPart": "ACR Logistics has invited you to sign up as a dispatcher. Please click the link below to create an account. https://acrlogistics.vercel.app",
                            "CustomID": "AppGettingStartedTest"
                        }
                    ]
                }).then((result) => {
                res.statusCode=200
                res.json({data:'ok'})
            })
                .catch((err) => {
                    console.log(err.statusCode)
                    res.statusCode=200
                    res.json({data:'ok'})
                })
        }
    )

}

