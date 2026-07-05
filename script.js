const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const taskCounter = document.getElementById("taskCounter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

searchInput.addEventListener("input", function() {
  renderTasks();
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    dueDate: dueDate
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function clearAllTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function updateCounter() {
  const remainingTasks = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `${remainingTasks} tasks remaining`;
}

function renderTasks() {
  taskList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  let filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchText)
  );

  if (currentFilter === "active") {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

    const span = document.createElement("span");
    span.textContent = task.text;

    span.addEventListener("click", function() {
      toggleTask(task.id);
    });

    taskInfo.appendChild(span);

    if (task.dueDate) {
      const date = document.createElement("small");
      date.className = "due-date";
      date.textContent = `Due: ${task.dueDate}`;
      taskInfo.appendChild(date);
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", function() {
      deleteTask(task.id);
    });

    li.appendChild(taskInfo);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  });

  updateCounter();
}

renderTasks();