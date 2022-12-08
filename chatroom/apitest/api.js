const domain = "https://uwc.ddns.net";

const form = document.querySelector("#event-form");
form.addEventListener("submit", function () {
  var EmployerId = document.querySelector("#event-employee").value;
  var EmployeeId = document.querySelector("#event-employee").value;
  var Start = document.querySelector("#event-start").value;
  var End = document.querySelector("#event-end").value;
  var Job = document.querySelector("#event-title").value;
  var Note = document.querySelector("#event-details").value;
  assignTask(EmployerId, EmployeeId, Start, End, Job, Note);
});

// fire this function on assign task submit
async function assignTask(EmployerId, EmployeeId, Start, End, Job, Note) {
  return fetch(domain + "/api/assignTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      Employer: EmployerId,
      Employee: EmployeeId,
      Start: Start,
      End: End,
      Job: Job,
      Note: Note,
    }),
  });
}

// get all tasks as JSON array [{Employer, Employee, Start, End, Job, Note}]
async function getTasks() {
  return fetch(domain + "/api/getTasks", {
    method: "GET",
  });
}
