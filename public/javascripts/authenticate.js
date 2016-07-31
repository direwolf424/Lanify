/**
 * Created by Saurabh on 19-Jul-16.
 */
var loggedin=false,adminp,userName,socket_id;

$.ajax({
    type:"GET",
    url:'/status',
    success:function(data){
        console.log(data);
        if(data=="true")
            loggedin=true;
        else
            loggedin=false;
    }
});
$.ajax({
    type:"GET",
    url:'/status1',
    success:function(data){
        console.log(data);
        if(data=="true")
            adminp=true;
        else
            adminp=false;
    }
});
$.ajax({
    type:"GET",
    url:'/getUserName',
    success:function(data){
        console.log("getUsername"+data);
        if(data=="false")
            userName="Lanify_Default";
        else
            userName=data;
    }
});
