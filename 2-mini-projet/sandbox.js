let addForm = document.querySelector(".add");
let todoList = document.querySelector(".todos");
let AutoCompletion = document.querySelector(".search input");

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = addForm.add.value.trim(); // trim is for eliminating whitespaces
  if (text.length > 0) {
    const element = `
            <li class="list-group-item justify-content-between align-items-center">
                <span>${text}</span>
                <i class="far fa-trash-alt delete"></i>
            </li>
        `;
    todoList.innerHTML += element;
    addForm.reset();
  }
});

todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) { // to verify it's deletable element
    event.target.parentElement.remove();
  }
});

AutoCompletion.addEventListener("input", () => {
  let search = AutoCompletion.value.trim().toLowerCase();
  let todos = todoList.querySelectorAll("li");
  todos.forEach((todo) => {
    let text = todo.querySelector("span").textContent.toLowerCase();
    if (text.includes(search)) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
});
