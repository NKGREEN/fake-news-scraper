
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var methodOverride = require("method-override");
var Breitbart = require("./models/articles.js");
var Comment = require("./models/comment.js");
var controller = require("./controllers/controller.js")

var cheerio = require("cheerio");
var request = require("request");

var defaultPath = path.join(__dirname, '/');
mongoose.Promise = Promise;
// Sets up the Express App
// =============================================================
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
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


var databaseUrl = "fakeNews";
var collections = ["breitbartArticles"];

//var db = mongojs(databaseUrl, collections);


// Database configuration with mongoose
//mongoose.connect("mongodb://heroku_v5h4xlp7:6i5r0co1s3l35s9uelpq37bl8j@ds163672.mlab.com:63672/heroku_v5h4xlp7");
mongoose.connect("mongodb://localhost/fakeNews");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// First, tell the console what server3.js is doing
/*console.log("\n******************************************\n" +
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
    /*var url = $(element).children().attr('href');
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
/*
*/

  app.get("/scrape", function(req, res) {
                        
                        // Make request to grab the HTML from awwards's clean website section
                        request("http://www.breitbart.com/big-government/", function(error, response, html) {

                            // Load the HTML into cheerio
                            const $ = cheerio.load(html);

                            // Make an empty array for saving our scraped info
                            //var results = [];

                            // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
                            $("article.has-post-thumbnail").each(function(i, element) {
                                var result = {};

                                result.title = $(this).children().attr('title');
                                result.excerpt = $(this).children().next().children('.excerpt').text().trim();
                                result.url = $(this).children().attr('href');
                                result.imgUrl = $(this).children().children().attr('src');

                                var entry = new Breitbart(result)

                                entry.save(function(err, doc) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log(doc)
                                        }
                                    })

                               
                               })
                            });
                         console.log('redirected')
                                res.redirect('/');

                        });




app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));

});

app.get('/allArticles', function (req, res) {
  Breitbart.find({})
    .populate("comment")
    .exec(function (error, doc) {
      if (error) {
        console.log(error)
      }
      else {
        var data = {
            articles: doc
        };
        res.render("index", data);
      }
    })
});

app.get('/allArticles/:id', function(req, res) {
    Breitbart.findOneAndUpdate({"_id": req.params.id}, {"saved": true}) 
    .exec(function(err, doc) {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect('/allArticles')
      }
    })
})

app.get('/savedArticles', function (req, res) {
  Breitbart.find({"saved": true})
    .populate("comment")
    .exec(function (error, doc) {
      if (error) {
        console.log(error)
      }
      else {
        var data = {
            articles: doc
        };
        res.render("saved", data);
      }
    })
});

app.post("/saved")