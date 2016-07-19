function load_artist(url)
{
   $.get(url, function(data, status){
      //        history.pushState(null, null, url);
      var elem = document.getElementById("artist_single_name");
      var elem_image = document.getElementById("artist_single_image");
      elem_image.innerHTML='<img class="image_size" src="image/image.jpg"></img>';
      elem.innerHTML = data[0];
      elem = document.getElementById("rename_artist");
      elem.innerHTML = " <a href='' onclick=''> <span class='glyphicon glyphicon-play'></span> Rename Artist </a>";

      $("#artist_single_albums_table tr").remove();
      $("#artist_single_songs_table tr").remove();
      var songs = data[1];
      for(var i in songs)
      {
         var song = songs[i];
         var table = document.getElementById("artist_single_songs_table");
         var row=table.insertRow(table.rows.length);

         var cell1=row.insertCell(0);
         var song_json = JSON.stringify(song);
         cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

         var cell1=row.insertCell(1);
         cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

         cell1=row.insertCell(2);
         cell1.innerHTML = "<a href='' onclick='load_album("+JSON.stringify('/album/'+song.album)+"); return false;'>"+song.album+"</a>";

         cell1=row.insertCell(3);
         for(var j=0;j<song.artist.length;j++){
            cell1.innerHTML += "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+" </a>";
         }
         cell1=row.insertCell(4);
         cell1.innerHTML = song.length;

         cell1=row.insertCell(5);
         cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
            cell1=row.insertCell(6);
            cell1.innerHTML = '<a  title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

         cell1=row.insertCell(7);
         cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";


      }
      var albums = data[2];
      var album_arts = data[3];
      elem = document.getElementById("artist_single_albums");
      elem.innerHTML="";
      var x = JSON.stringify("this.src='/image/image.jpg'");
      for(i in albums)
      {
         var album = albums[i];
         var album_art = album_arts[i];
         elem = document.getElementById("artist_single_albums");
         elem.innerHTML += "<a href='' onclick='load_album("+JSON.stringify('/album/'+album)+"); return false;' > <div title='"+album+"' class='album col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='"+album_art+"'> </img> </div> <div class='ellip_name'> "+album+" </div> </div> </a> ";

      }
      $('.nav-stacked a[href="#artist_single"]').tab('show');
   });
   return false;
}
