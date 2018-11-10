# trendlier-server-capstone | Thinkful back-end part of the React Capstone
Trendlier shows the top 10 trending items on Best Buy.   Client can add items to a wishlist, or purchase them by following a link.  Client can also add and edit notes to each item in wishlist. 

## Screenshots

Home Page View | Sign Up Page
:-------------------------:|:-------------------------:
![Home Page](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/intro.jpg)  |  ![Sign Up Page](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/signup.jpg)
Results | Add Entry
![Results](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/results-page.jpg) |  ![Add Item](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/itemdetails.jpg) 
Wish List | Edit Item
![Wishlist](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/wishlistscreen.jpg) |  ![Edit Item](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/edit-item.jpg) 


### UI Flow
![UI Flow handwritten draft](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/flow.jpg)

### Wireframe 
Homepage| Results Page
:-------------------------:|:-------------------------:
![Landing Page](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/landingpage.jpg)| ![Results Page](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/results.jpg)

Item View| Wishlist View
:-------------------------:|:-------------------------:
![Item View](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/single.jpg)| ![Wishlist View](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/wishlist.jpg)

Edit Wishlist Item
![Edit Wishlist Item](https://github.com/ElenaG518/trendlier-server-capstone/blob/master/github-images/edit.jpg)

## Working Prototype
You can access a working prototype of the node app here: https://trendlier-server-capstone.herokuapp.com/ and react app here: 



## Functionality
The app's functionality includes:
* Every User has the ability to create an account that stores information unique to them
* User can Add Entries, Update Entries, and Delete Entries

## Technology
* Front-End: HTML5 | CSS3 | JavaScript ES6 | jQuery
* Back-End: Node.js | Express.js | Mocha | Chai | RESTful API Endpoints | MongoDB | Mongoose



## Responsive
App is strongly built to be usuable on mobile devices, as well as responsive across mobile, tablet, laptop, and desktop screen resolutions.

## Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* Ability to share compare different items in same category

#  The typical command lines for capstone projects

## Node command lines
* npm install ==> install all node modules
    * npm install --save bcryptjs body-parser cors express mongodb mongoose passport passport-http unirest
    * npm install --save-dev chai chai-http mocha faker
* nodemon server.js ==> run node server
* npm test ==> run the tests

## React command lines
* npm install ==> install all node modules
    * npm install --save bcryptjs body-parser cheerio chokidar-cli concurrently core-js cors cpr enzyme enzyme-react-16-adapter-setup express http-server jsonwebtoken moment mongodb mongoose morgan npm-run-all passport passport-http passport-jwt passport-jwt-strategy react react-addons-test-utils react-dom react-fontawesome react-redux redux redux-thunk rimraf unirest
    * npm install --save-dev acorn babel-cli babel-core babel-loader babel-plugin-transform-object-rest-spread babel-polyfill babel-preset-es2015 babel-preset-react chai chai-enzyme chai-http enzyme-adapter-react-15 enzyme-adapter-react-16 faker json-loader mkdirp mocha react-scripts react-test-renderer sinon sinon-chai webpack
* npm run build ==> build the react files in the "build" folder
* npm start ==> run react server on http://127.0.0.1:8080
* npm test ==> run the tests