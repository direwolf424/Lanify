var current_name;
var pub_priv;
function remove_from_playlist(song_json,elem){
   var id = song_json._id;
   var table = document.getElementById('playlist_songs');
   var index = elem.parentNode.parentNode.rowIndex;
   table.deleteRow(index);
   //console.log(id);
   var url="/playlist/";
   $.ajax({
      type:"GET",
      data:{flag:'remove',id:id,pname:current_name},
      url:url,
      success:function(data){
         $.notify("Song Removed "+song_json.title, {
            animate: {
               enter: 'animated fadeInRight',
               exit: 'animated fadeOutRight'
            },
            newest_on_top: false,
            delay: 100,
         });
      }
   });
}
$(document).ready(function(){
   $.fn.bootstrapSwitch.defaults.size = 'small';
   $("[name='my-checkbox']").bootstrapSwitch();
   $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
      //console.log(this); // DOM element
      //console.log(event); // jQuery event
      //console.log(state); // true | false
      var url="/playlist/";
      $.ajax({
         type:"GET",
         data:{flag:'share',sw:state,pname:current_name},
         url:url,
         success:function(data){
            $.notify("Playlist shared  "+state, {
               animate: {
                  enter: 'animated fadeInRight',
                  exit: 'animated fadeOutRight'
               },
               newest_on_top: false,
               delay: 100,
            });
         }
      });
   });
   if(loggedin){
      $('#rename_playlist').editable({
         type: 'text',
         pk: 1,
         url: '/playlist/',
         title: 'Enter playlist name',
         ajaxOptions: {
            type: 'get',
            dataType: 'json'
         },
         autotext:'never',
         params: function(params) {
            //originally params contain pk, name and value
            params.flag = 'rename';
            params.playlist_name = $("#playlist_name").html();
            return params;
         }
      });
   }
});
function load_public_playlist()
{
   var url="/playlist/";
   //console.log("Loading Playlist");
   $.ajax({
      type:"GET",
      data:{flag:'fetch',share:'true'},
      url:url,
      success:function(data){
         //alert('hello',data);
         //console.log(data);
         pub_priv=true;
         $("#playlist_public_div").empty();
         var elem = document.getElementById("playlist_public_div");
         var x = JSON.stringify('/image/image.jpg');
         for(var i=0;i<data.length;i++){
            addRatingWidget(buildPlaylistItem(data[i],elem), data[i]);
         }
      }
   });
   return false;
}
function buildPlaylistItem(data,playlist) {
   var playlistItem = document.createElement('div');

   var html = "<a href='' onclick='load_playlist_songs("+JSON.stringify(data)+"); return false;' > <div class='album tags col-md-5ths'> <div class='song_image'> <img src='/image/image.jpg'> </img> </div> <div class='ellip_name'> "+capitalizeFirstLetter(data.name)+" </div><div class='ellip_name'>By "+data.user_name+" </div></a><div class='c-rating'>("+data.rating_count+")</div></div>";
   playlistItem.innerHTML = html;
   playlist.appendChild(playlistItem);

   return playlistItem;
}
function addRatingWidget(playlistItem, data) {
   var ratingElement = playlistItem.querySelector('.c-rating');
   var currentRating = Math.floor(data.rating/data.rating_count);
   var maxRating = 5;
   var callback = function(rating) { alert(rating); };
   var r = rating(ratingElement, currentRating, maxRating, callback);
}
function load_private_playlist()
{
   var url="/playlist/";
   //console.log("Loading Playlist");
   if(loggedin){
      $.ajax({
         type:"GET",
         data:{flag:'fetch'},
         url:url,
         success:function(data){
            //alert('hello',data);
            //console.log(data);
            pub_priv=false;
            $("#playlist_private_div").empty();
            var elem = document.getElementById("playlist_private_div");
            for(var i=0;i<data.length;i++)
            {
               if(i==0){
                  elem.innerHTML += "<a href='' onclick='load_auto_playlist_songs("+JSON.stringify(data[i])+"); return false;' > <div class='album tags col-md-5ths'> <div class='song_image'> <img  src='/image/image.jpg'> </img> </div> <div class='ellip_name'> "+capitalizeFirstLetter(data[i].name)+" </div></div>  </a>";
               }else{
                  elem.innerHTML += "<a href='' onclick='load_playlist_songs("+JSON.stringify(data[i])+"); return false;' > <div class='album tags col-md-5ths'> <div class='song_image'> <img  src='/image/image.jpg'> </img> </div> <div class='ellip_name'> "+capitalizeFirstLetter(data[i].name)+" </div></div>  </a>";
               }
            }
         }
      });
   }
   else{
      $("#playlist_private_div").empty();
      var elem = document.getElementById("playlist_private_div");
      elem.innerHTML += "<div class='album tags col-md-5ths'> <div class='song_image'> <img  src='/image/image.jpg'> </img> </div> <div>Please Sign Up to create private playlist </div></div>";
   }
   return false;
}
function load_playlist_songs(play){

   var url="/playlist/";

   $.ajax({
      type: "GET",
      data: {flag:'songs',name:play.name},
      url: url,
      success: function (data,status) {
         //console.log(data);
         //console.log('hello world');
         current_name = play.name;
         play_psong(data,play.name,play.shared,play._id);
      },
      error: function (data,status) {
      },
   });
   $(window).bind('popstate', function() {
      $.ajax({url:location.pathname+'?rel=tab',success: function(data){
         $('.nav-stacked a[href="#home"]').tab('show');
      }});
   });
   return false;
}
function load_auto_playlist_songs(play){

   var url="/playlist/";

   $.ajax({
      type: "GET",
      data: {flag:'auto_songs',name:play.name},
      url: url,
      success: function (data,status) {
         //console.log(data);
         //console.log('hello world');
         current_name = play.name;
         play_auto_psong(data,play.name);
      },
      error: function (data,status) {
      },
   });
   $(window).bind('popstate', function() {
      $.ajax({url:location.pathname+'?rel=tab',success: function(data){
         $('.nav-stacked a[href="#home"]').tab('show');
      }});
   });
   return false;
}
function play_auto_psong(data,tag){
   //console.log('tagging');
   //console.log(data);
   var elem = document.getElementById("playlist_image");
   var temp_arr = [];
   elem.innerHTML = "<img class ='image_size' src='image/image.jpg'>";
   elem = document.getElementById("playlist_name");
   elem.innerHTML = tag+" (Auto Generated)";
   $("#rename_playlist").empty();
   $("#delete_playlist").empty();
   var element = document.getElementById("share_checkbox");
   element.style.display = 'none';  
   $("#playlist_songs tr").remove();
   for(var song=0;song<data.length;song++)
   {
      //var song = data[i].song[0];
      temp_arr.push(data[song]);
      //console.log(data[song]);
      var table = document.getElementById("playlist_songs");
      var row=table.insertRow(table.rows.length);

      var cell1=row.insertCell(0);
      var song_json=JSON.stringify(data[song]);
      cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

      cell1=row.insertCell(1);
      cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false'>"+data[song].title+"</a>";

      cell1=row.insertCell(2);
      var pass = JSON.stringify("load_album('/album/"+data[song].album+"'); return false;");
      cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+data[song].album+"</a>";

      cell1=row.insertCell(3);
      for(var j=0;j<data[song].artist.length;j++){
         cell1.innerHTML += "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+data[song].artist[j])+");return false;'>"+data[song].artist[j]+" </a>";
      }

      cell1=row.insertCell(4);
      cell1.innerHTML = data[song].length;

      cell1=row.insertCell(5);
      cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

   }
   elem = document.getElementById("play_playlist");
   elem.innerHTML = " <a href='' onclick='play_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Play </a>";
   elem = document.getElementById("add_to_queue_playlist");
   elem.innerHTML = " <a href='' onclick='add_to_queue_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Add To Queue </a>";

   $('.nav-stacked a[href="#playlist_single"]').tab('show');
   //return false;
}
function play_psong(data,tag,check,pid){
   //console.log('tagging');
   //console.log(data);
   var elem = document.getElementById("playlist_image");
   var temp_arr = [];
   elem.innerHTML = "<img class ='image_size' src='image/image.jpg'>";
   elem = document.getElementById("playlist_name");
   //elem.innerHTML = capitalizeFirstLetter(tag);
   elem.innerHTML = tag;
   if(loggedin&&!pub_priv){
      elem = document.getElementById("rename_playlist");
      elem.innerHTML = " <a href=''> <span class='glyphicon glyphicon-play'></span> Rename Playlist </a>";
      elem = document.getElementById("delete_playlist");
      elem.innerHTML = " <a onclick='delete_playlist_confirm();return false;'> <span class='glyphicon glyphicon-play'></span> Delete Playlist </a>";
      var element = document.getElementById("share_checkbox");
      element.style.display = 'inline-block';  
      if(check)
         $('input[name="my-checkbox"]').bootstrapSwitch('state', true, true);
      else
         $('input[name="my-checkbox"]').bootstrapSwitch('state', false, true);
   }
   else{
      $("#rename_playlist").empty();
      $("#delete_playlist").empty();
      var element = document.getElementById("share_checkbox");
      element.style.display = 'none';  
   }
   $("#playlist_songs tr").remove();
   rating_playlist(pid);
   for(var song=0;song<data.length;song++)
   {
      //var song = data[i].song[0];
      temp_arr.push(data[song]);
      //console.log(data[song]);
      var table = document.getElementById("playlist_songs");
      var row=table.insertRow(table.rows.length);

      var cell1=row.insertCell(0);
      var song_json=JSON.stringify(data[song]);
      cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

      cell1=row.insertCell(1);
      cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false'>"+data[song].title+"</a>";

      cell1=row.insertCell(2);
      var pass = JSON.stringify("load_album('/album/"+data[song].album+"'); return false;");
      cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+data[song].album+"</a>";

      cell1=row.insertCell(3);
      for(var j=0;j<data[song].artist.length;j++){
         cell1.innerHTML += "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+data[song].artist[j])+");return false;'>"+data[song].artist[j]+" </a>";
      }

      cell1=row.insertCell(4);
      cell1.innerHTML = data[song].length;

      cell1=row.insertCell(5);
      cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

      cell1=row.insertCell(6);
      cell1.innerHTML = "<a href='' onclick='remove_from_playlist("+song_json+",this); return false;'>  <span class='glyphicon glyphicon-remove'> </span> </a>";


   }
   elem = document.getElementById("play_playlist");
   elem.innerHTML = " <a href='' onclick='play_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Play </a>";
   elem = document.getElementById("add_to_queue_playlist");
   elem.innerHTML = " <a href='' onclick='add_to_queue_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Add To Queue </a>";

   $('.nav-stacked a[href="#playlist_single"]').tab('show');
   //return false;
}


