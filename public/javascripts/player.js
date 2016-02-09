/**
 * Created by Saurabh on 30-Jan-16.
 */
var myPlaylist;
var player;


function remove_song(element){
   var index = element.parentNode.parentNode.rowIndex;
   myPlaylist.remove(index);
   var table = document.getElementById('table_now_playing');
   var title = table.rows[index].cells[1].textContent;
   table.deleteRow(index);
   var current_queue = [];
   if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./scratch');
   }
   if(localStorage.getItem("queue")==null)
      {
         current_queue = [];
      }
      else
         {
            current_queue= JSON.parse(localStorage["queue"]);
            for(var i in current_queue)
               {
                  var song = current_queue[i];
                  if(song.title == title)
                     {
                        current_queue.splice(i, 1);
                        break;
                     }
               }
         }
         localStorage.setItem('queue', JSON.stringify(current_queue));
         //    load_playlist();
         return false;
}

function play(loc,title,artist,album){

   player = $("#jquery_jplayer_1");
   $("#jquery_jplayer_1").jPlayer({
      ready: function () {
         $(this).jPlayer("setMedia", {
            title: "Bubble",
            mp3: loc,
         });
      },
      swfPath: "/javascripts",
      cssSelectorAncestor: "#jp_container_1",
      supplied: "mp3",
      useStateClassSkin: true,
      autoBlur: false,
      smoothPlayBar: true,
      keyEnabled: true,
      remainingDuration: true,
      toggleDuration: true,
   });

   var index;
   var current_queue = [];
   var flag = true;
   if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./scratch');
   }
   if(localStorage.getItem("queue")==null)
      {
         current_queue = [];
      }
      else
         {
            current_queue= JSON.parse(localStorage["queue"]);
            for(var i in current_queue)
               {
                  play_song = current_queue[i];
                  //                console.log(play_song);
                  if(play_song.title == title)
                     {
                        index=i;
                        //                alert("adding again play");
                        flag = false;
                        current_queue.splice(i, 1);
                        break;
                     }
               }
         }
         if(!flag)
            {
               myPlaylist.play();
               player.jPlayer("setMedia", {
                  mp3: loc
               });
               player.jPlayer("play", index);
            }
            else
               {
                  var song = {
                     title:title,
                     artist:artist,
                     path:loc,
                     album:album
                  };
                  current_queue.push(song);
                  localStorage.setItem('queue', JSON.stringify(current_queue));
                  myPlaylist.add(
                     {
                        title:title,
                        artist:artist,
                        mp3:loc
                     }
                  );
                  myPlaylist.play();
                  player.jPlayer("setMedia", {
                     mp3: loc
                  });
                  player.jPlayer("play", 0);
                  now_playing(loc,title,artist,album,1);
               }
               var name = document.getElementById("jp-song-name");
               name.innerHTML = title;
               highlight(title);
               return false;
}
$(document).ready(function() {

   myPlaylist = new jPlayerPlaylist({
      jPlayer: "#jquery_jplayer_1",
      cssSelectorAncestor: "#jp_container_1"
   }, [], {
      playlistOptions: {
         enableRemoveControls: true
      },
      //        swfPath: "/javascripts",
      supplied: "mp3",
      smoothPlayBar: true,
      keyEnabled: true,
   });
   load_playlist();

   var x = document.getElementsByClassName('jp-play')[0];

   $('.jp-title').bind("DOMSubtreeModified",function(){
      var title = document.getElementsByClassName("jp-title")[0];
      var name = document.getElementById("jp-song-name");
      name.innerHTML = title.innerHTML;
      //        alert('changed');
      highlight(title.innerHTML);
   });
   var title = document.getElementsByClassName("jp-title")[0];
   if(title.innerHTML)
      {
         var name = document.getElementById("jp-song-name");
         name.innerHTML = title.innerHTML;
         highlight(title.innerHTML);
      }

      $("#jquery_jplayer_1").bind($.jPlayer.event.play, function(event) {
         var title = document.getElementsByClassName("jp-title")[0];
         var name = document.getElementById("jp-song-name");
      });

      if($("#jquery_jplayer_1").data().jPlayer.status.paused == false){
         var title = document.getElementsByClassName("jp-title")[0].innerHTML;
         //        highlight(title);
      }

});

