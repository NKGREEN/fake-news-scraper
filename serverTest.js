
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var methodOverride = require("method-override");
var models = require("./models/models.js");
var controller = require("./controllers/controller.js")

var cheerio = require("cheerio");
var request = require("request");

var defaultPath = path.join(__dirname, '/');

// Sets up the Express App
// =============================================================
var app = express();

// Include methods to configure routes
// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");

// Heroku will set the port via an environment variable
app.set('port', (process.env.PORT || 3000));

// Serve static content for the app from the "public" directory
app.use(express.static(defaultPath + "public"));

// Set the view engine to express-handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware to support JSON and URL encoded bodies
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Configure Routes
// =============================================================
//htmlRoutes.setup(defaultPath, app, data);
//apiRoutes.setup(defaultPath, app, data);

app.get("/", function(request, response) {
    
    response.render("index");
});


/*var databaseUrl = "fakeNews";
var collections = ["breitbartArticles"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});*/

// First, tell the console what server3.js is doing
console.log("\n******************************************\n" +
            "Look at the image of every award winner in \n" +
            "one of the pages of awwwards.com. Then,\n" +
            "grab the image's source URL." +
            "\n******************************************\n");

// Make request to grab the HTML from awwards's clean website section
request("http://www.breitbart.com/big-government/", function(error, response, html) {

  // Load the HTML into cheerio
  var $ = cheerio.load(html);

  // Make an empty array for saving our scraped info
  var results = [];

  // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
  $("article.has-post-thumbnail").each(function(i, element) {

    /* Cheerio's find method will "find" the first matching child element in a parent.
     *    We start at the current element, then "find" its first child a-tag.
     *    Then, we "find" the lone child img-tag in that a-tag.
     *    Then, .attr grabs the imgs src value.
     * So: <figure>  ->  <a>  ->  <img src="link">  ->  "link"  */
   // var imgLink = $(element).find("a").find("img").attr("src");
    var url = $(element).children().attr('href');
    console.log(url);
    var title =  $(element).children().attr('title');
    var imgUrl = $(element).children().children().attr('src')
    var excerpt = $(element).children().next().children().next().text()
    // Push the image's URL (saved to the imgLink var) into the results array
    results.push({ link: url, title: title, imgURL: imgUrl, excerpt: excerpt });
  });

  // After looping through each element found, log the results to the console
  console.log(results);
  $('#scrapedText').text(results);

  /*app.post('/articles', function(error, doc) {
    var newBreit = new Breitbart;
  })*/
});
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));

});