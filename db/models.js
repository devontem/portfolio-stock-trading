var Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// if (process.env.DEPLOYED === 'true'){
//   var orm = new Sequelize(process.env.JAWSDB_URL);
// } else {
var orm = new Sequelize('Pistonsdb', 'root', '')


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

var Portfolio = orm.define('Portfolio', {
	PortfolioName: Sequelize.STRING
});

var Stocks = orm.define('Stocks', {
	symbol: Sequelize.STRING,
	Ask: Sequelize.STRING,
	PercentChange: Sequelize.INTEGER,
	Buy: Sequelize.BOOLEAN,
	Sell: Sequelize.BOOLEAN
});

var Rooms = orm.define('Rooms', {
	roomName: Sequelize.STRING
});

Rooms.hasMany(User);
//User.belongsToMany(Rooms);

User.hasMany(Portfolio);
Portfolio.belongsTo(User);

// Portfolio.belongsToMany(Stocks, { through: PortfolioStocks});
// Stocks.belongsToMany(Portfolio, { through: PortfolioStocks});

User.sync();
Rooms.sync();
Portfolio.sync();
Stocks.sync();

exports.User = User;
exports.Rooms = Rooms;
exports.Portfolio = Portfolio;
exports.Stocks = Stocks;

