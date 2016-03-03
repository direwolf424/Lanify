function load_user_playlist()
{
   //alert('hello');
   var url="/playlist/get";
   console.log("Loading");
   $.get(url, function(data, status) {
      var elem = document.getElementById("playlist");
      var x = JSON.stringify('/image/image.jpg');
      for(var i=0;i<data.length;i++)
      {
         elem.innerHTML += "<div class='album tags col-md-5ths'> <a onclick='load_playlist_songs("+JSON.stringify(data[i])+"); return false;' > <div class='song_image'> <img onerror="+x+" src='/image/image.jpg'> </img> </div> <div class='ellip_name'> "+capitalizeFirstLetter(data[i])+" </a> </div> </div> ";
      }
   });
   return false;
}

