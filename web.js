
const express = require('express')
const app = express()
const fs=require('fs')
require('date-utils')

app.get('/', (req, res) => res.send('Hello World!'))
 
 
 
const account=require('./account.js');
function insert_sensor(value,ip){
    obj={};
    obj.value=value;
    obj.ip=ip.replace(/^.*:/,'');

    var connection=account.call_connect();
    connection.connect();
    var query=connection.query('insert into sensors set?',obj,function(err,r    ows,cols){
            if(err) throw err;
            console.log("database insertion ok=%j",obj);
        });
 
}
 
 
var seq=0
app.get('/log',function(req,res) {
  fs.appendFile('log.txt',time+JSON.stringify(req.query.field)+"\n",function    (err) {
    if(err) throw err
     console.log("%j",req.query.field)
     res.end(time + " "+JSON.stringify(req.query))
    });
})
app.get('/data',function(req,res){
    var newDate=new Date();
    var year=newDate.getFullYear();
    var month=newDate.getMonth()+1;
    var day=newDate.getDate();
    if(month<10)
    {
        month="0"+month;
    }
    var hour=newDate.getHours()+9;
    var minute=newDate.getMinutes();
    if(hour>=24)
    {
        hour=hour-24;
        day=day+1;
    }
     if(day<10)
     {
         day="0"+day;
     }
     if(hour<10)
     {
         hour="0"+hour;
     }
      if(minute<10)
     {
         minute="0"+minute;
     }
     var time=year+month+day+","+hour+":"+minute+",";
     //MODIFYING
     r=req.query;
     insert_sensor(r.field,req.connection.remoteAddress);
     //MODIFYING 
     fs.appendFile('temperature.txt',time+req.query.field+"\n",function(err)     {
         if(err) throw err;
         console.log(time+req.query.field)
         res.end(time+req.query.field)
     });
 })
 
 app.get('/dump',function(req,res) {
     var cnt=req.query.count;
     fs.readFile('temperature.txt',function(err,data) {
         if(err) throw err;
         var first;
         var data=data.toString().split("\n");
         var len=data.length;
         if(len<cnt){
             first=0;
         }
         else {
             first=len-cnt;
         }
         var result="";
         for(var i=first;i<len;i++)
         {
             result+=data[i]+"\n";
         }
         res.end(result);
     });
 
 
 })
 
 //MODIFYING
 app.get('/graph',function(req,res){
    console.log('got app.get(graph)');
    var html = fs.readFile('graph.html',function(err,html){
        html=" "+html
        console.log('read file');
        var qstr='select * from sensors ';

        var connection=account.call_connect();
        connection.connect();
        connection.query(qstr,function(err,rows,cols){
            if(err) throw err;
            var first="";
            var last="";
            var data="";
            var comma=""
            var date=new Date;
            for (var i=0;i<rows.length;i++)
            var data="";
            var comma=""
            var date=new Date;
            for (var i=0;i<rows.length;i++)
            {
                r=rows[i];
                hour=r.time.getHours()+9;
                data+=comma+"[new Date("+r.time.getFullYear()+","+r.time.get    Month()+","+r.time.getDate()+","+hour+","+r.time.getMinutes()+","+r.time.get    Seconds()+"),"+r.value+"]";
                comma=",";
            }
            var temp1=rows[0];
            var temp2=rows[rows.length-1];
            first+=temp1.time.getFullYear()+"-";
            if(temp1.time.getMonth>10)
                first+=temp1.time.getMonth()+1+"-";
            else{
                first+="0";
                first+=temp1.time.getMonth()+1+"-";
            }

            first+=temp1.time.getDate()+" ";
            first+=temp1.time.getHours()+9+":";
            first+=temp1.time.getMinutes();

            last+=temp2.time.getFullYear()+"-";
            if(temp1.time.getMonth>10)
                last+=temp2.time.getMonth()+1+"-";
            else{
                last+="0";
                last+=temp2.time.getMonth()+1+"-";
            }

            last+=temp2.time.getDate()+" ";
            last+=temp2.time.getHours()+9+":";
            last+=temp2.time.getMinutes();

            html=html.replace("<%FIRST%>",first);
            html=html.replace("<%LAST%>",last);
            var header="data.addColumn('date','Date/Time');"
            header+="data.addColumn('number','Temperature');"
            html=html.replace("<%HEADER%>",header);
            html=html.replace("<%DATA%>",data);

            res.writeHeader(200,{"Content-Type":"text/html"});

            res.write(html);
            res.end();
        });
    });
});


//MODIFYING

app.listen(3000,() => console.log('Example app listening on port 3000!'))
