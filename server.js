var express = require('express');
var bcryptjs = require('bcryptjs');
var jsonwebtoken = require('jsonwebtoken');

var User = require('./models/User');

var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var routes = express.Router();
const users = [];

routes.get('/', (request, response) => {
  response.json({ ok: true });
});

routes.post('/create', async function (request, response) {
    try {
      const { email, password } = request.body;

      const hashPass = await bcryptjs.hash(password, 8);
      
      const _users = new User(email, hashPass);
      users.push(_users);

      response.json(_users);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
});

routes.post('/session', async function (request, response) {
    try {
      const { email, password } = request.body;

      const _user = users.find(u => u.email === email);
      
      if(!_user) {
        response.status(400).json({ message: "Usuário não encontrado"});  
      }

      const passwordMatched = await bcryptjs.compare(password, _user.password);

      if(!passwordMatched) {
        response.status(400).json({ message: "Usuário não encontrado"});  
      }

      const token = jsonwebtoken.sign({}, 'a5a196ce5d4b7f471373b0b2a265ea39', {
        subject: _user.email,
        expiresIn: '1d',
      });

      response.json({_user, token});
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
});

app.use('/', routes);

app.listen('3333');
