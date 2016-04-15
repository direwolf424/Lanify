/**
 * Created by Saurabh on 30-Jan-16.
 */
var album_data;
function play_album(data) {
   clear_queue();
   player = $("#jquery_jplayer_1");
   for(var i in data)
      {
         song = data[i];
         add_to_queue(song);
      }
      playlist_index = -1;
      $( ".jp-next" ).click();
      flag_shuffle = false;
      shuffle();
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
      album_data = song;
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
            cell1.innerHTML = song.length;

            cell1=row.insertCell(4);
            cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';

            cell1=row.insertCell(5);
            var y = "<p> <input type='text' name='bookId' class='song_id' value='abc' style='display: none;visibility: hidden;'/> <p> <a href='' onclick='add_to_queue("+song_json+"); return false;'>  Now Playing </a> <p> <a href='' class='new_playlist' onclick='new_playlist(); return false;'> Create New Playlist </a>";
            var x = '<a class="pop_click" data-song='+song._id+' href="" data-placement="left" data-html="true" data-toggle="popover" data-original-title="Add to" > <span class="glyphicon glyphicon-plus"> </span> </a>';
            cell1.innerHTML = x;
            table.rows[i].cells[5].firstElementChild.setAttribute('data-content',y);

         }
         $('.nav-stacked a[href="#album_single"]').tab('show');
         $('[data-toggle="popover"]')
             .on('click',function(e){
                e.preventDefault();
             })
             .popover({html:true});
         check_album_song();
   });

   $(window).bind('popstate', function() {
      $.ajax({url:location.pathname+'?rel=tab',success: function(data){
         $('.nav-stacked a[href="#home"]').tab('show');
      }});
   });
}

function check_album_song()
{
   var album_table = document.getElementById("album_single_songs");
   var now_playing = document.getElementById('table_now_playing');
   var name = document.getElementById("jp-song-name");
   var song_playing = name.innerHTML;
   var i=0;
   $('#album_single table tr').each(function(){
      var song_name = $(album_table.rows[i].cells[1]).text();
      //console.log(song_name);
      var j=0,flag=0;
      $('#now_playing table tr').each(function(){
         var now_playing_song_name = $(now_playing.rows[j].cells[1]).text();
         if(song_name == now_playing_song_name){
            flag=1;
            return false;
         }
         j++;
      });
         if(flag==1)
            $(this).addClass('success');
         i++;
   });
   return false;
}

function album_pause(elem,song)
{
   player = $("#jquery_jplayer_1");
   player.jPlayer("pause");
   var table = document.getElementById('album_single_songs');
   var i = elem.parentNode.parentNode.rowIndex;
   var cell1 = table.rows[i].cells[0];
   var play = table.rows[i].cells[1].firstElementChild.getAttribute('onclick');
   cell1.innerHTML = "<a href='' onclick='"+play+"'>  <span class='glyphicon glyphicon-play'> </span> </a>";
   return false;
}


function new_playlist()
{
   var c = document.getElementsByClassName('popover-content')[0];
   c.childNodes[2].innerHTML = "<p> <input type='text' id='playlist_name'> </input> <a href='' onclick='add_to_new_playlist(this); return false;'> <span class='glyphicon glyphicon-ok'> </span> </a> ";
}

function add_to_new_playlist() {
   var x = document.getElementById('playlist_name');
   var name = x.value;
   var c = document.getElementsByClassName('popover-content')[0];
   var song = c.childNodes[0].childNodes[1].getAttribute('value');
   var url="/playlist/";
   $.ajax({
      type: "GET",
      data: {name:name,song:song},
      url: url
   });
}

$(document).on("click", ".pop_click", function () {
   var song = $(this).data('song');
   setTimeout(function()  {
      var c = document.getElementsByClassName('popover-content')[0];
      c.childNodes[0].childNodes[1].setAttribute('value',song);
   },100);
});

