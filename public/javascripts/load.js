var flag_album_english=true;
var flag_album_hindi=true;
var flag_album_telugu=true;
var flag_artist=true;
var flag_song=true;
var mySongId;
var album_data,artist_data,song_data,songs_all;
function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

function load_slick_album()
{
   var url="/users/album";
   $.get(url, function(data, status){
      var result = data[0];
      var y = JSON.stringify('this.src="/image/image.jpg"');
      for (var i=0;i<20 && i<result.length;i++)
      {
         var x = "<a href='' class='album_click' onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;'> <div class='slick_image'> <img class='image_size' onError='this.onerror=null;this.src=\"image/image.jpg\";' src='"+result[i].album_art+"'> </img> <div class='song_name'> "+result[i].album+" </div> </div> </a>";
         $('.album_slick').slick('slickAdd',x);
      }
   });

   return false;
}


function load_slick_song()
{
   var url="/users/songs";

   $.get(url, function(data, status){

      var songs = data[0];
      var y = JSON.stringify("this.src='/image/image.jpg'");
      for (var i=0;i<20 && i<songs.length;i++)
      {
         var song_json = JSON.stringify(songs[i]);
         var x = "<a href='' class='album_click' onclick='play1("+song_json+"); return false;'> <div class='slick_image'> <img class='image_size' onError='this.onerror=null;this.src=\"image/image.jpg\";' src='"+songs[i].album_art_small+"'> </img> <div class='song_name'> "+songs[i].title+" </div> </div> </a>";
         $('.song_slick').slick('slickAdd',x);
      }
   });
   return false;

}


function load_more_album1(url)
{
   var lang=url.substr(13,url.length-13);
   if(flag_album_english){
      $.get(url, function(data, status){
         var result = data[0];
         album_data_english = result;
         flag_album_english = false;
         var elem = document.getElementsByClassName("albums_all_"+lang)[0];
         var count = document.getElementsByClassName("album_"+lang).length;
         var x = JSON.stringify("this.src='/image/image.jpg'");
         for (var i=count+1;i<count+31 && i<result.length;i++)
         {
            elem.innerHTML += "<a href='' onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;' > <div title='"+result[i].album+"' class='album album_"+lang+" col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='"+result[i].album_art+"'> </img> </div> <div class='ellip_name'> "+result[i].album+" </div> </div> </a> ";
         }
      });
   }
   else{
      //alert('no get request');
      var result = album_data_english;
      var elem = document.getElementsByClassName("albums_all_"+lang)[0];
      var count = document.getElementsByClassName("album_"+lang).length;
      var x = JSON.stringify("this.src='/image/image.jpg'");
      for (var i=count+1;i<count+31 && i<result.length;i++)
      {
         elem.innerHTML += "<a href='' onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;' > <div title='"+result[i].album+"' class='album album_"+lang+" col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='"+result[i].album_art+"'> </img> </div> <div class='ellip_name'> "+result[i].album+"</div> </div> </a>";
      }
   }
   return false;
}
function load_more_album2(url)
{
   var lang=url.substr(13,url.length-13);
   if(flag_album_hindi){
      $.get(url, function(data, status){
         var result = data[0];
         album_data_hindi = result;
         flag_album_hindi = false;
         var elem = document.getElementsByClassName("albums_all_"+lang)[0];
         var count = document.getElementsByClassName("album_"+lang).length;
         var x = JSON.stringify("this.src='/image/image.jpg'");
         for (var i=count+1;i<count+31 && i<result.length;i++)
         {
            elem.innerHTML += "<a href='' onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;' > <div title='"+result[i].album+"' class='album album_"+lang+" col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='"+result[i].album_art+"'> </img> </div> <div class='ellip_name'> "+result[i].album+" </div> </div> </a> ";
         }
      });
   }
   else{
      //alert('no get request');
      var result = album_data_hindi;
      var elem = document.getElementsByClassName("albums_all_"+lang)[0];
      var count = document.getElementsByClassName("album_"+lang).length;
      var x = JSON.stringify("this.src='/image/image.jpg'");
      for (var i=count+1;i<count+31 && i<result.length;i++)
      {
         elem.innerHTML += "<a href='' onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;' > <div title='"+result[i].album+"' class='album album_"+lang+" col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='"+result[i].album_art+"'> </img> </div> <div class='ellip_name'> "+result[i].album+" </div> </div> </a> ";
      }
   }
   return false;
}
function load_more_album3(url)
{
   var lang=url.substr(13,url.length-13);
   if(flag_album_telugu){
      $.get(url, function(data, status){
         var result = data[0];
         album_data_telugu = result;
         flag_album_telugu = false;
         var elem = document.getElementsByClassName("albums_all_"+lang)[0];
         var count = document.getElementsByClassName("album_"+lang).length;
         var x = JSON.stringify("this.src='/image/image.jpg'");
         for (var i=count+1;i<count+31 && i<result.length;i++)
         {
            elem.innerHTML += "<a href='' onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;' > <div title='"+result[i].album+"' class='album album_"+lang+" col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='"+result[i].album_art+"'> </img> </div> <div class='ellip_name'> "+result[i].album+" </div> </div> </a> ";
         }
      });
   }
   else{
      //alert('no get request');
      var result = album_data_telugu;
      var elem = document.getElementsByClassName("albums_all_"+lang)[0];
      var count = document.getElementsByClassName("album_"+lang).length;
      var x = JSON.stringify("this.src='/image/image.jpg'");
      for (var i=count+1;i<count+31 && i<result.length;i++)
      {
         elem.innerHTML += "<a href='' onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;' >  <div title='"+result[i].album+"' class='album album_"+lang+" col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='"+result[i].album_art+"'> </img> </div> <div class='ellip_name'> "+result[i].album+" </div> </div> </a> ";
      }
   }
   return false;
}



