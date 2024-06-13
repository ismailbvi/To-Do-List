// Retrive to do list from local storage
let todo = JSON.parse(localStorage.getItem("todo")) || [] ;
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("delBTN");

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener('keydown',function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
});

function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== "") {
        const timestamp = new Date().toLocaleString(); // Get current timestamp
        todo.push({
            text: newTask,
            disabled: false,
            timestamp: timestamp // Add timestamp to the task object
        });
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }
}


let alertSkips = 0; // Counter to track the number of times alert is skipped

function deleteAllTasks() {
    // Check if there are unchecked tasks
    todo = todo.filter(item => !item.disabled);
    saveToLocalStorage();
    displayTasks();
    

    // If there are unchecked tasks, show an alert message
    if (uncheckedTasks) {
        // Increment the alertSkips counter
        alertSkips++;

        // If alert is skipped twice, delete all tasks
        if (alertSkips === 2) {
            alertSkips = 0; // Reset the counter
            deleteAllTasksConfirmed(); // Call the function to delete all tasks
            return; // Exit the function
        }

        alert("Please check all tasks before deleting!");
        return; // Exit the function
    }

    // If all tasks are checked, proceed to delete all tasks
    deleteAllTasksConfirmed();
}

function deleteAllTasksConfirmed() {
    // Remove all tasks from the todo array
    todo = [];
    saveToLocalStorage();
    
    // Remove all task elements from the todoList
    todoList.innerHTML = "";

    // Update the todoCount to reflect the new count (0)
    todoCount.textContent = 0;
}

function deleteTaskbtn(index) {
    todo.splice(index, 1); // Remove the task at the specified index from the todo array
    saveToLocalStorage(); // Save the updated todo array to local storage
    displayTasks(); // Refresh the displayed tasks
}

function displayTasks() {
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const todoContainer = document.createElement("div");
        todoContainer.classList.add("todo-container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-checkbox");
        checkbox.id = `input-${index}`;
        checkbox.checked = item.disabled;
        checkbox.addEventListener("change", () => toggleTask(index));

        const todoText = document.createElement("p");
        todoText.id = `todo-${index}`;
        todoText.textContent = item.text;
        todoText.classList.toggle("disabled", item.disabled);
        todoText.addEventListener("click", () => editTask(index));

        const timestamp = document.createElement("span");
        timestamp.classList.add("timestamp");
        timestamp.textContent = item.timestamp || ""; // Display timestamp if available

        todoContainer.appendChild(checkbox);
        todoContainer.appendChild(todoText);
        todoContainer.appendChild(timestamp);

        // Create delete button only for checked tasks
        if (item.disabled) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => deleteTaskbtn(index));
            todoContainer.appendChild(deleteBtn);
        }

        todoList.appendChild(todoContainer);
    });
    todoCount.textContent = todo.length;
}



function editTask(index) {
    const todoItem = document.getElementById(`todo-${index}`);
    const existingText = todo [index].text;
    const inputElement = document.createElement("input");

    inputElement.value = existingText;
    todoItem.replaceWith(inputElement);
    inputElement.focus();

    inputElement.addEventListener("blur", function(){
        const updateText = inputElement.value.trim();
        if(updateText) {
            todo[index].text = updateText;
            saveToLocalStorage
        }
        displayTasks();
    });
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}

function saveToLocalStorage() {
    localStorage.setItem("todo",JSON.stringify(todo));
}