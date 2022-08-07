var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://pc:test123@cluster0.jdybh.mongodb.net/users?retryWrites=true&w=majorityins";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});