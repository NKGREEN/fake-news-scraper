
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var methodOverride = require("method-override");
var Breitbart = require("./models/articles.js");
var Comment = require("./models/comment.js");
var controller = require("./controllers/controller.js")




var defaultPath = path.join(__dirname, '/');
mongoose.Promise = Promise;
// Sets up the Express App
// =============================================================
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
// Include methods to configure routes
// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));


// Heroku will set the port via an environment variable


// Serve static content for the app from the "public" directory
app.use(express.static(defaultPath + "public"));

// Set the view engine to express-handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware to support JSON and URL encoded bodies
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));



var databaseUrl = "fakeNews";
var collections = ["breitbartArticles"];
var PORT = process.env.PORT || 3000;
var db = 'mongodb://localhost/fakeNews' || process.env.MONGODB_URI;


// Database configuration with mongoose
//mongoose.connect("mongodb://heroku_v5h4xlp7:6i5r0co1s3l35s9uelpq37bl8j@ds163672.mlab.com:63672/heroku_v5h4xlp7");
mongoose.connect(db, function (error) {
  useMongoClient: true
  if (error) {
    console.log(error)
  }
  else {
    console.log('Success!')
  }
})
app.listen(PORT, function() {
    console.log('Node app is running on port ' + PORT);

});

// Use morgan and body parser with our app


// Configure Routes
// =============================================================
//htmlRoutes.setup(defaultPath, app, data);
//apiRoutes.setup(defaultPath, app, data);




app.get("/", function(request, response) {
    
    response.render("home");

});

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


//app.post("/saved")