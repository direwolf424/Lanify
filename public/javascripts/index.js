var currentSong='';
function load_home(){
   $('.nav-stacked a[href="#home"]').tab('show');
   return false;
}

function hack(){
   $('.next1').click();
   $('.prev1').click();
   $('.next2').click();
   $('.prev2').click();
   $('.next3').click();
   $('.prev3').click();
}

$(document).ready(function(){

   var socket = io.connect();
   socket.on('connect', function() {
      socket.emit('user', {'loggedin':loggedin,'userName':userName});
   });

   socket.on('session_info', function(data){
      socket_id = data.socket_id;
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
         if(text=='@listen' || text=='@listen '){
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
            html='<span class="glyphicon glyphicon-user" style="cursor:pointer">&nbsp;<span style="font-size:90%;font-family:cursive">'+user_nick.nick+'</span></span><br>';
            $('#online-users').append(html);
         }
      }
      $('#user_status').html(loggout_cnt+' Guest users(not logged in)');
      $('#total_status').html('Users Online{'+data.length+'}');

   });

   repeat();
   //load_tags();
   //load_user_playlist();
   load_slick_song();
   load_slick_album();
   load_more_artist();
   load_more_song();
   load_more_album1('/users/album/english');
   load_more_album2('/users/album/hindi');
   load_more_album3('/users/album/telugu');
   load_private_playlist();
   load_public_playlist();
   load_playlist();
   dragdrop();
   var img = document.getElementsByTagName('img');
   for(var i =0;i< img.length;i++)
   {
      img[i].setAttribute("onerror","this.src='/image/image.jpg'");
   }

   document.getElementById('clear_queue').addEventListener('click',clear_queue);

   var myInput = document.getElementById("bar");
   if ("onpropertychange" in myInput && !("oninput" in myInput)) {
      myInput.onpropertychange = function () {
         if (event.propertyName == "value")
            inputChanged.call(this, event);
      };
   }
   else
      myInput.oninput = inputChanged;

   function inputChanged () {
      if(this.value.length<2)
      {
         var res = document.getElementById('search_result');
         res.style.visibility="hidden";
         res.style.display='none';
      }
   }

   $('.album_slick').slick({
      lazyLoad: 'ondemand',
      slidesToShow: 8,
      slidesToScroll: 3,
      swipeToSlide: true,
      prevArrow: $('.prev1'),
      nextArrow: $('.next1')

   });

   $('.song_slick').slick({
      slidesToShow: 8,
      slidesToScroll: 3,
      lazyLoad: 'ondemand',
      swipeToSlide: true,
      prevArrow: $('.prev2'),
      nextArrow: $('.next2')
   });

   $('.artist_slick').slick({
      lazyLoad: 'ondemand',
      slidesToShow: 8,
      slidesToScroll: 3,
      swipeToSlide: true,
      prevArrow: $('.prev3'),
      nextArrow: $('.next3')
   });

   $('body').click(function(event) {
      if(!$(event.target).is('.search_block')) {
         var res = document.getElementById('search_result');
         res.style.visibility="hidden";
         res.style.display='none';
         myInput.value = "";
      }
   });

});


$(function () {

   $("#bar").autocomplete({
      source: function (request, response) {
         $.ajax({
            url: lanify_search_url,
            type: "GET",
            data: request,  // request is the value of search input
            success: function (data) {
               var res = document.getElementById('search_result');
               res.style.visibility="visible";
               res.style.display='block';
               var songs = data[0];
               var albums = data[1];
               var artists = data[2];
               res = document.getElementById('search_song');
               res.style.visibility="visible";
               res.style.display='block';
               res.innerHTML = "";
               if(songs.length===0)
               {
                  res.innerHTML = "<label>Song not found in Lanify</label><label>Put a Request and we will upload it by the end of the day<label>";
               }
               for(var i in songs)
               {
                  var song_json = JSON.stringify(songs[i]);

                  res.innerHTML += "<div class=' search_line  ui-menu-item'> <div onclick='play1("+song_json+"); return false;' class='search_name'> <span>"+songs[i].title+" </span> </div> <div class='search_plus'> <a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class=' search_block glyphicon glyphicon-plus'></span> </a> </div>  </div>";
                  if(i>5)
                     break;
               }
               res = document.getElementById('search_album');
               res.style.visibility="visible";
               res.style.display='block';
               res.innerHTML = "";
               if(albums.length===0)
               {
                  res.innerHTML = "<label>No Albums present</label>";
               }
               for(i in albums)
               {
                  var pass = JSON.stringify("load_album('/album/"+albums[i]+"')");
                  res.innerHTML += "<p class='ui-menu-item' onclick="+pass+">"+albums[i]+"<p>";
                  if(i>5)
                     break;
               }
               res = document.getElementById('search_artist');
               res.style.visibility="visible";
               res.style.display='block';
               res.innerHTML = "";
               for(i in artists)
               {
                  res.innerHTML += "<p class='ui-menu-item' onclick='load_artist("+JSON.stringify('/artist/'+artists[i])+"); return false;'>"+artists[i]+"<p>";
                  if(i>5)
                     break;
               }
            }
         });
      },

      // The minimum number of characters a user must type before a search is performed.
      minLength: 1,

      // set an onFocus event to show the result on input field when result is focused
      focus: function (event, ui) {
         this.value = ui.item.label;
         event.preventDefault();
      },
      select: function (event, ui) {
         // Prevent value from being put in the input:
         this.value = ui.item.label;
         // Set the id to the next input hidden field
         $(this).next("input").val(ui.item.value);
         // Prevent other event from not being execute
         event.preventDefault();
         // optionnal: submit the form after field has been filled up
         $('#quicksearch').submit();
      }
   });

});

