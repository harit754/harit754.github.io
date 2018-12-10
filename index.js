var express=require('express');
const app=express();
const md5=require('md5');
const db=require('./dbhandler');
app.use('/',express.static('./public_html'));
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.post('/adduser',function(req,res){
    var newuser={
        name:req.body.name,
        age:req.body.age,
        address:req.body.address,
        amount:req.body.amount,
        pin:md5(req.body.pin)
    }
    db.adduser(newuser,function (result) {
      res.send(result);
    });
});
app.post('/login',function(req,res){
    var login={
        id:req.body.id,
        pin:md5(req.body.pin)
    }
    db.verify(login,function(resp){
        res.send(resp);
    });
});
app.post('/getinfo',function(req,res){
   var id=req.body.id;
    db.info(id,function(name){
        res.send(name);
    })
});
app.post('/withdrawl',function(req,res){
    var withdrawl={amt:req.body.withdrawl,id:req.body.id};
    db.withdrawl(withdrawl,function(resp){
        res.send(resp);
    });
});
app.post('/deposit',function(req,res){
    var deposit={
        amt:Number(req.body.deposit),
        id:req.body.id
    };
    db.deposit(deposit,function (resp) {
        res.send(resp);
    })
});
app.post('/getbalance',function (req,res) {
    var id=req.body.id;
    db.enquiry(id,function(bal){
        res.send(bal);
    })
});
app.listen(8080,function () {
    console.log('On port 8080');
})