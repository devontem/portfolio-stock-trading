#Portfol.io

_A Fantasy Stock Trading App_

Join a League. Create a stock portfolio using fake money but real, up-to-date data. When the league ends, see how you stack up against other users.

### Who Should Use Portfol.io?
Short Answer: You. Me. Everyone.
Long Answer:


## Development
## Concatenation
Only one non-vendor javascript file is referenced on the

### SASS

If you want to compile sass, you have two options. You can can run `gulp sass` or `npm run sass`. Either will compile correctly. Alternatively, you can run `gulp sass:watch` to constantly watch for changes you make and compile as you go.

### Linting

In order to lint all files in the client directory, you can run either `gulp lint` or `npm lint`. Either will lint correctly. Later, we will add linting to the server files.

## Testing
### Angular
For angular, we are using Karma. After you have npm installed, make sure to also run (at least once) `npm install karma-cli -g` to install the command line interface for karma. After that, in order to run the karma tests, you need to simply run `karma start`, which should run the tests in the terminal.

### Server-Side Testing
For server-side testing, you need to run `mocha test`.
