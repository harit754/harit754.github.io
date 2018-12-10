const mysql=require('mysql');
var connection={};
function createconnection(){
    connection=mysql.createConnection({
        host:'localhost',
        user:'atmuser',
        database:'atm'
    })
    return connection;
}
module.exports={
    adduser:function(newuser,cb){
    const conn=createconnection();
        conn.connect();
        var str='insert into accounts (name,age,address,amount,pin) values ('+'"'+newuser.name+'",'+newuser.age+',"'+newuser.address+
                '",'+newuser.amount+',"'+newuser.pin+'");';
        conn.query(str,function(err,result){
           if(err) throw err;
           /* conn.query('select id from accounts where pin='+newuser.pin,function(err,rows,fields){
               for(var row of rows){
                   id=row.id;
               }

            });*/
  cb(result);
        });
conn.end();
    },
    verify:function(login,cb){
        const conn=createconnection();
        conn.connect();
        var resp={
            id:0
        }
       conn.query('select id,pin from accounts where id='+login.id,function(err,rows,fields){
           if(err)
               cb(resp);

          var login2={
              id:0,
              pin:0
          };
          for(var row of rows){
              login2.id=row.id;
              login2.pin=row.pin;
          }
          if(login.pin==login2.pin)
              resp.id=login.id;

           cb(resp);
       });
        conn.end();
    },
    info:function(id,cb){
        const conn=createconnection();
        conn.connect();
        conn.query('select name from accounts where id ='+id,function(err,rows,fields){
            if(err) res.redirect('/');
            var name;
            for(var row of rows)
                name=row.name;
            cb(name);
        });
        conn.end();
    },
    withdrawl:function (withdrawl,cb) {
        const conn=createconnection();
        conn.connect();
        var resp={
            status:0
        }
        var amnt=0;

        conn.query('select amount from accounts where id='+withdrawl.id,function(err,rows,fields){
           if(err)
               cb(resp);

            for(var row of rows){
                amnt=row.amount;
            }
            if(amnt-withdrawl.amt>=1000)
            {amnt=amnt-withdrawl.amt;
               const conn=createconnection();
                conn.connect();
                conn.query('update accounts set amount='+amnt+' where id='+withdrawl.id+';',function(err,result){
                    if(err) cb(resp);
                    resp.status=1;
                    cb(resp);
                    conn.end();
                });
            }
            else
            {resp.status=2;
                     cb(resp);}
            conn.end();

        });

    },
deposit:function (deposit,cb) {
    const conn=createconnection();
    conn.connect();
    var amnt=0;
    var resp={
        status:0
    }
    conn.query('select amount from accounts where id='+deposit.id,function (err,rows,fields) {
        if (err)
            cb(resp);


        for (var row of rows) {
            amnt = row.amount;
        }


        amnt = amnt + deposit.amt;
        const conn=createconnection();
        conn.connect();
        conn.query('update accounts set amount='+amnt+' where id='+deposit.id+';', function (err, result) {
            if (err)
            cb(resp);
            else {
                resp.status = 1;
                cb(resp);
            }
        });
        conn.end();
    });
},
    enquiry:function (id,cb) {
        const conn=createconnection();
        conn.connect();
        var amnt={
            amt:0
        };
        conn.query('select amount from accounts where id='+id,function (err,rows,fields) {
           if(err) cb(amnt);
            for(var row of rows){
                amnt.amt=row.amount;
                cb(amnt);
                conn.end();
            }
        });
    }

}