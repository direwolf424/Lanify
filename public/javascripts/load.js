/**
 * Created by Saurabh on 12-Feb-16.
 */
/**
 * Created by Saurabh on 15-Jan-16.
 */
function load_more_album()
{
    var url="/users/album";

    $.get(url, function(data, status){
        //history.pushState(null, null, url);

//        alert(data);
        var album = data[0];
        var album_art = data[1];
        var elem = document.getElementsByClassName("albums_all")[0];
        var count = document.getElementsByClassName("album").length;
        for (var i=count+1;i<count+20 && i<album.length;i++)
        {
            elem.innerHTML += "<div class='album col-md-3'> <div class='song_image'> <img class ='image_size' src='"+album_art[i]+"'> </img> </div> <div class='album_name_list'> <a class='album_click' onclick='load_album("+JSON.stringify('/album/'+album[i])+"); return false;' > "+album[i]+" </a> </div> </div> ";
        }
    });
    return false;
}

function load_more_artist()
{
    var url="/users/artists";

    $.get(url, function(data, status){
        var artist = data[0];
        var elem = document.getElementsByClassName("song_all")[0];
        var count = document.getElementsByClassName("song").length;
        for (var i=count+1;i<count+20 && i<artist.length;i++)
        {
            elem.innerHTML += "<div class='song col-md-3'> <div class='song_image'> <img class ='image_size' src='/image/image.jpg'> </img> </div> <div class='song_name'> <a class='album_click' onclick='load_artist("+JSON.stringify('/artist/'+artist[i])+"); return false;' > "+artist[i]+" </a> </div> </div> ";
        }
    });
    return false;
}

function load_more_song()
{
    var url="/users/songs";

    $.get(url, function(data, status){

        var songs = data[0];
        var table = document.getElementById("table_songs");
        var count = table.rows.length;
        for (var i=count+1;i<count+20 && i<songs.length;i++)
        {
            var row=table.insertRow(table.rows.length);
            var song = songs[i];
            var cell1=row.insertCell(0);
            var pass = JSON.stringify("play('"+song.path+"',"+"'"+song.title+"',"+"'"+song.artist+"',"+"'"+song.album+"'); return false;");
            cell1.innerHTML = "<a href='' onclick="+pass+">  <span class='glyphicon glyphicon-play'> </span> </a>";

            cell1=row.insertCell(1);
            pass = JSON.stringify("play('"+song.path+"',"+"'"+song.title+"',"+"'"+song.artist+"',"+"'"+song.album+"'); return false;");
            cell1.innerHTML = "<a href='' onclick="+pass+">"+song.title+"</a>";

            cell1=row.insertCell(2);
            pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
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
            var song_json = JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus-sign'> </span> </a>";
        }
    });
    return false;
}
