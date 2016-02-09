/**
 * Created by Saurabh on 15-Jan-16.
 */


function load_artist(url)
{
    $.get(url, function(data, status){
//        history.pushState(null, null, url);

        var elem = document.getElementById("artist_single_name");
        elem.innerHTML = data[0];

        $("#artist_single_albums_table tr").remove();
        $("#artist_single_songs_table tr").remove();
        var songs = data[1];
        for(var i in songs)
        {
            var song = songs[i];
            var table = document.getElementById("artist_single_songs_table");
            var row=table.insertRow(table.rows.length);

            var cell1=row.insertCell(0);
            var pass = JSON.stringify("play('"+song.path+"',"+"'"+song.title+"',"+"'"+song.artist+"',"+"'"+song.album+"'); return false;");
            cell1.innerHTML = "<a href='' onclick="+pass+">"+song.title+"</a>";

            var cell1=row.insertCell(1);
            cell1.innerHTML = "<a href='' onclick='load_album("+JSON.stringify('/album/'+song.album)+"); return false;'>"+song.album+"</a>";

            var cell1=row.insertCell(2);
            cell1.innerHTML = "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+song.artist)+"); return false;'>"+song.artist+"</a>";

            var cell1=row.insertCell(3);
            var song_json = JSON.stringify(song);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus-sign'> </span> </a>";

        }
        var albums = data[2];
        var album_arts = data[3];
        var elem = document.getElementById("artist_single_albums");
        elem.innerHTML="";
        for(var i in albums)
        {
            var album = albums[i];
            var album_art = album_arts[i];
           var elem = document.getElementById("artist_single_albums");
            elem.innerHTML += "<div class='col-md-3 song'> <div class='song_image'> <img src='"+album_art+"'> </img> </div> <div class='song_name'> <a onclick='load_album("+JSON.stringify('/album/'+album)+"); return false;'>"+album+"</a> </div> </div>";
        }
        $('.nav-stacked a[href="#artists"]').tab('show');
    });
    return false;
}
