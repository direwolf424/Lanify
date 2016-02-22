/**
 * Created by Saurabh on 30-Jan-16.
 */
var myPlaylist;
var player;
var playlist=[];
var playlist_index=0;

function remove_song(element){
    var index = element.parentNode.parentNode.rowIndex;
    playlist.splice(index, 1);
    if(index==playlist_index)
    {
        player = $("#jquery_jplayer_1");
        playlist_index--;
        play_next();
        player.jPlayer("pause");
        var title = playlist[playlist_index-1].title;
        highlight(title,"pause",playlist[playlist_index-1]);
        playlist_index--;
    }
    else
    {
        if(playlist_index>0)
            playlist_index--;
    }
    var table = document.getElementById('table_now_playing');
    var title = table.rows[index].cells[1].textContent;
    table.deleteRow(index);
    var current_queue = [];
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }
    if(localStorage.getItem("queue")===null)
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
    return false;
}


function play1(song){
    var loc = song.path;
    var title = song.title;
    var album = song.album;
    var artist = song.artist;
    var length = song.length;
    player = $("#jquery_jplayer_1");
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                title: title,
                mp3: loc
            }).jPlayer("play");
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
    if(localStorage.getItem("queue")===null)
    {
        current_queue = [];
    }
    else
    {
        current_queue= JSON.parse(localStorage["queue"]);
        for(var i in current_queue)
        {
            play_song = current_queue[i];
            if(play_song.title == title)
            {
                index=i;
                flag = false;
                current_queue.splice(i, 1);
                break;
            }
        }
    }
    if(!flag)
    {
        player.jPlayer("setMedia", {
            mp3: loc
        });
        player.jPlayer("play");
        playlist_index = index;
    }
    else
    {
        current_queue.push(song);
        localStorage.setItem('queue', JSON.stringify(current_queue));
        player.jPlayer("setMedia", {
            mp3: loc
        });
        player.jPlayer("play", 0);
        playlist_index = playlist.length;
        playlist.push(song);
        now_playing(song);
    }
    player.jPlayer("play");
    var name = document.getElementById("jp-song-name");
    name.innerHTML = title;
    return false;
}


$(document).ready(function() {

    $('.jp-next').click( function() {
        play_next();
    });
    $('.jp-previous').click( function() {
        play_prev();
    });
    load_playlist();

    if(playlist.length>0)
    {
        var title = playlist[0].title;
        var loc = playlist[0].path;
        var name = document.getElementById("jp-song-name");
        name.innerHTML = title;
        player = $("#jquery_jplayer_1");
        highlight(title,"pause",playlist[0]);

        $("#jquery_jplayer_1").jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    title: title,
                    mp3: loc
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
    }

    $("#jquery_jplayer_1").bind($.jPlayer.event.play, function(event) {
        var name = document.getElementById("jp-song-name");
        view(name.innerHTML);
        highlight(name.innerHTML,"play",playlist[playlist_index]);
    });
    $("#jquery_jplayer_1").bind($.jPlayer.event.pause, function(event) {
        var name = document.getElementById("jp-song-name");
        highlight(name.innerHTML,"pause",playlist[playlist_index]);
    });

    $("#jquery_jplayer_1").bind($.jPlayer.event.ended, function(event) {
        play_next();
    });

    $('.jp-pause').hide();
});

function play_next()
{
    if(playlist_index<playlist.length-1)
    {
        playlist_index++;
        var song = playlist[playlist_index];
        play1(song);
    }
    else
    {
        playlist_index=0;
        var song = playlist[playlist_index];
        play1(song);
    }
}

function play_prev()
{
    if(playlist_index>0)
    {
        playlist_index--;
        var song = playlist[playlist_index];
        play1(song);
    }
}

function view(song)
{
    var url="/update/"+song;
    $.get(url, function(data, status) {
    });
}


