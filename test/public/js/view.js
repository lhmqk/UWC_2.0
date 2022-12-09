var taskInputName = document.getElementById("new-taskName"); //new-taskName
var taskInputFrom = document.getElementById("new-taskFrom"); //new-taskName
var taskInputTo = document.getElementById("new-taskTo"); //new-taskName
var taskInputEmp = document.getElementById("new-taskEmp"); //new-taskName
var taskInputDesc = document.getElementById("new-taskDesc"); //new-taskName
var taskInputLoc = document.getElementById("diachi");
var addButton = document.getElementById("addTaskBtn"); //form-button
var incompleteTasksHolder = document.getElementById("incomplete-tasks"); //incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks"); //completed-tasks

var empBoxList = document.querySelectorAll(".empBox");
for (let i = 0; i < empBoxList.length; i++) {
  empBoxList[i].addEventListener("click", function () {
    document.querySelector(".viewWrapperEmp").classList.remove("show");
    document.querySelector(".viewWrapperTask").classList.add("show");
  });
}

//New Task List Item
var createNewTaskElement = function (
  taskNameString,
  taskFromString,
  taskToString,
  taskEmpString,
  taskDescString
) {
  //Create List Item
  var listItem = document.createElement("li");

  //input (checkbox)
  var checkBox = document.createElement("input"); // checkbox
  //name
  var name = document.createElement("label");
  //name
  var from = document.createElement("label");
  //name
  var to = document.createElement("label");
  //name
  var emp = document.createElement("label");
  //name
  var desc = document.createElement("label");
  //input (text)
  var editInput = document.createElement("input"); // text
  //button.edit
  var editButton = document.createElement("button");
  //button.delete
  var deleteButton = document.createElement("button");
  //button.wrapper
  var buttonWrapper = document.createElement("div");

  //Each element needs modifying

  checkBox.type = "checkbox";
  editInput.type = "text";

  editButton.innerText = "Sửa";
  editButton.className = "edit";
  deleteButton.innerText = "Xóa";
  deleteButton.className = "delete";

  name.innerText = taskNameString;
  from.innerText = taskFromString;
  to.innerText = taskToString;
  emp.innerText = taskEmpString;
  desc.innerText = taskDescString;

  //Each element needs appending
  listItem.appendChild(checkBox);
  listItem.appendChild(name);
  listItem.appendChild(from);
  listItem.appendChild(to);
  listItem.appendChild(emp);
  listItem.appendChild(desc);
  listItem.appendChild(editInput);
  buttonWrapper.appendChild(editButton);
  buttonWrapper.appendChild(deleteButton);
  listItem.appendChild(buttonWrapper);

  return listItem;
};

//Add a new task
async function assignTaskREST(body) {
  return fetch("/api/assignTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: body
  });
}
var addTask = function () {
  console.log("Add task...");
  //Create a new list item with the text from #new-task:
  var listItem = createNewTaskElement(
    taskInputName.value,
    taskInputFrom.value,
    taskInputTo.value,
    janitorEmail.substr(0, 3),
    taskInputDesc.value
  );

  assignTaskREST(JSON.stringify({
    jobname: taskInputName.value,
    start: taskInputFrom.value,
    end: taskInputTo.value,
    description: taskInputDesc.value,
    location: taskInputLoc.value,
    workerEmail: janitorEmail,
    assignEmail: backofficerEmail
  }));
  
  //Append listItem to incompleteTasksHolder
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  taskInputName.value = "";
  taskInputFrom.value = "";
  taskInputTo.value = "";
  taskInputEmp.value = "";
  taskInputDesc.value = "";
};

//Edit an existing task
var editTask = function () {
  console.log("Edit task...");

  var listItem = this.parentNode;

  var editInput = listItem
    .querySelector("#incomplete-tasks")
    .querySelector("input[type=text");
  var label = listItem
    .querySelector("#incomplete-tasks")
    .querySelector("label")[0];

  var containsClass = listItem.classList.contains("editMode");

  //if the class of the parent is .editMode
  if (containsClass) {
    //Switch from .editMode
    //label text become the input's value
    label.innerText = editInput.value;
  } else {
    //Switch to .editMode
    //input value becomes the label's text
    editInput.value = label.innerText;
  }

  //Toggle .editMode on the list item
  listItem.classList.toggle("editMode");
};

//Delete an existing task
var deleteTask = function () {
  console.log("Delete task...");
  var listItem = this.parentNode.parentNode;
  var ul = listItem.parentNode;

  //Remove the parent list item from the ul
  ul.removeChild(listItem);
};

//Mark a task as complete
var taskCompleted = function () {
  console.log("Task complete...");
  //Append the task list item to the #completed-tasks
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  //bindTaskEvents(listItem, taskIncomplete);
};

//Mark a task as incomplete
var taskIncomplete = function () {
  console.log("Task incomplete...");
  //Append the task list item to the #incomplete-tasks
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
};

var bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  console.log("Bind list item events");
  //select taskListItem's children
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");

  //bind editTask to edit button
  editButton.onclick = editTask;

  //bind deleteTask to delete button
  deleteButton.onclick = deleteTask;

  //bind checkBoxEventHandler to checkbox
  checkBox.onchange = checkBoxEventHandler;
};

// var ajaxRequest = function() {
// 	console.log("AJAX request");
// }

//Set the click handler to the addTask function
addButton.addEventListener("click", addTask);
//addButton.addEventListener("click", ajaxRequest);

//cycle over incompleteTasksHolder ul list items
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
  //bind events to list item's children (taskCompleted)
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

//cycle over completedTasksHolder ul list items
for (var i = 0; i < completedTasksHolder.children.length; i++) {
  //bind events to list item's children (taskIncomplete)
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}