function load_more_artist()
{
   var url="/users/artists";

   if(flag_artist){
      $.get(url, function(data, status){
         var artist = data[0];
         flag_artist = false;
         artist_data = artist;
         var elem = document.getElementsByClassName("artists_all")[0];
         var count = document.getElementsByClassName("song").length;
         var x = JSON.stringify("this.src='/image/image.jpg'");
         for (var i=count+1;i<count+31 && i<artist.length;i++)
         {
            elem.innerHTML += "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+artist[i])+"); return false;' > <div title = '"+artist[i]+"' class='song col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='/image/image.jpg'> </img> </div> <div class='ellip_name'>  "+artist[i]+" </div> </div> </a> ";
         }
      });
   }
   else{
      var artist = artist_data;
      var elem = document.getElementsByClassName("artists_all")[0];
      var count = document.getElementsByClassName("song").length;
      var x = JSON.stringify("this.src='/image/image.jpg'");
      for (var i=count+1;i<count+31 && i<artist.length;i++)
      {
         elem.innerHTML += "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+artist[i])+"); return false;' > <div title = '"+artist[i]+"' class='song col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='/image/image.jpg'> </img> </div> <div class='ellip_name'>  "+artist[i]+" </div> </div> </a> ";
      }
   }

   return false;
}

function load_more_song()
{
   var url="/users/songs";

   if(flag_song){
      $.get(url, function(data, status){

         var alpha = document.getElementById("alphabet_songs");
         var arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
         for(var i=0;i<26;i++)
         {
            var x = JSON.stringify(arr[i]);
            alpha.innerHTML += "<a href='' class='filter_letter' onclick='filter_char("+x+"); return false;' >"+arr[i]+"</a> ";
         }
         var x =  JSON.stringify("all");
         alpha.innerHTML += "<a href='' class='filter_letter' onclick='filter_char("+x+"); return false;' > All </a> ";
         flag_song = false;
         var songs = data[0];
         song_data = songs;
         songs_all = songs;
         var table = document.getElementById("table_songs");
         var count = table.rows.length;
         for (var i=count;i<count+20 && i<songs.length;i++)
         {
            var row=table.insertRow(table.rows.length);
            var song = songs[i];

            var cell1=row.insertCell(0);
            var song_json = JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

            cell1=row.insertCell(1);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

            cell1=row.insertCell(2);
            var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
            cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

            cell1=row.insertCell(3);
            cell1.innerHTML = "";
            for (var j=0;j< song.artist.length;j++)
            {
               cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
            }

            cell1=row.insertCell(4);
            cell1.innerHTML = song.length;

            cell1=row.insertCell(5);
            cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';

            cell1=row.insertCell(6);
            cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';
            cell1=row.insertCell(7);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

         }
         var x =  JSON.stringify("hindi");
         alpha.innerHTML += "<a href='' class='filter_letter' onclick='filter_char("+x+"); return false;' > Hindi </a> ";
         flag_song = false;
         var songs = data[0];
         song_data = songs;
         songs_all = songs;
         var table = document.getElementById("table_songs");
         var count = table.rows.length;
         for (var i=count;i<count+20 && i<songs.length;i++)
         {
            var row=table.insertRow(table.rows.length);
            var song = songs[i];

            var cell1=row.insertCell(0);
            var song_json = JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

            cell1=row.insertCell(1);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

            cell1=row.insertCell(2);
            var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
            cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

            cell1=row.insertCell(3);
            cell1.innerHTML = "";
            for (var j=0;j< song.artist.length;j++)
            {
               cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
            }

            cell1=row.insertCell(4);
            cell1.innerHTML = song.length;

            cell1=row.insertCell(5);
            cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
            cell1=row.insertCell(6);
            cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

            cell1=row.insertCell(7);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

         }
         var x =  JSON.stringify("english");
         alpha.innerHTML += "<a href='' class='filter_letter' onclick='filter_char("+x+"); return false;' > English </a> ";
         flag_song = false;
         var songs = data[0];
         song_data = songs;
         songs_all = songs;
         var table = document.getElementById("table_songs");
         var count = table.rows.length;
         for (var i=count;i<count+20 && i<songs.length;i++)
         {
            var row=table.insertRow(table.rows.length);
            var song = songs[i];

            var cell1=row.insertCell(0);
            var song_json = JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

            cell1=row.insertCell(1);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

            cell1=row.insertCell(2);
            var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
            cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

            cell1=row.insertCell(3);
            cell1.innerHTML = "";
            for (var j=0;j< song.artist.length;j++)
            {
               cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
            }

            cell1=row.insertCell(4);
            cell1.innerHTML = song.length;

            cell1=row.insertCell(5);
            cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
            cell1=row.insertCell(6);
            cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

            cell1=row.insertCell(7);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

         }
         var x =  JSON.stringify("telugu");
         alpha.innerHTML += "<a href='' class='filter_letter' onclick='filter_char("+x+"); return false;' > Telugu </a> ";
         flag_song = false;
         var songs = data[0];
         song_data = songs;
         songs_all = songs;
         var table = document.getElementById("table_songs");
         var count = table.rows.length;
         for (var i=count;i<count+20 && i<songs.length;i++)
         {
            var row=table.insertRow(table.rows.length);
            var song = songs[i];

            var cell1=row.insertCell(0);
            var song_json = JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

            cell1=row.insertCell(1);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

            cell1=row.insertCell(2);
            var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
            cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

            cell1=row.insertCell(3);
            cell1.innerHTML = "";
            for (var j=0;j< song.artist.length;j++)
            {
               cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
            }

            cell1=row.insertCell(4);
            cell1.innerHTML = song.length;

            cell1=row.insertCell(5);
            cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
            cell1=row.insertCell(6);
            cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

            cell1=row.insertCell(7);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

         }
         var x =  JSON.stringify("random");
         alpha.innerHTML += "<a href='' class='filter_letter' onclick='filter_char("+x+"); return false;' > Random </a> ";
         flag_song = false;
         var songs = data[0];
         song_data = songs;
         songs_all = songs;
         var table = document.getElementById("table_songs");
         var count = table.rows.length;
         for (var i=count;i<count+20 && i<songs.length;i++)
         {
            var row=table.insertRow(table.rows.length);
            var song = songs[i];

            var cell1=row.insertCell(0);
            var song_json = JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

            cell1=row.insertCell(1);
            cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

            cell1=row.insertCell(2);
            var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
            cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

            cell1=row.insertCell(3);
            cell1.innerHTML = "";
            for (var j=0;j< song.artist.length;j++)
            {
               cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
            }

            cell1=row.insertCell(4);
            cell1.innerHTML = song.length;

            cell1=row.insertCell(5);
            cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
            cell1=row.insertCell(6);
            cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

            cell1=row.insertCell(7);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

         }
      });
   }
   else{
      var songs = songs_all;
      var table = document.getElementById("table_songs");
      var count = table.rows.length;
      for (var i=count;i<count+20 && i<songs.length;i++)
      {
         var row=table.insertRow(table.rows.length);
         var song = songs[i];

         var cell1=row.insertCell(0);
         var song_json = JSON.stringify(song);
         cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

         cell1=row.insertCell(1);
         cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

         cell1=row.insertCell(2);
         var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
         cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

         cell1=row.insertCell(3);
         cell1.innerHTML = "";
         for (var j=0;j< song.artist.length;j++)
         {
            cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
         }

         cell1=row.insertCell(4);
         cell1.innerHTML = song.length;

         cell1=row.insertCell(5);
         cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
         cell1=row.insertCell(6);
         cell1.innerHTML = '<a  title="Add to Playlist "href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

         cell1=row.insertCell(7);
         cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

      }
   }

   return false;
}

