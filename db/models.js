var Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var salt = bcrypt.genSaltSync(10);

//JAWSDB for Heroku deployment
if (process.env.DEPLOYED === 'true'){
  var orm = new Sequelize(process.env.JAWSDB_URL);
} else {
  var orm = new Sequelize('Pistonsdb', 'root', '')
}

//User Model
var User = orm.define('User', {
	 username: {
		type: Sequelize.STRING,
		unique: true
    },
    email: {
    	type: Sequelize.STRING,
    	unique:true
    },
    password: Sequelize.STRING
  }, {
    instanceMethods: {
      hashPassword: function() {
      return bcrypt.hashSync(this.password, salt);
    },
      validPassword: function(inputpass, pass) {
      return bcrypt.compareSync(inputpass, pass);
    }
  }
});

User.beforeCreate(function(user, options) {
  user.password = user.hashPassword();
});

//Portfolio Model
var Portfolio = orm.define('Portfolio', {
	balance: Sequelize.INTEGER,
  username: Sequelize.STRING,
  leaguename: Sequelize.STRING
});


//Transaction Model
var Transaction = orm.define('Transaction', {

	symbol: Sequelize.STRING,
	price: Sequelize.STRING,
	buysell: Sequelize.BOOLEAN,
  shares: Sequelize.INTEGER

});

//Message Board Model

var Message = orm.define('Message', {
  name: Sequelize.STRING,
  message: Sequelize.STRING
})


//League Model
var League = orm.define('league', {
	name: Sequelize.STRING,
  maxNum: Sequelize.INTEGER,
  startbalance: Sequelize.INTEGER
});

//Joint table for League and user
var League_user = orm.define('League_user', {
})

Message.belongsTo(User);
User.hasMany(Message);

League.hasMany(Message);
Message.belongsTo(League);

//League to User - Many to Many
League.belongsToMany(User, { through: 'League_user'});
User.belongsToMany(League, { through: 'League_user'});

//League to Portfolio - One to Many
League.hasMany(Portfolio);
Portfolio.belongsTo(League);

//Portfolio to User - One to Many
User.hasMany(Portfolio);
Portfolio.belongsTo(User);

//Transaction to User - One to Many

Portfolio.hasMany(Transaction);
Transaction.belongsTo(Portfolio);


User.sync();
League.sync();
Portfolio.sync();
Transaction.sync();
League_user.sync();
Message.sync();


exports.League_user = League_user;
exports.User = User;
exports.League = League;
exports.Portfolio = Portfolio;
exports.Transaction = Transaction;
exports.Message = Message;


