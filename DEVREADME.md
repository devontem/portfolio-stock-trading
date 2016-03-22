## SASS

If you want to compile sass, you have two options. You can can run `gulp sass` or `npm run sass`. Either will compile correctly. Alternatively, you can run `gulp sass:watch` to constantly watch for changes you make and compile as you go.

## Linting

In order to lint all files in the client directory, you can run either `gulp lint` or `npm lint`. Either will lint correctly. Later, we will add linting to the server files.


##Concatenation

After you have updated any javascript files on the client side, you need to run `gulp concat` submitting a pull request in order to make sure your changes are included in the main app file.

As you develop, use `gulp concat:watch` in order to watch for changes you make to front-end files and then automatically concatenate the files. The watch is very fast, taking generally less than 2/10ths of a second.


## Testing
### angular
For angular, we are using Karma. After you have npm installed, make sure to also run (at least once) `npm install karma-cli -g` to install the command line interface for karma. After that, in order to run the karma tests, you need to simply run `karma start`, which will open a chrome browser window sith some relevant information.
