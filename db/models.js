var Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



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
      return bcrypt.hashSync(this.password);
    },
      validPassword: function(pass) {
      return bcrypt.compareSync(pass, this.password);
    }
  }
});

User.beforeCreate(function(user, options) {
  user.password = user.hashPassword();
});

//Portfolio Model
var Portfolio = orm.define('Portfolio', {
	balance: Sequelize.INTEGER
});


//Transaction Model
var Transaction = orm.define('Transaction', {

	symbol: Sequelize.STRING,
	price: Sequelize.STRING,

	buysell: Sequelize.BOOLEAN,
  shares: Sequelize.INTEGER

});


//League Model
var League = orm.define('league', {
	name: Sequelize.STRING,
    maxNum: Sequelize.INTEGER
});

//Joint table for League and user 
var League_user = orm.define('League_user', {
})

//League to User - Many to Many
League.belongsToMany(User, { through: 'League_user'});
User.belongsToMany(League, { through: 'League_user'});


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


exports.League_user = League_user;
exports.User = User;
exports.League = League;
exports.Portfolio = Portfolio;
exports.Transaction = Transaction;