function highlight(title,status,song)
{
//    alert(title+" "+song.title);
    if(status=="play")
    {
        var i=0;
        var table = document.getElementById('table_now_playing');
        var table_songs = document.getElementById('table_songs');

        $('#now_playing table tr').each(function(){
            var val1 = $(table.rows[i].cells[1]).text();
            if (val1 == title)
            {
                $(this).addClass("success");
                var cell1 = table.rows[i].cells[0];
                cell1.innerHTML = "<a href=''  onclick='pause(this,"+JSON.stringify(song)+"); return false;'>  <span class='glyphicon glyphicon-pause'> </span> </a>";
            }
            else
            {
                if($(this).hasClass("success"))
                {
                    $(this).removeClass("success");
                    var cell1 = table.rows[i].cells[0];
                    var play = table.rows[i].cells[1].firstElementChild.getAttribute('onclick');
                    cell1.innerHTML = "<a href='' onclick='"+play+"'>  <span class='glyphicon glyphicon-play'> </span> </a>";
                }
            }
            i++;
        });
    }
    else
    {
        var i=0;
        var table = document.getElementById('table_now_playing');
        $('#now_playing table tr').each(function(){
            var val1 = $(table.rows[i].cells[1]).text();
            if (val1 == title)
            {
                if($(this).hasClass("success"))
                {
                    $(this).removeClass("success");
                    var cell1 = table.rows[i].cells[0];
                    var play = table.rows[i].cells[1].firstElementChild.getAttribute('onclick');
                    cell1.innerHTML = "<a href=''onclick='"+play+"'>  <span class='glyphicon glyphicon-play'> </span> </a>";
                }
            }
            i++;
        });
    }
}

function pause(elem,song)
{
    player = $("#jquery_jplayer_1");
//    $(".jp-pause").click();
    player.jPlayer("pause");
    var table = document.getElementById('table_now_playing');
    var i = elem.parentNode.parentNode.rowIndex;
    var cell1 = table.rows[i].cells[0];
    var play = table.rows[i].cells[1].firstElementChild.getAttribute('onclick');
    cell1.innerHTML = "<a href='' onclick='"+play+"'>  <span class='glyphicon glyphicon-play'> </span> </a>";
    /*var play = table.rows[index].cells[1].firstElementChild.getAttribute('onclick');
    console.log(play);
    table.rows[index].cells[0].innerHTML = "<a href='' onclick='"+play+"'>  <span class='glyphicon glyphicon-play'> </span> </a>";*/
//    table.rows[index].cells[0].innerHTML = "play";

    return false;
}

function clear_queue() {
    var current_queue = [];
    localStorage.setItem('queue', JSON.stringify(current_queue));
    $("#table_now_playing tr").remove();
//    myPlaylist.pause();
    playlist.length = 0;
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
    if(localStorage.getItem("queue")===null)
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
            if(play_song.title == song.title)
            {
//                alert("adding again");
                flag = false;
                break;
            }
        }
    }
    if(flag)
    {
        playlist.push(song);
        now_playing(song);
        current_queue.push(song);
        localStorage.setItem('queue', JSON.stringify(current_queue));
    }
    return false;
}

function now_playing(song){

    var path,title,artist,album,length;
    path = song.path;
    title = song.title;
    artist = song.artist;
    album = song.album;
    length = song.length;

    var table = document.getElementById('table_now_playing');
    var row=table.insertRow(table.rows.length);

    var song_json = JSON.stringify(song);

    var cell1=row.insertCell(0);
    cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

    cell1=row.insertCell(1);
    cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>"+title+"</a>";

    cell1=row.insertCell(2);
    var pass = JSON.stringify("load_album('/album/"+album+"'); return false;");
    cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+album+"</a>";

    cell1=row.insertCell(3);
    for (var j=0;j< artist.length;j++) {
        cell1.innerHTML += "<a href='' onclick='load_artist(" + JSON.stringify('/artist/' + artist[j]) + ");return false;'>" + artist[j] + "</a> ";
    }

    cell1=row.insertCell(4);
    cell1.innerHTML = length;

    cell1=row.insertCell(5);
    pass = JSON.stringify("remove_song(this); return false;");
    cell1.innerHTML = "<a href='' onclick="+pass+">  <span class='glyphicon glyphicon-remove'> </span> </a>";

}

function load_playlist()
{
    var current_queue = [];
    var play = [];
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }
    if(localStorage.getItem("queue")===null)
    {
        current_queue = [];
    }
    else
    {
        current_queue= JSON.parse(localStorage["queue"]);
        for(var i in current_queue)
        {
            var song = current_queue[i];
            playlist.push(song);
            var new_song =
            {
                title:song.title,
                artist:song.artist,
                mp3:song.path,
                poster:song.album_art,
                album:song.album
            };
            play.push(new_song);
            now_playing(song);
        }
//        myPlaylist.setPlaylist(play);
    }
    return false;
}
