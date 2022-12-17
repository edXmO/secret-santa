function assignEmailPairs(emails: string[]) {
    // create a copy of the email array to shuffle
    const emailList = [...emails];

    // shuffle the array using the Fisher-Yates shuffle algorithm
    for (let i = emailList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [emailList[i], emailList[j]] = [emailList[j], emailList[i]];
    }

    // create a map to store the email pairs
    const emailPairs = new Map();

    // assign each email to another one in the list
    for (let i = 0; i < emails.length; i += 2) {
        emailPairs.set(emailList[i], emailList[i + 1]);
        emailPairs.set(emailList[i + 1], emailList[i]);
    }

    return emailPairs;
}

export default assignEmailPairs