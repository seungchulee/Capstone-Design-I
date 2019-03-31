
  mysql=require('mysql');
  
  exports.call_connect=function() {
      var connection=mysql.createConnection({
          host:'localhost',
          user:'my',
          password:'mypassword',
          database:'mydb'
      });
     return connection;
 }