function tag_lang(data,lang,tag){
   //console.log('tagging');
   //console.log(data);
   var elem = document.getElementById("tag_single_image_"+lang);
   var temp_arr = [];
   elem.innerHTML = "<img class ='image_size' src='image/image.jpg'>";
   elem = document.getElementById("tag_single_name_"+lang);
   elem.innerHTML = capitalizeFirstLetter(tag);
   $("#tag_single_songs_"+lang+" tr").remove();
   for(var song=0;song<data.length;song++)
   {
      //var song = data[i].song[0];
      temp_arr.push(data[song]);
      //console.log(data[song]);
      var table = document.getElementById("tag_single_songs_"+lang);
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
      cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+data[song]._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';
      cell1=row.insertCell(6);
      //var song_json = JSON.stringify(song);
      cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

   }
   elem = document.getElementById("play_tag_"+lang);
   elem.innerHTML = " <a href='' onclick='play_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Play </a>";
   elem = document.getElementById("add_to_queue_tag_"+lang);
   elem.innerHTML = " <a href='' onclick='add_to_queue_album("+JSON.stringify(temp_arr)+"); return false;'> <span class='glyphicon glyphicon-play'></span> Add To Queue </a>";

   $('.nav-stacked a[href="#tags_single"]').tab('show');

}

