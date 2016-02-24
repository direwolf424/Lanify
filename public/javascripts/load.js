/**
 * Created by Saurabh on 12-Feb-16.
 */
/**
 * Created by Saurabh on 15-Jan-16.
 */

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
            var x =" <div class='col-md-3'> <div class='song_image'> <img class='image_size' onerror='this.onerror=null;this.src=\"image/image.jpg\";' src='"+songs[i].album_art_small+"'> </div> <div class='break_word'> <a href='' onclick='play1("+song_json+"); return false;'>"+ songs[i].title +"</a>  </div> </div>";
            $('.song_slick').slick('slickAdd',x);
        }
    });
    return false;

}


function load_more_album(url)
{
    var lang=url.substr(13,url.length-13);

    $.get(url, function(data, status){
        var result = data[0];
        var elem = document.getElementsByClassName("albums_all_"+lang)[0];
        var count = document.getElementsByClassName("album_"+lang).length;
        var x = JSON.stringify("this.src='/image/image.jpg'");
        for (var i=count+1;i<count+31 && i<result.length;i++)
        {
            elem.innerHTML += "<div class='album album_"+lang+" col-md-5ths'> <a class='break_word' onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;' > <div class='song_image'> <img onerror="+x+" src='"+result[i].album_art+"'> </img> </div> <div class='album_name_list'> "+result[i].album+" </a> </div> </div> ";
        }
    });
    return false;
}


function load_more_artist()
{
    var url="/users/artists";

    $.get(url, function(data, status){
        var artist = data[0];
        var elem = document.getElementsByClassName("artists_all")[0];
        var count = document.getElementsByClassName("song").length;
        var x = JSON.stringify("this.src='/image/image.jpg'");
        for (var i=count+1;i<count+31 && i<artist.length;i++)
        {
            elem.innerHTML += "<div class='song col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='/image/image.jpg'> </img> </div> <div class='song_name'> <a class='break_word' onclick='load_artist("+JSON.stringify('/artist/'+artist[i])+"); return false;' > "+artist[i]+" </a> </div> </div> ";
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
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

            //cell1=row.insertCell(6);
            //cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';
        }
    });

    return false;
}
