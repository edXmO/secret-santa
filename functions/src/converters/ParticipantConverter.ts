import { type FirestoreDataConverter, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { TParticipant } from "../types";

const ParticipantConverter: FirestoreDataConverter<TParticipant> = {
    toFirestore: (participant: TParticipant) => ({
        id: participant.id,
        email: participant.email,
        secretSanta: participant.secretSanta,
        name: participant.name,
        createdAt: participant.createdAt,
        isVerified: participant.isVerified,
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data();
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            secretSanta: data.secretSanta,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            isVerified: data.isVerified,
        } as TParticipant;
    }
};

export default ParticipantConverter