require('dotenv').config();


const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const sessionSecret = process.env.SESSION_SECRET || 'default-secret';



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secure-session-key',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


// Home
app.get('/', (req, res) => res.redirect('/main'));
app.get('/main', (req, res) => res.render('main'));

// Create Account
app.get('/create', (req, res) => res.render('create'));
app.post('/create', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('All fields required');

  const entry = `${username.trim()},${password.trim()}\n`;
  fs.appendFile('login.txt', entry, err => {
    if (err) return res.send('Error saving account');
    res.redirect('/login');
  });
});

// Login
app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('login.txt', 'utf8', (err, data) => {
    if (err) return res.send('Error reading login file');

    const isValid = data
      .split('\n')
      .some(line => {
        const [storedUser, storedPass] = line.trim().split(',');
        return storedUser === username.trim() && storedPass === password.trim();
      });

    if (isValid) {
      req.session.user = username.trim();
      res.redirect('/main');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/main');
  });
});

app.get('/give', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('give');
});

app.post('/give', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const {
    name, pet_type, breed, age, gender,
    dogs_friendly, cats_friendly, kids_friendly,
    comments, owner_name, owner_email
  } = req.body;

  const compatibility = [
    dogs_friendly ? 'Dogs' : '',
    cats_friendly ? 'Cats' : '',
    kids_friendly ? 'Kids' : ''
  ].filter(Boolean).join('/');

  const image = `${pet_type}.jpg`; 

  const entry = `${name},${age},${breed},${gender},${compatibility},${owner_name},${owner_email},${image}\n`;

  fs.appendFile('pets.txt', entry, err => {
    if (err) return res.send('Error saving pet');
    res.redirect('/pets');
  });
});

app.get('/pets', (req, res) => {
  const filePath = 'pets.txt';
  if (!fs.existsSync(filePath)) return res.render('pets', { pets: [] });

  const pets = fs.readFileSync(filePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [name, age, breed, gender, compatibility, owner, email, image] = line.split(',');
      return { name, age, breed, gender, compatibility, owner, email, image };
    });

  res.render('pets', { pets });
});

app.get('/care', (req, res) => res.render('care'));
app.get('/contact', (req, res) => res.render('contact'));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);