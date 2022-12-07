const domain = "https://uwc.ddns.net";


// fire this function on assign task submit
async function assignTask(EmployerId, EmployeeId, Start, End, Job, Note) {
    return fetch(domain + "/api/assignTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                Employer: EmployerId,
                Employee: EmployeeId,
                Start: Start,
                End: End,
                Job: Job,
                Note: Note
            })
        }
    );
}

// get all tasks as JSON array [{Employer, Employee, Start, End, Job, Note}]
async function getTasks() {
    return fetch(domain + "/api/getTasks", {
            method: "GET"
        }
    );
}

