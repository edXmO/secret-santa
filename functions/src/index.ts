// const cors = require("cors")({ origin: true });
const nodemailer = require("nodemailer");
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import ParticipantConverter from "./converters/ParticipantConverter";
import { TParticipant } from "./types";
import assignEmails from "./utils/assignEmails";
const emailCredentials = require("../emailCredentials.ts");
const serviceAccount = require("../secretSanta_serviceAccount.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailCredentials?.user,
        pass: emailCredentials?.pass
    }
})

const db = admin.firestore()
const auth = admin.auth()

exports.testRaffle = functions.region("europe-west1")
    .pubsub
    .schedule("15 20 20 12 *")
    .timeZone("Europe/Madrid")
    .onRun(async _ctx => {
        try {
            const participants = (await db.collection("tenants").withConverter(ParticipantConverter).get()).docs.map(doc => doc.data());
            // self doc -> "b7lGggQ9sMXoSZ900Lg0r6XH23Z2"
            const emailPairs = assignEmails(participants.map(p => p.email))

            const result = emailPairs["ex.romeroma@gmail.com"]

            return await db.collection("tenants")
                .doc("b7lGggQ9sMXoSZ900Lg0r6XH23Z2")
                .update({ secretSanta: result })
                .then(() => {
                    const emailOptions = {
                        from: "Machines Corp Inc. <amigomachines@gmail.com>",
                        subject: "¡Tu amigo invisible es...",
                        to: "ex.romeroma@gmail.com",
                        html: `<p style="font-size: 16px;">¡Hola ${result}!</p>
                        <br />
                        <p style="font-size: 16px;">¡Ya tenemos el nombre de tu amigo invisible!</p>
                        <br />
                        <p style="font-size: 16px;">Tu amigo invisible es 
                            <p style="font-weight: bold; font-size: 16px;">${result}</p>
                        </p>
                        <br />
                        <p style="font-size: 16px;">¡Feliz Navidad!</p>
                        <br />
                        <p style="font-size: 16px;">Machines Corp Inc.</p>`
                    }

                    nodemailer.sendMail(emailOptions, (err: Error, _info: any) => {
                        if (err) {
                            throw new functions.https.HttpsError("internal", "Something went wrong sending email")
                        }
                    })
                })

        } catch (e) {
            throw new functions.https.HttpsError("internal", "Something went wrong")
        }
    })

exports.performRaffle = functions.region("europe-west1")
    .pubsub
    .schedule("0 0 24 12 *")
    .timeZone("Europe/Madrid")
    .onRun(async _ctx => {
        try {
            const tenantsRef = db.collection("tenants")
            const participantRef = await tenantsRef.withConverter(ParticipantConverter).get()
            const participants = participantRef.docs.map(doc => doc.data())
            const emailPairs = assignEmails(participants.map(p => p.email))

            let promises: Promise<admin.firestore.WriteResult>[] = [];

            participants.forEach(p => promises.push(tenantsRef.doc(p.id).update({ secretSanta: emailPairs[p.email] })))

            return await Promise.all(promises)
                .then(() => {
                    participants.forEach(p => {
                        const emailOptions = {
                            from: "Machines Corp Inc. <amigomachines@gmail.com>",
                            subject: "¡Tu amigo invisible es...",
                            to: p.email,
                            html: `<p style="font-size: 16px;">¡Hola ${p.name}!</p>
                                <br />
                                <p style="font-size: 16px;">¡Ya tenemos el nombre de tu amigo invisible!</p>
                                <br />
                                <p style="font-size: 16px;">Tu amigo invisible es 
                                    <p style="font-weight: bold; font-size: 16px;">${emailPairs[p.email]}</p>
                                </p>
                                <br />
                                <p style="font-size: 16px;">¡Feliz Navidad!</p>
                                <br />
                                <p style="font-size: 16px;">Machines Corp Inc.</p>`
                        }

                        transporter.sendMail(emailOptions, (err: Error, _info: any) => {
                            if (err) {
                                throw new functions.https.HttpsError("internal", "Something went wrong sending email")
                            }
                        })
                    })
                })

        } catch (err) {
            throw new functions.https.HttpsError("internal", "Something went wrong")
        }

    })


exports.sendVerificationEmail = functions.region("europe-west1").firestore.document("tenants/{tenantId}").onCreate(async (snapshot, _ctx) => {

    const { email, name } = snapshot.data() as TParticipant;

    if (!email || !name) {
        throw new functions.https.HttpsError('invalid-argument', "Email and name are required")
    }

    try {
        return await auth.generateEmailVerificationLink(email)
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

exports.registerParticipant = functions.region("europe-west1").https.onCall(async (data, _ctx) => {
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

