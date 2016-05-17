function load_user_playlist()
{
   var url="/playlist/";
   console.log("Loading Playlist");
   $.ajax({
      type:"GET",
      data:{flag:'fetch'},
      url:url,
      success:function(data){
         //alert('hello',data);
         //console.log(data);
         $("#playlist").empty();
         var elem = document.getElementById("playlist");
         var x = JSON.stringify('/image/image.jpg');
         for(var i=0;i<data.length;i++)
         {
            elem.innerHTML += "<a href='' onclick='load_playlist_songs("+JSON.stringify(data[i])+"); return false;' > <div class='album tags col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='/image/image.jpg'> </img> </div> <div class='ellip_name'> "+capitalizeFirstLetter(data[i].name)+" </div> </div>  </a>";
         }
      }
   });
   return false;
}
function load_playlist_songs(play){

   var url="/playlist/";

   $.ajax({
      type: "GET",
      data: {flag:'songs',name:play.name},
      url: url,
      success: function (data,status) {
         console.log(data);
         play_song(data,play.name);
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
function play_song(data,tag){
   //console.log('tagging');
   //console.log(data);
   var elem = document.getElementById("playlist_image");
   var temp_arr = [];
   elem.innerHTML = "<img class ='image_size' src='image/image.jpg'>";
   elem = document.getElementById("playlist_name");
   elem.innerHTML = capitalizeFirstLetter(tag);
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
      //var song_json = JSON.stringify(song);
      cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

   }
   elem = document.getElementById("play_playlist");
   elem.innerHTML = " <a href='' onclick='play_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Play </a>";
   elem = document.getElementById("add_to_queue_playlist");
   elem.innerHTML = " <a href='' onclick='add_to_queue_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Add To Queue </a>";

   $('.nav-stacked a[href="#playlist_single"]').tab('show');

}
