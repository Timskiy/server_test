const button = document.getElementById('changeColorButton');

button.addEventListener('click', function () {
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  document.body.style.backgroundColor = randomColor;
});

//get element of form
const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const display = document.getElementById('messageDisplay');

form.addEventListener('submit', function (event) {
  event.preventDefault(); //prevent reset page

  //get value from form
  const message = input.value;

  //new value to message
  const newMessage = document.createElement('p');
  newMessage.textContent = message;

  //add new message to block
  display.appendChild(newMessage);

  //clear form
  input.value = '';
});

///////////////////////
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    alert('You pressed ' + link.textContent);
  });
});
