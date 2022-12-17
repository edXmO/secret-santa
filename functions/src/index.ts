// const cors = require("cors")({ origin: true });
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import ParticipantConverter from "./converters/ParticipantConverter";
const serviceAccount = require("../secretSanta_serviceAccount.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// https://firebase.google.com/docs/functions/typescript

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
//             })

//         } catch (err) {
//             throw new functions.https.HttpsError('internal', "Something went wrong")
//         }
//     })

export const registerParticipant = functions.region("europe-west1").https.onCall(async (data, _ctx) => {
    const { email } = data;
    if (!email) {
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
            }).then(user => {
                db.collection("tenants").doc(user.uid).set({
                    id: user.uid,
                    email: user.email,
                    secretSanta: ""
                })
            })

            return {
                message: "User created"
            }
        } catch (err) {
            throw new functions.https.HttpsError('internal', "Something went wrong")
        }
    }
})

