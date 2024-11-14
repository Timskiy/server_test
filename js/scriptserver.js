// Получаем элементы из DOM
const registerForm = document.getElementById('registerForm');
const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');

const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

const logoutButton = document.getElementById('logoutButton');
const getProtectedDataButton = document.getElementById('getProtectedDataButton');

const messageContainer = document.getElementById('messageContainer');
const protectedDataContainer = document.getElementById('protectedDataContainer');

// Переменная для хранения токена
// Получаем токен из localStorage при загрузке страницы
let authToken = localStorage.getItem('authToken');

if (authToken) {
  registerForm.style.display = 'none';
  loginForm.style.display = 'none';
  logoutButton.style.display = 'block';
  getProtectedDataButton.style.display = 'block';
}

// Функция для отображения сообщений
function showMessage(message) {
  messageContainer.textContent = message;
}

// Обработчик регистрации
registerForm.addEventListener('submit', event => {
  event.preventDefault();

  const userData = {
    name: registerName.value,
    email: registerEmail.value,
    password: registerPassword.value
  };

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'User registered') {
        showMessage('Регистрация успешна! Теперь вы можете войти.');
        // Очищаем форму
        registerForm.reset();
      } else {
        showMessage('Ошибка регистрации: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Ошибка при регистрации:', error);
      showMessage('Ошибка при регистрации.');
    });
});

// Обработчик входа
loginForm.addEventListener('submit', event => {
  event.preventDefault();

  const loginData = {
    email: loginEmail.value,
    password: loginPassword.value
  };

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        authToken = data.token;
        showMessage('Вход выполнен успешно!');

        // Сохраняем токен в localStorage
        localStorage.setItem('authToken', authToken);

        // Прячем формы регистрации и входа
        registerForm.style.display = 'none';
        loginForm.style.display = 'none';

        // Показываем кнопки выхода и доступа к защищённым данным
        logoutButton.style.display = 'block';
        getProtectedDataButton.style.display = 'block';

        // Очищаем форму
        loginForm.reset();
      } else {
        showMessage('Ошибка входа: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Ошибка при входе:', error);
      showMessage('Ошибка при входе.');
    });
});

// Обработчик выхода
logoutButton.addEventListener('click', () => {
  authToken = null;
  showMessage('Вы вышли из системы.');

  //Удаляем токен из localStorage
  localStorage.removeItem('authToken');

  // Показываем формы регистрации и входа
  registerForm.style.display = 'block';
  loginForm.style.display = 'block';
  
  // Прячем кнопки выхода и доступа к защищённым данным
  logoutButton.style.display = 'none';
  getProtectedDataButton.style.display = 'none';
  // Очищаем защищённые данные
  protectedDataContainer.innerHTML = '';
});

// Обработчик получения защищённых данных
getProtectedDataButton.addEventListener('click', () => {
  fetch('http://localhost:3000/users', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
    .then(response => response.json())
    .then(users => {
      protectedDataContainer.innerHTML = '<h3>Список пользователей:</h3>';
      users.forEach(user => {
        const userElement = document.createElement('p');
        userElement.textContent = `ID: ${user._id}, Имя: ${user.name}, Email: ${user.email}`;
        protectedDataContainer.appendChild(userElement);
      });
    })
    .catch(error => {
      console.error('Ошибка при получении защищённых данных:', error);
      showMessage('Ошибка при получении защищённых данных.');
    });
});