/* functions to bind various keys for music player */
$(document).keydown(function(e) {
   //alert(e.target.tagName.toLowerCase() );
   var target = e.target || e.srcElement;
   if(e.target.tagName.toLowerCase() != 'input' && target.tagName != "TEXTAREA" ){
      switch(e.which) {
         case 32: // spacebar
            if($('#jquery_jplayer_1').data().jPlayer.status.paused){
               $('.jp-play').click();
               var name = document.getElementById("jp-song-name");
               var album =document.getElementById("jp-album-name");
               title = name.innerHTML;
               album = album.innerHTML;
               highlight(title,"play");
            }
            else{
               $('.jp-pause').click();
               var name = document.getElementById("jp-song-name");
               var album =document.getElementById("jp-album-name");
               title = name.innerHTML;
               album = album.innerHTML;
               highlight(title,"pause");
            }
            break;
         case 191: //backslash
            $('#bar').focus();
            break;
         case 37: //left
            $('.jp-previous').click();
            break;
         case 38: //top
            var vol=$("#jquery_jplayer_1").data("jPlayer").options.volume;
            $("#jquery_jplayer_1").jPlayer("volume", vol+0.1);
            break;
         case 39: //right
            $('.jp-next').click();
            break;
         case 40: //bottom
            var vol=$("#jquery_jplayer_1").data("jPlayer").options.volume;
            $("#jquery_jplayer_1").jPlayer("volume", vol-0.1);
            break;
         case 27:
            $('#search_result').css("visibility","hidden");
            $('#search_result').css("display","none");
            break;
         case 82: //right
            $('.jp-repeat').click();
            break;
         case 83: //right
            $('.jp-shuffle').click();
            break;


         default: return; // exit this handler for other keys
      }
   }
   else{
      switch(e.which) {
         case 27:
            $('#bar').val("");
            $('#search_result').css("visibility","hidden");
            $('#search_result').css("display","none");
            break;


         default: return; // exit this handler for other keys
      }
   }
   e.preventDefault(); // prevent the default action (scroll / move caret);
});

//$(window).on("load", function() {
setTimeout(function(){
   $('body').addClass('loaded');
   $('h1').css('color','#222222');
   $('.navbar-fixed-bottom').css('position','fixed');
   $('.navbar-fixed-top').css('position','fixed');
   //setTimeout(function(){
      //$("#openingModal").modal('show');
   //},1000);
}, 2000);
//});
function submit_request(){
   var e1 = $('#name').val();
   var e2 = $('#songname').val();
   var e3 = $('#bugs').val();
   var e4 = $('#features').val();
   alert("Thanks for your feedback");
   //$('#name').val('');
   $('#songname').val('');
   $('#bugs').val('');
   $('#features').val('');
   $.ajax({
      type: "POST",
      data: {username:e1,
         songname:e2,
         bugs:e3,
         features:e4
      },
      url: lanify_request_url,
   });
}



function dragdrop() {

   var table = document.getElementById('table_now_playing');
   var tableDnD = new TableDnD();
   tableDnD.init(table);
   tableDnD.onDrop = function(table, row) {
      var rows = this.table.tBodies[0].rows;
      var song = playlist[playlist_index];
      playlist = [];
      for (var i=0; i<rows.length; i++) {
         var play = rows[i].cells[1].firstElementChild.getAttribute('onclick');
         play = play.substr(6,play.length-6-16);
         var play_obj = JSON.parse(play);
         playlist.push(play_obj);
         if(play_obj.path==song.path)
         {
            playlist_index=i;
         }
      }
      localStorage.setItem('queue', JSON.stringify(playlist));
   };
}

$(document).ready(function(){
   //$('#playlist').click(function(){
   ////alert('hello');
   //load_user_playlist();
   //});
   //$('#add_to_playlist').webuiPopover({title:'Title',content:'Content'});
   //$('.backBtn').webuiPopover({title:'Title',content:'Content'});
});
$('body').on('click', function (e) {
   $('[data-toggle="popover"]').each(function () {
      //the 'is' for buttons that trigger popups
      //the 'has' for icons within a button that triggers a popup
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
         $(this).popover('hide');
      }
   });
});

$('html').on('mouseup', function(e) {
   if(!$(e.target).closest('.popover').length) {
      $('.popover').each(function(){
         $(this.previousSibling).popover('hide');
      });
   }
});

function playSound(){   
   filename='alert';
   document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
   return false;
}
function help_msg(){
   var msg='<ul style="font-size:85%;font-family:cursive"><li>type @listen and flash your current playing song to everyone </li><li>type @username <msg >to ping other user </li><li>(y) for sending like as in FaceBook</li><li>@help for seeing this help message</li><li>We made this stuff because we were jobless,actually one is placed :P </li><li>This chat is not logged and it vanishes as soon as the page refreshes :D</li></ul>';
   //var html='<span style="font-size:80%;font-family:Comic Sans MS, cursive, sans-serif;color:#4A4792">'+userName+' :</span><span style="font-size:75%;font-style:italic;color:inherit">'+msg+'</span><br>';
   $('#messages').append(msg);
   var objDiv = document.getElementById("chatbox");
   objDiv.scrollTop = objDiv.scrollHeight;
   $('#usermsg').val('');
}
