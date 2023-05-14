// Get html Elements
const getElement = (element) => document.querySelector(element);
const getAllElement = (element) => document.querySelectorAll(element);

// Variables
const addBtn = getElement("#add-btn");
const input = getElement("input");
const todoListsEl = getElement("#lists");
const notification = getElement(".notification");

// Add Todo
let todoLists = JSON.parse(localStorage.getItem('todos')) || []
let EditTodoId = -1;

// 1st render
renderTodo()

addBtn.addEventListener("click", () => {
  saveTodo();
  renderTodo();
  localStorage.setItem('todos', JSON.stringify(todoLists))
});

// Save Todo
function saveTodo() {
  let inputValue = input.value;
  let isEmpty = inputValue === "";
  let isDuplicate = todoLists.some(
    (todo) => todo.title.toUpperCase() === inputValue.toUpperCase()
  );

  if (isEmpty) {
    showNot("Todonun ichi bosh");
  } else if (isDuplicate) {
    showNot("Todo murda koshulgan");
  } else {
    if (EditTodoId >= 0) {
      todoLists = todoLists.map((list, idx) => ({
        ...list,
        title: idx === EditTodoId ? inputValue : list.title,
      }));
      EditTodoId = -1;
    } else {
      todoLists.push({
        title: inputValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    }
  }
  input.value = "";
}

// Render Todo
function renderTodo() {
  if (todoLists.length === 0) {
    todoListsEl.innerHTML = "<center>Todo bosh</center>";
    return;
  }
  todoListsEl.innerHTML = "";
  todoLists.forEach((list, idx) => {
    todoListsEl.innerHTML += `
      <div class="list" id='${idx}'>
				<span 
          class="material-symbols-outlined" 
          data-action="check" 
          style='color:${list.color}'>
            ${list.checked ? "check_circle" : "circle"}
        </span>
				<p style="${
          list.checked
            ? "text-decoration:line-through"
            : "text-decoration: inherit"
        }">
          ${list.title}
        </p>
        <span class="material-symbols-outlined" data-action="edit">edit</span>
				<span class="material-symbols-outlined" data-action="delete">delete</span>
		  </div>
    `;
  });
}

// Click event listener for all the buttons

todoListsEl.addEventListener("click", (e) => {
  const target = e.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "list") return;

  // todo id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // action
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);
});

// Check Todo
function checkTodo(todoId) {
  todoLists = todoLists.map((todoList, idx) => ({
    ...todoList,
    checked: idx === todoId ? !todoList.checked : todoList.checked,
  }));
  showNot("Iygiliktu atqaryldy")
  renderTodo();
  localStorage.setItem('todos', JSON.stringify(todoLists))
}

// Delete Todo
function deleteTodo(todoId) {
  todoLists = todoLists.filter((todo, idx) => idx !== todoId);
  EditTodoId = -1;
  // re-render
  renderTodo();
  localStorage.setItem('todos', JSON.stringify(todoLists))
}

// Edit Todo
function editTodo(todoId) {
  input.value = todoLists[todoId].title;
  EditTodoId = todoId;
}

// Show notification
function showNot(msg) {
  todoLists.map((list) => {
    list.checked ? (notification.innerHTML = `
      <i class="material-symbols-outlined">done</i>
      <span>${msg}</span>
    `)
      : "";
  });
  notification.innerHTML = `<span>${msg}</span>`
  notification.classList.add("active");
  setTimeout(() => {
    notification.classList.remove("active");
  }, 2000);
}