function delete_playlist_confirm(){
   var name=$("#playlist_name").html();
   console.log(name);
   if(confirm('Once deleted the playlist cannot be recovered . Are you sure you want to proceed? ')){
      $.ajax({
         type:"GET",
         url:"/playlist/",
         data:{flag:'delete',name:name},
         success:function(){
            $.notify("Playlist Removed "+name, {
               animate: {
                  enter: 'animated fadeInRight',
                  exit: 'animated fadeOutRight'
               },
               newest_on_top: false,
               delay: 100,
            });
         }
      });
   }
}

function rating_playlist(pid){
   // target element
   //alert("rated_it");
   var txt = document.getElementById("rating_status"); 
   var el = document.querySelector('#el');

   txt.innerHTML="Rate it...";
   el.innerHTML="";
   // current rating, or initial rating
   var currentRating = 1;

   // max rating, i.e. number of stars you want
   var maxRating= 5;

   // callback to run after setting the rating
   var callback = function(rating) { 
      alert(rating); 
      $.ajax({
         url:'/rate_playlist/',
         data:{flag:'rate',pid:pid,rating:rating},
         cache:false,
         success:function(){
            txt.innerHTML="You Rated it ....";
            myRating.setRating(rating,false);
         }
      });
   };

   // rating instance
   var myRating = rating(el, currentRating, maxRating, callback);
   check_rated(pid,txt,myRating);

}
function check_rated(pid,txt,myRating){
   $.ajax({
      url:'/rate_playlist/',
      data:{flag:'get',pid:pid},
      cache:false,
      success:function(data){
         //console.log(data[1].rating);
         //console.log(data[0].flag);
         //console.log(data[1].flag);
         if(data[0].flag){
            txt.innerHTML="You Rated it ....";
            myRating.setRating(data[1].rating,false);
         }
      }
   });
}
