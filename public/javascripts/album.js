/**
 * Created by Saurabh on 30-Jan-16.
 */
function play_album(data) {
   clear_queue();
   for(var i in data)
      {
         song = data[i];
         add_to_queue(song);
      }
      $( ".jp-next" ).click();
      //    player.jPlayer("play", 0);
      //myPlaylist.play();
      return false;
}

function add_to_queue_album(data) {
   for(var i in data)
      {
         song = data[i];
         add_to_queue(song);
      }
      return false;
}


function load_album(url)
{
   $.get(url, function(data, status){
      //        history.pushState(null, null, url);
      var elem = document.getElementById("album_single_image");
      var pass = JSON.stringify(data[0].album_art);
      elem.innerHTML = "<img class ='image_size' onError='this.onerror=null;this.src=\"image/image.jpg\";' src="+pass+">";
      elem = document.getElementById("album_single_name");
      elem.innerHTML = data[0].album;
      elem = document.getElementById("play_album");
      elem.innerHTML = " <a href='' onclick='play_album("+JSON.stringify(data)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Play </a>";
      elem = document.getElementById("add_to_queue_album");
      elem.innerHTML = " <a href='' onclick='add_to_queue_album("+JSON.stringify(data)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Add To Queue </a>";
      $("#album_single_songs tr").remove();
      for(var i in data)
         {
            var song = data[i];
            var table = document.getElementById("album_single_songs");
            var row=table.insertRow(table.rows.length);

            var cell1=row.insertCell(0);
            var song_json=JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

            cell1=row.insertCell(1);
            pass = JSON.stringify("play");
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false'>"+song.title+"</a>";

            cell1=row.insertCell(2);
            for(var j=0;j<song.artist.length;j++){
            cell1.innerHTML += "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+");return false;'>"+song.artist[j]+" </a>";
            }
            cell1=row.insertCell(3);
            //var song_json = JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

         }
         $('.nav-stacked a[href="#album_single"]').tab('show');
   });

   $(window).bind('popstate', function() {
      $.ajax({url:location.pathname+'?rel=tab',success: function(data){
         $('.nav-stacked a[href="#home"]').tab('show');
      }});
   });
}
