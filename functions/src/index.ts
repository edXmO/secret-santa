// const cors = require("cors")({ origin: true });
const nodemailer = require("nodemailer");
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import ParticipantConverter from "./converters/ParticipantConverter";
import { TParticipant } from "./types";
const serviceAccount = require("../secretSanta_serviceAccount.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// https://firebase.google.com/docs/functions/typescript

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "amigomachines@gmail.com",
        pass: "fmnzjpdzrqveypqf"
    }
})

const db = admin.firestore()
const auth = admin.auth()

// export const assignEmails = functions.pubsub.schedule('0 0 22 12 *')
//     .onRun(async _ctx => {
//         try {
//             const participants = (await db.collection('tenants')
//                 .withConverter(ParticipantConverter)
//                 .get())
//                 .docs
//                 .map(doc => doc.data());
//             const emails = participants.map(p => p.email);
//             const emailPairs = assignEmailPairs(emails);

//             return participants.forEach(p => {
//                 db.collection('tenants').doc(p.id)
//                     .update({
//                         secretSanta: emailPairs.get(p.email)
//                     })

// const mailOptions = {
//                     from: 'Machines Corp Inc. <amigomachines@gmail.com>',
//                     to: email,
//                     subject: 'Gracias por participar en el sorteo del Amigo Invisible Machines',
//                     html: `<p style="font-size: 16px;">Gracias por participar ${name}!</p>
//                     <br />
//                     <p style="font-size: 16px;">Para poder participar en el sorteo de Amigo Machines, debemos verificar tu email.</p>
//                     <br />
//                     <p style="font-size: 16px;">Por favor, haz click en el siguiente enlace:</p>
//                     <br />
//                     <a style="font-size: 16px;" href="${link}">Verificar email</a>
//                     <br />
//                     <p style="font-size: 16px;">Si no has solicitado participar en el sorteo, por favor, ignora este email.</p>
//                     <br />
//                     <p style="font-size: 16px;">Gracias!</p>
//                     <br />
//                     <p style="font-size: 16px;">Machines Corp Inc.</p>
//                 `
//                 };
//             })

// transporter.sendMail(mailOptions, (err: Error, _info: any) => {
//     if (err) {
//         throw new functions.https.HttpsError('internal', "Something went wrong sending verification email")
//     }
// })

//         } catch (err) {
//             throw new functions.https.HttpsError('internal', "Something went wrong")
//         }
//     })

export const sendVerificationEmail = functions.region("europe-west1").firestore.document("tenants/{tenantId}").onCreate(async (snapshot, _ctx) => {

    const { email, name } = snapshot.data() as TParticipant;

    if (!email || !name) {
        throw new functions.https.HttpsError('invalid-argument', "Email and name are required")
    }

    try {
        await auth.generateEmailVerificationLink(email)
            .then(link => {
                const mailOptions = {
                    from: 'Machines Corp Inc. <amigomachines@gmail.com>',
                    to: email,
                    subject: 'Gracias por participar en el sorteo del Amigo Invisible Machines',
                    html: `<p style="font-size: 16px;">Gracias por participar ${name}!</p>
                    <br />
                    <p style="font-size: 16px;">Para poder participar en el sorteo de Amigo Machines, debemos verificar tu email.</p>
                    <br />
                    <p style="font-size: 16px;">Por favor, haz click en el siguiente enlace:</p>
                    <br />
                    <a style="font-size: 16px;" href="${link}">Verificar email</a>
                    <br />
                    <p style="font-size: 16px;">Si no has solicitado participar en el sorteo, por favor, ignora este email.</p>
                    <br />
                    <p style="font-size: 16px;">Gracias!</p>
                    <br />
                    <p style="font-size: 16px;">Machines Corp Inc.</p>
                `
                };

                transporter.sendMail(mailOptions, (err: Error, _info: any) => {
                    if (err) {
                        throw new functions.https.HttpsError('internal', "Something went wrong sending verification email")
                    }
                })

            })
    } catch (err) {
        throw new functions.https.HttpsError('internal', "Error generating verification link!")
    }
})

export const registerParticipant = functions.region("europe-west1").https.onCall(async (data, _ctx) => {
    const { email, name } = data;
    if (!email || !name) {
        throw new functions.https.HttpsError('invalid-argument', "Email is required")
    }
    const participants = (await db.collection("tenants").withConverter(ParticipantConverter).get())
    const isRegistered = participants.docs.some(doc => doc.data().email === email)

    if (isRegistered) {
        throw new functions.https.HttpsError('already-exists', "Email already registered")
    } else {
        try {
            await auth.createUser({
                email,
                emailVerified: false,
                displayName: email,
                disabled: false,
            })
                .then(user => {
                    const participant: TParticipant = {
                        id: user.uid,
                        name,
                        email,
                        secretSanta: "",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        isVerified: false,
                    }

                    db.collection("tenants")
                        .doc(user.uid)
                        .set(participant, { merge: true })
                })

            return { message: "User created successfully" }
        } catch (err) {
            throw new functions.https.HttpsError('internal', "Something went wrong")
        }
    }
})