function highlight(title)
{
   //    alert("Highlighting");
   var i=0;
   var table = document.getElementById('table_now_playing');
   $('#now_playing table tr').each(function(){
      var val1 = $(table.rows[i].cells[1]).text();
      //        console.log(val1);
      if (val1 == title)
         {
            $(this).addClass("success");
            var cell1 = table.rows[i].cells[0];
            cell1.innerHTML = "<a href='' class='jp-pause' onclick='pause(this); return false;'>  <span class='glyphicon glyphicon-pause'> </span> </a>";
         }
         else
            {
               if($(this).hasClass("success"))
                  {
                     $(this).removeClass("success");
                     var cell1 = table.rows[i].cells[0];
                     var play = table.rows[i].cells[1].firstElementChild.getAttribute('onclick');
                     play = JSON.stringify(play);
                     cell1.innerHTML = "<a href='' class='jp-play' onclick="+play+">  <span class='glyphicon glyphicon-play'> </span> </a>";
                  }
            }
            i++;
   });
}

function pause(elem)
{
   myPlaylist.pause();
   var index = elem.parentNode.parentNode.rowIndex;
   var table = document.getElementById('table_now_playing');
   var play = table.rows[index].cells[1].firstElementChild.getAttribute('onclick');
   play = JSON.stringify(play);
   table.rows[index].cells[0].innerHTML = "<a href='' class='jp-play' onclick="+play+">  <span class='glyphicon glyphicon-play'> </span> </a>";;
}

function clear_queue() {
   var current_queue = [];
   //    alert("Clearing");
   localStorage.setItem('queue', JSON.stringify(current_queue));
   $("#table_now_playing tr").remove();
   myPlaylist.pause();
   load_playlist();
   return false;
}

function add_to_queue(song) {
   var current_queue = [];
   var flag = true;
   if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./scratch');
   }
   if(localStorage.getItem("queue")==null)
      {
         current_queue = [];
      }
      else
         {
            current_queue= JSON.parse(localStorage["queue"]);
            for(var i in current_queue)
               {
                  play_song = current_queue[i];
                  if(play_song.title == song.title)
                     {
                        flag = false;
                        break;
                     }
               }
         }
         if(flag)
            {
               myPlaylist.add(
                  {
                     title:song.title,
                     artist:song.artist,
                     mp3:song.path,
                     poster:song.album_art,
                     album:song.album
                  }
               );
               now_playing(song.path,song.title,song.artist,song.album,2);
               current_queue.push(song);
               localStorage.setItem('queue', JSON.stringify(current_queue));
            }
            return false;
}

function now_playing(path,title,artist,album,option){

   var table = document.getElementById('table_now_playing');
   var row=table.insertRow(table.rows.length);

   var cell1=row.insertCell(0);
   var pass = JSON.stringify("play('"+path+"',"+"'"+title+"',"+"'"+artist+"',"+"'"+album+"'); return false;");
   cell1.innerHTML = "<a href='' onclick="+pass+">  <span class='glyphicon glyphicon-play'> </span> </a>";

   cell1=row.insertCell(1);
   pass = JSON.stringify("play('"+path+"',"+"'"+title+"',"+"'"+artist+"',"+"'"+album+"'); return false;");
   cell1.innerHTML = "<a href='' onclick="+pass+">"+title+"</a>";

   cell1=row.insertCell(2);
   pass = JSON.stringify("load_album('/album/"+album+"'); return false;");
   cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+album+"</a>";

   cell1=row.insertCell(3);
   cell1.innerHTML = "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+artist)+"); return false;'>"+artist+"</a>";

   cell1=row.insertCell(4);
   pass = JSON.stringify("remove_song(this); return false;");
   cell1.innerHTML = "<a href='' onclick="+pass+">  <span class='glyphicon glyphicon-remove'> </span> </a>";

}

function load_playlist()
{
   var current_queue = [];
   var playlist = [];
   if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./scratch');
   }
   if(localStorage.getItem("queue")==null)
      {
         current_queue = [];
      }
      else
         {
            current_queue= JSON.parse(localStorage["queue"]);
            for(var i in current_queue)
               {
                  var song = current_queue[i];
                  var new_song =
                     {
                        title:song.title,
                        artist:song.artist,
                        mp3:song.path,
                        poster:song.album_art,
                        album:song.album
                     };
                     playlist.push(new_song);
                     now_playing(song.path,song.title,song.artist,song.album,2);
               }
               myPlaylist.setPlaylist(playlist);
         }
         return false;
}
