const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

let todos = [];

todoForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const newTodo = todoInput.value.trim();
  if (newTodo !== '') {
    todos.push(newTodo);
    renderTodos();
    todoInput.value = '';
  }
});

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach(function (todo, index) {
    const li = document.createElement('li');
    li.textContent = todo;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function () {
      todos.splice(index, 1);
      renderTodos();
    });

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}
