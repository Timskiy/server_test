require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Импортируем пакет cors
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Импортируем mongoose
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const app = express();
const port = process.env.PORT || 3000;

const SECRET_KEY = process.env.SECRET_KEY; //Секретный код для JWT

//Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('You are connected to MongoDB'))
  .catch(error => console.error('Fail connection to MongoDB: ', error));

// Настройка middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Функция middleware для проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Authorization needs' });

  jwt.verify(token, SECRET_KEY, (error, user) => {
    if (error) return res.status(403).json({ message: 'Wrong token' });
    req.user = user;
    next();
  });
}

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

// Маршрут для регистрации новых пользователей
app.post('/register', async (req, res) => {
  try {
    //Хешируем пароль
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Создаем нового пользователя с хешированным паролем
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    //Сохраняем пользователя в БД
    const newUser = await user.save();

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Маршрут для входа пользователя
app.post('/login', async (req, res) => {
  try {
    //Ищем пользователя по email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'User was not defined' });

    //Проверяем, что пароль и хеш не пустые
    if (!req.body.password || !user.password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    //Сравниваем введенный пароль с хешем в БД
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

    //Генерируем JWT - токен
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Successful enter', token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Защищенный маршрут для получения всех пользователей
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find(); //Получаем всех пользователей из MongoDB
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Маршрут для добавления нового пользователя в базу данных (можно сделать защищенным, если требуется)
app.post('/users', authenticateToken, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email
    });

    const newUser = await user.save(); // Сохраняем пользователя в базе данных
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${PORT}`);
});
