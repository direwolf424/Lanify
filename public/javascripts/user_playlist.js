var current_name;
var pub_priv;

/*
 This function removes song from playlist.
 */
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

   /*
    This function is called when the user changes the rating for any playlist.
    */
   $('#playlist_rating').on('rating.change', function(event, value) {
      rate_playlist(value);
   });

   $(".rating-xs").css("fontSize", 20);

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

/*
 This function loads all the public playlist.
 */
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

/*
 This function builds the playlist.
 */
function buildPlaylistItem(data,playlist) {
   var playlistItem = document.createElement('div');
   if(data.rating_count == null)
      data.rating_count =0;

   var html = "<a href='' onclick='load_playlist_songs("+JSON.stringify(data)+"); return false;' > <div class='album tags col-md-5ths'> <div class='song_image'> <img src='/image/image.jpg'> </img> </div> <div class='ellip_name'> "+capitalizeFirstLetter(data.name)+" </div><div class='ellip_name'>By "+data.user_name+" </div></a><div class='star-rating'></div><div class='rating_count'>("+data.rating_count+")<div></div>";
   playlistItem.innerHTML = html;
   playlist.appendChild(playlistItem);

   return playlistItem;
}

/*
 This function adds rating widget for all the playlist.
 */
function addRatingWidget(playlistItem, data) {
   var ratingElement = playlistItem.querySelector('.star-rating');
   var currentRating = Math.floor(data.rating/data.rating_count);
   if(currentRating == null)
      currentRating = 1;
   $(ratingElement).rating({showCaption:false, showClear: false, step: 1, size:'xxs', displayOnly: true});
   $(ratingElement).rating('update', currentRating);
}

/*
 This function loads all the private playlist.
 */
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

/*
 This function gets the songs for a playlist.
 */
function load_playlist_songs(play){

   var url="/playlist/";
   console.log(play);

   $.ajax({
      type: "GET",
      data: {flag:'songs',id:play._id},
      url: url,
      success: function (data,status) {
         //console.log(data);
         //console.log('hello world');
         current_name = play.name;
         var currentRating = Math.floor(play.rating/play.rating_count);
         play_psong(data,play.name,play.shared,play._id,currentRating);
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

/*
 This function loads the auto generated playlist.
 */
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

/*
 This function populates the song table for an automatically generated playlist.
 */
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
   var rating = document.getElementById("playlist_rating");
   rating.style.display = 'none';
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

/*
 This function populates the song table for a playlist.
 */
function play_psong(data,tag,check,pid,currentRating){
   var elem = document.getElementById("playlist_image");
   $("#playlist_id").val(pid);
   var temp_arr = [];
   elem.innerHTML = "<img class ='image_size' src='image/image.jpg'>";
   elem = document.getElementById("playlist_name");
   elem.innerHTML = capitalizeFirstLetter(tag);
   //elem.innerHTML = tag;
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
   show_playlist_rating();
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

      //Do not add remove button for songs in public playlist
      if(!pub_priv)
      {
         cell1=row.insertCell(6);
         cell1.innerHTML = "<a href='' onclick='remove_from_playlist("+song_json+",this); return false;'>  <span class='glyphicon glyphicon-remove'> </span> </a>";
      }
   }
   elem = document.getElementById("play_playlist");
   elem.innerHTML = " <a href='' onclick='play_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Play </a>";
   elem = document.getElementById("add_to_queue_playlist");
   elem.innerHTML = " <a href='' onclick='add_to_queue_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Add To Queue </a>";

   $('.nav-stacked a[href="#playlist_single"]').tab('show');
   //return false;
}


/*
 This function deletes the playlist.
 */
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

/*
This function initialises rating widget for a playlist. Rating is set to zero initially.
*/
function show_playlist_rating(){
   var playlist_rating = document.querySelector('#playlist_rating');
   var rating_status = document.getElementById("rating_status");
   rating_status.innerHTML="Rate it...";
   playlist_rating.innerHTML="";
   $(playlist_rating).rating({showCaption:false, showClear: false, step: 1, size:'xxs'});
   $(playlist_rating).rating('update', 0);
   if(loggedin==false)
   {
      rating_status.innerHTML="Login to rate the playlist";
      $(playlist_rating).rating('refresh', {displayOnly: true});
   }
   check_rated();
}

/*
 This function rates the playlist whenever user clicks on rating widget and changes the rating.
*/
function rate_playlist(rating){

   var txt = document.getElementById("rating_status");
   var pid = document.getElementById('playlist_id').value;
   if(loggedin){
      $.ajax({
         url:'/rate_playlist/',
         data:{flag:'rate',pid:pid,rating:rating},
         cache:false,
         success:function(){
            txt.innerHTML="You Rated it ....";
         }
      });
   }
}

/*
 This function checks whether the user has rated the playlist or not and displays that rating.
 */
function check_rated(){
   var playlist_rating = document.querySelector('#playlist_rating');
   var rating_status = document.getElementById("rating_status");
   var playlist_id = document.getElementById('playlist_id').value;
   $.ajax({
      url:'/rate_playlist/',
      data:{flag:'get',pid:playlist_id},
      cache:false,
      success:function(data){
         if(data[0].flag){
            rating_status.innerHTML="You Rated it ....";
            $(playlist_rating).rating('update', data[1].rating);
         }
      }
   });
}
