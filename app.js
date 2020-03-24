// This line must come before importing any instrumented module.
const tracer = require('dd-trace').init()
require(`dotenv`).config();
tracer.init({
    analytics: true,
    clientToken: process.env.CLIENT_TOKEN,
    applicationId: process.env.APPLICATION_ID,
  })

// var StatsD = require('node-dogstatsd').StatsD;
// var dogstatsd = new StatsD();

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
const router = express.Router();
const port = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/resources', router);

//templating
app.set('view engine', 'pug')


const controller = async (req, res) => {
  //res.writeHead(200);
  let values = await sequelizeModels.person.findAll();
  res.render('index', { title: 'Hey', message: 'Users registered', values: values});
  //res.send(val);
}

const postController = async (req, res) => {
  res.writeHead(200);
  let userInDb = await sequelizeModels.person.findOrCreate({where: {name:req.body.name},defaults:req.body});
  res.send(`User ${userInDb[1] ? 'added to' : 'is already in'} database`);
}

router.route('/people')
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
  sequelizeInstance.sync({});
  console.log(`Server is listening on port ${port}`);
});