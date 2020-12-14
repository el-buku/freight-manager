const nodemailer = require("nodemailer");
const send = require('gmail-send')
import Handlebars from 'handlebars'

import firebase from '../../config/firebase'

export default async (req, res) => {
    const snapShot = await firebase.firestore().collection('settings').doc('settings').get()
    const settings = snapShot.data()
    const template = Handlebars.compile(settings.template)
    const body = JSON.parse(req.body)
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
                            "Email": body.driver.email,
                            "Name": "Driver"
                        }
                    ],
                    "Subject": "ACR Logistics - New Order",
                    "TextPart": template({...body}),
                    "HTMLPart": template({...body}),
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        }).then((result) => {
            console.log(result)

    })
        .catch((err) => {
            console.log(err)

        })
    res.statusCode=200
    res.json({data:'ok'})


}