function load_tag_songs(tag){

   var url="/tags/song";

   $.ajax({
      type: "GET",
      data: {tag:tag},
      url: url,
      success: function (data,status) {
         var data_hindi=[];
         var data_english=[];
         var data_telugu=[];
         for(var i in data){
            var song = data[i].song[0];
            if(song.language == "english")
               data_english.push(song);
            else if(song.language == "hindi")
               data_hindi.push(song);
            else{
               //console.log(song);
               data_telugu.push(song);
            }
         }
         tag_lang(data_english,"english",tag);
         tag_lang(data_hindi,"hindi",tag);
         tag_lang(data_telugu,"telugu",tag);
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

function load_tags()
{
   var url="/tags/get";
   //console.log("Loading");
   $("#tags").empty();
   $.get(url, function(data, status) {
      var elem = document.getElementById("tags");
      var x = JSON.stringify('/image/image.jpg');
      for(var i=0;i<data.length;i++)
      {
         elem.innerHTML += "<a href='' onclick='load_tag_songs("+JSON.stringify(data[i])+"); return false;' > <div class='album tags col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='/image/image.jpg'> </img> </div> <div class='ellip_name'> "+capitalizeFirstLetter(data[i])+" </div> </div>  </a>";
      }
   });
   return false;
}

function filter_char(letter)
{
   if(letter=="all")
   {
      var songs = song_data;
      songs_all = songs;
      var table = document.getElementById("table_songs");
      $("#table_songs tr").remove();
      for (var i=0;i<20 && i<songs.length;i++)
      {
         var row=table.insertRow(table.rows.length);
         var song = songs[i];
         var cell1=row.insertCell(0);
         var song_json = JSON.stringify(song);
         cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

         cell1=row.insertCell(1);
         cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

         cell1=row.insertCell(2);
         var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
         cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

         cell1=row.insertCell(3);
         cell1.innerHTML = "";

         for (var j=0;j<song.artist.length;j++)
         {
            cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
         }

         cell1=row.insertCell(4);
         cell1.innerHTML = song.length;

         cell1=row.insertCell(5);
         cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
         cell1=row.insertCell(6);
         cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

         cell1=row.insertCell(7);
         cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";
      }
      check_song_song();

      return;
   }
   if(letter=="hindi" || letter == "english" || letter == "telugu")
   {
      var filter = $.grep(song_data, function(item) {
         return item.language === letter;
      });
      var songs = filter;
      songs_all = songs;
      var table = document.getElementById("table_songs");
      $("#table_songs tr").remove();
      for (var i=0;i<20 && i<songs.length;i++)
      {
         var row=table.insertRow(table.rows.length);
         var song = songs[i];
         var cell1=row.insertCell(0);
         var song_json = JSON.stringify(song);
         cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

         cell1=row.insertCell(1);
         cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

         cell1=row.insertCell(2);
         var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
         cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

         cell1=row.insertCell(3);
         cell1.innerHTML = "";

         for (var j=0;j<song.artist.length;j++)
         {
            cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
         }

         cell1=row.insertCell(4);
         cell1.innerHTML = song.length;

         cell1=row.insertCell(5);
         cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
         cell1=row.insertCell(6);
         cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

         cell1=row.insertCell(7);
         cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";
      }
      check_song_song();

      return;
   }
   if(letter=="random")
   {
      var url="/users/songs";
      $.ajax({
         type:"GET",
         url:url,
         data:{flag:'random'},
         success:function(data){
            filter = data[0];
            //console.log("data  ",filter);
            var songs = filter;
            songs_all = songs;
            var table = document.getElementById("table_songs");
            $("#table_songs tr").remove();
            //console.log("adsasdasd --->",songs.length);
            for (var i=0;i<20 && i<songs.length;i++)
            {
               var row=table.insertRow(table.rows.length);
               var song = songs[i];
               var cell1=row.insertCell(0);
               var song_json = JSON.stringify(song);
               cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

               cell1=row.insertCell(1);
               cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

               cell1=row.insertCell(2);
               var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
               cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

               cell1=row.insertCell(3);
               cell1.innerHTML = "";

               for (var j=0;j<song.artist.length;j++)
               {
                  cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
               }

               cell1=row.insertCell(4);
               cell1.innerHTML = song.length;

               cell1=row.insertCell(5);
               cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
               cell1=row.insertCell(7);
               cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

               cell1=row.insertCell(6);
               cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";
            }
            check_song_song();
         }
      });
      return;
   }
   var filter = $.grep(song_data, function(item) {
      return item.title[0] === letter;
   });
   var songs = filter;
   songs_all = songs;
   var table = document.getElementById("table_songs");
   $("#table_songs tr").remove();
   for (var i=0;i<20 && i<songs.length;i++)
   {
      var row=table.insertRow(table.rows.length);
      var song = songs[i];
      var cell1=row.insertCell(0);
      var song_json = JSON.stringify(song);
      cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

      cell1=row.insertCell(1);
      cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+song.title+"</a>";

      cell1=row.insertCell(2);
      var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
      cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+song.album+"</a>";

      cell1=row.insertCell(3);
      cell1.innerHTML = "";

      for (var j=0;j<song.artist.length;j++)
      {
         cell1.innerHTML += " <a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist[j])+"); return false;'>"+song.artist[j]+"</a> ";
      }

      cell1=row.insertCell(4);
      cell1.innerHTML = song.length;

      cell1=row.insertCell(5);
      cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
      cell1=row.insertCell(6);
      cell1.innerHTML = '<a title="Add to Playlist" href="" class="add_playlist" data-id1="'+song._id+'" data-toggle="modal" data-target="#myPlaylist"><span class="glyphicon glyphicon-list"></span></a>';

      cell1=row.insertCell(7);
      cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";
   }
   check_song_song();
}



function check_song_song()
{
   var song_table = document.getElementById("table_songs");
   var now_playing = document.getElementById('table_now_playing');
   var i=0;
   $('#songs table tr').each(function(){
      var song_name = $(song_table.rows[i].cells[1]).text();
      //console.log(song_name);
      var j=0,flag=0;
      $('#now_playing table tr').each(function(){
         var now_playing_song_name = $(now_playing.rows[j].cells[1]).text();
         //console.log(now_playing_song_name);
         //console.log(song_name+ " " +now_playing_song_name);
         if(song_name == now_playing_song_name){
            flag=1;
            return false;
         }
         j++;
      });
      if(flag==1)
         $(this).addClass('success');
      else
         $(this).removeClass('success');

      i++;
   });
   return false;
}
$(document).on("click", ".add_playlist", function () {
   $("#modal_playlist_input").css("display","none")
   mySongId = $(this).data('id1');
   //alert(myBookId);
   elem=document.getElementById("get_playlist");
   $.ajax({
      type:'get',
      url:'/playlist/new?flag=userlist',
      cache:false,
      success:function(data){
         console.log(data);
         var html;
         if(data == 0){
            //console.log('heyyy');
            if(loggedin)
               html='<p>You dont have any playlist</p>';
            else
               html='<p>Please login to create playlist</p>';

         }
         else{
            html = '<ul id="play_content">';
            for(var key in data){
               html+='<a class="list-group-item"  href="" onclick="send_single_song(\''+data[key].name+'\');return false;">'+data[key].name+'</a>';
               //html+='<li class="play_list"  onclick="send_single_song(\''+data[key].name,mySongId+'\');return false;">'+data[key].name+'</li>';
            }
            html+='</ul>';
         }
         elem.innerHTML=html;
      }
   });
});
function send_single_song(name){
   var song_arr=[];
   var url="/playlist/new/";
   song_arr.push(mySongId);
   $.ajax({
      type: "POST",
      data: {flag:'insert',song:song_arr,pname:name},
      url: url,
      success:function(){
         $('#myPlaylist').modal('hide');
         $.notify("Song added to Playlist", {
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
   $("#modal_playlist").click(function(){
      if(loggedin)
         $("#modal_playlist_input").css("display","block")
      else{
         alert('Please SignUp to create exciting Playlist :P');
         $('#myPlaylist').modal('hide');
      }
   });
   $("#modal_close").click(function(){
      $("#modal_playlist_input").css("display","none")
   });
   $("#submit_new_playlist").click(function(){
      if(loggedin){
         var pname=$("#modal_playlist_input").val();
         $.ajax({
            type: 'get',
            url: '/playlist/new/',
            data: {flag:'new',value:pname},
            success: function() {
               $.notify("Playlist created successfully", {
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
      else{
         alert('Please SignUp to create exciting Playlist :P');
      }

   });
});
