import { type FirestoreDataConverter, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { TParticipant } from "../types";

const ParticipantConverter: FirestoreDataConverter<TParticipant> = {
    toFirestore: (participant: TParticipant) => ({
        id: participant.id,
        email: participant.email,
        secretSanta: participant.secretSanta
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data();
        return {
            id: data.id,
            email: data.email,
            secretSanta: data.secretSanta
        } as TParticipant;
    }
};

export default ParticipantConverter