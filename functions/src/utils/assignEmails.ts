function assignEmails(emails: string[]) {
    const emailList = [...emails];
    const assignments: Record<string, string> = {};

    emails.forEach(email => {
        let randomIndex = Math.floor(Math.random() * emailList.length);
        while (emailList[randomIndex] === email) {
            randomIndex = Math.floor(Math.random() * emailList.length);
        }
        assignments[email] = emailList[randomIndex];
        emailList.splice(randomIndex, 1);
    });

    return assignments;
}

export default assignEmails;
