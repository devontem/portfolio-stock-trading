# Portfol.io

Portfolio is a simulated stock trading environment where users can join leagues to compete against their friends. In their league, the user will create a portfolio by selling and buying stocks using fake money, but realtime stock market information. Over time, the user can track their portfolio, and make trades where necessary. And then, when the league ends, the user can see how she stacks up against other users by checking the leaderboard.

And there's more.

A full-featured application, with Portfol.io you can:
- Chat with other users using our message system
- Earn badges for winning leagues and hitting average return milestones.
- Check out the forum for tips and tricks.
- Follow the latest stock news for stocks you've traded.
- View your portfolio's status using interactive charts.
- Create a watchlist so you can watch certain stocks.
- Set a purchase request, such that when a stock hits a certain price, our system will buy it for you while you're going about your day.


### Who Should Use Portfol.io?
Portfol.io is designed with the beginner and the expert in mind. If someone is completely new to stock trading, Portfol.io is the perfect place to start, since you are using real, timely data, but you aren't using real money. If a teacher wanted to teach her class about the stock market , she could leverage Portofol.io to create a fun, engaging experience. Lastly, if you're an experienced trader with years under the belt, Portol.io is a way for you to try your skills out competitively, against friends and strangers.  

### How to Get Started
It's easy. Head over to [our website](portfolioio.herokuapp.com), sign up and you're ready. Once logged in, you'll see the available leagues to join, or, if you're feeling adventurous, you can make your own private league and invite your friends.

### Why did we make Portfol.io?
Portfol.io fills a gap. For beginners, there aren't a lot of tools out there that will teach about the stock market that are either a) simple enough or b) free, as in, we aren't taking any of your money, and free, as in, you aren't investing real dollars. And because we've crafted a environment that relies on actual, realtime data from the NYSE, you can rest assured that you're getting an authentic experience.

## Development
### Requirements
- Node Version: 4.1.1
- MySQL: 2.2 or higher
- Karma CLI (for Angular testing)

Everything else should be included in the package.json. 


### Concatenation
Only one non-vendor javascript file is referenced on the index.html. The other files are concatenated together. The concatenation happens automatically when you run `npm start` or `npm install`. It can be triggered manually by running `gulp concat`. Additionally, if you are working on front-end files, you can run `gulp: concat:watch` which will note any file changes that you make on the front end and run the concatenation script.

### SASS

If you want to compile sass, you have two options. You can can run `gulp sass` or `npm run sass`. Either will compile correctly. Alternatively, you can run `gulp sass:watch` to constantly watch for changes you make and compile as you go.

### Linting

In order to lint all files in the client directory, you can run either `gulp lint` or `npm lint`. Either will lint correctly. Later, we will add linting to the server files.

## Testing
### Angular
For angular, we are using Karma. After you have npm installed, make sure to also run (at least once) `npm install karma-cli -g` to install the command line interface for karma. After that, in order to run the karma tests, you need to simply run `karma start`, which should run the tests in the terminal.

### Server-Side Testing
For server-side testing, you need to run `mocha test`.
