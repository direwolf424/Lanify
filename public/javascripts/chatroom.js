$(document).ready(function(){
   $("#chatRoom").click(function(){
      $('#notify_chat').html('');
      cnt=0;
      $('.nav-stacked a[href="#chatroom"]').tab('show');
   });

   $('#submitmsg').click(function(){
      var text=$('#usermsg').val();
      text=text.trim();
      if(!loggedin){
         alert('You need to Be logged in to Chat , It will take just 20 sec :P');
         mswitch();
      }
      else if(text.length==0)
         alert('Please type something and then send :) ');
      else{
         var color='inherit'
         if(text=='@help'){
            help_msg();
            return false;
         }
         if(text=='@clear'){
            $('#messages').html('');
            $('#usermsg').val('');
            return false;
         }
         if(text=='@listen'){
            color='green';
            text = 'Listening to song '+currentSong.title+' from album '+currentSong.album;
         }
         socket.emit('chat message',{'nick':userName,'msg':text,'color':color});
         $('#usermsg').val('');
      }
      return false;
   });
   socket.on('chat message',function(data){
      var color='inherit';
      if(data.msg =='(y)' || data.msg =='(Y)')
         data.msg='<span class="glyphicon glyphicon-thumbs-up"></span>';
      if(data.msg[0]=='@'){
         var word = data.msg.split(' ');
         if(word[0]=='@'+userName){
            playSound();
            color='red';
         }
      }
      if(data.color=='green')
         color=data.color;

      var html='<span style="font-size:80%;font-family:Comic Sans MS, cursive, sans-serif;color:#4A4792">'+data.nick+' :</span><span style="font-size:75%;font-family:cursive;color:'+color+'">'+data.msg+'</span><br>';
      $('#messages').append(html);
      var objDiv = document.getElementById("chatbox");
      objDiv.scrollTop = objDiv.scrollHeight;
   });
   socket.on('online user',function(data){
      //console.log(data);
      var html="";
      var user_nick,loggout_cnt=0;
      $('#online-users').empty();
      for(var i=0;i<data.length;i++){
         user_nick=data[i];
         if(user_nick.nick=="Lanify_Default")
            loggout_cnt++;
         else{
            html='<span class="glyphicon glyphicon-user" onclick="user_chat(\''+user_nick.nick+'\'); return false;" style="cursor:pointer">&nbsp;<span style="font-size:90%;font-family:cursive">'+user_nick.nick+'</span></span><br>';
            $('#online-users').append(html);
         }
      }
      $('#user_status').html(loggout_cnt+' Guest users(not logged in)');
      $('#total_status').html('Users Online{'+data.length+'}');

   });

   function playSound(){
      filename='alert';
      document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
      return false;
   }

   function help_msg(){
      var msg='<ul style="font-size:85%;font-family:cursive"><li>type @listen and flash your current playing song to everyone </li><li>type @username <msg >to ping other user </li><li>(y) for sending like as in FaceBook</li><li>@help for seeing this help message</li><li>@clear for clearing the chat history</li><li>We made this stuff because we were jobless,actually one is placed :P </li><li>This chat is not logged and it vanishes as soon as the page refreshes :D</li></ul>';
      //var html='<span style="font-size:80%;font-family:Comic Sans MS, cursive, sans-serif;color:#4A4792">'+userName+' :</span><span style="font-size:75%;font-style:italic;color:inherit">'+msg+'</span><br>';
      $('#messages').append(msg);
      var objDiv = document.getElementById("chatbox");
      objDiv.scrollTop = objDiv.scrollHeight;
      $('#usermsg').val('');
   }

   function user_chat(nick){
      console.log('da',nick);
      var text = '@'+nick+' ';
      $('#usermsg').val(text);
      $('#usermsg').focus();
      return false;
   }

});

