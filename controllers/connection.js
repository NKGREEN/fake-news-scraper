var databaseUrl = "fakeNews";
var collections = ["breitbartArticles"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});