// This line must come before importing any instrumented module.
const tracer = require('dd-trace').init()
require(`dotenv`).config();
tracer.init({
    analytics: true,
    clientToken: process.env.CLIENT_TOKEN,
    applicationId: process.env.APPLICATION_ID,
  })

const Sequelize = require('sequelize');
const sequelizeInstance = new Sequelize('sqlite::memory:');
const sequelizeModels = require('./models')(sequelizeInstance);

// Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: '~Documents/datadogPractice/database.sqlite'
// });

//setting up routing, json request body parsing and listening port
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const loginRouter = express.Router();
const router = express.Router();
const peoplesRouter = express.Router();
const port = 8081;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//templating
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'));

app.use('/login', loginRouter);
app.use('/resources/people', router);
router.use('/profile', peoplesRouter);
const displayLoginPage = async (req, res) => {
  res.render('login')
}

const evaluateLogin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).render('login',{ message: 'need username and password' });
  }
  else{
    if (req.body.submit == 'signup'){
      let result = await sequelizeModels.login.findOne(
        {
          where: 
          {
            username: req.body.username
          }
        });
      if (result){
        res.render('login', { message: 'User already exists' });
      }
      else{
        let loginInDb = await sequelizeModels.login.create(
          {
            username: req.body.username,
            password: req.body.password
          });
        req.body.loginId = loginInDb.id;
        let personInDb = await sequelizeModels.person.findOrCreate(
          {
            where: {id:req.body.loginId},
            defaults: {id:req.body.loginId,name:loginInDb.username}
          });
const loginCheckupController = async (req, res) => {
        res.redirect('/resources/people');
        res.end();
      }
    }
    else if (req.body.submit == 'login'){
      let result = await sequelizeModels.login.findOne(
        {
          where: 
          {[Sequelize.Op.and]: 
            [{username: req.body.username},{password: req.body.password}]
          }
        });
      if (result){
    res.redirect('/resources/people');
        res.end();
      }
      else{
        res.render('login', { message: 'Please enter correct login info' });
      }
    }
  }
}

const profileViewer = async (req, res) => {
  let user = await sequelizeModels.person.findOne({where: {name:req.body.name}});
  user['title'] = `${user.name}'s Profile`;
  res.render('profile.pug', {user:user});
}

const profileEditor = async (req, res) => {
  res.render('profile.pug')
}

const controller = async (req, res) => {
  //res.writeHead(200);
  let values = await sequelizeModels.person.findAll();
  res.render('index', { title: 'Hey', message: 'Users registered', values: values});
  //res.send(val);
}

// Allows users to create an account using the provided info
// Used to inject test data at launch
const postController = async (req, res) => {
  let personInDb = await sequelizeModels.person.findOrCreate(
    {
      where: {name:req.body.person.name},
      defaults:req.body.person
    });
  req.body.login.personId = personInDb[0].id;
  let userInDb = await sequelizeModels.login.findOrCreate(
    {
      where: {personId:req.body.login.personId},
      defaults:req.body.login
    });
  if (req.headers.referer && req.headers.referer.includes('/create')){
    res.redirect('/resources/people');
  }
  res.send(`User ${userInDb[1] ? 'added to' : 'is already in'} database`);
}

loginRouter.route('/')
  .get(displayLoginPage)
  .post(evaluateLogin)

peoplesRouter.route('/show')
  .post(profileViewer)
  //.post(profilerEditor)

peoplesRouter.route('/create')
  .get(profileEditor)
  //.post(profilerEditor)

router.route('/')
      .get(controller)
      .post(postController)


app.get('/', (req, res) => {
  res.writeHead(200);
  res.end('Server touched successfully!');
});

app.listen(port, (err) => {
  if (err) {
    return console.log(`Something bad happened: ${err}`);
  }
  sequelizeInstance.authenticate();
  sequelizeInstance.sync({force:true});
  console.log(`Server is listening on port ${port}`);
});