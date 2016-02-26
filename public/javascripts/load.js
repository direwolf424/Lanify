/**
 * Created by Saurabh on 12-Feb-16.
 */
/**
 * Created by Saurabh on 15-Jan-16.
 */

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
            elem.innerHTML += "<div title='"+result[i].album+"' class='album album_"+lang+" col-md-5ths'> <a onclick='load_album("+JSON.stringify('/album/'+result[i].album)+"); return false;' > <div class='song_image'> <img onerror="+x+" src='"+result[i].album_art+"'> </img> </div> <div class='ellip_name'> "+result[i].album+" </a> </div> </div> ";
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
            elem.innerHTML += "<div title = '"+artist[i]+"' class='song col-md-5ths'> <div class='song_image'> <img onerror="+x+" src='/image/image.jpg'> </img> </div> <div class='ellip_name'> <a onclick='load_artist("+JSON.stringify('/artist/'+artist[i])+"); return false;' > "+artist[i]+" </a> </div> </div> ";
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
            cell1.innerHTML = '<a href="" class="add_tags" data-id="'+song._id+'" data-toggle="modal" data-target="#myModal">Add Tags</a>';

            cell1=row.insertCell(6);
            cell1.innerHTML = "<a href='' onclick='add_to_queue("+song_json+"); return false;'>  <span class='glyphicon glyphicon-plus'> </span> </a>";

        }
    });

    return false;
}

function tag_lang(data,lang,tag){
   console.log('tagging');
   console.log(data);
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
                console.log(data[song]);
                var table = document.getElementById("tag_single_songs_"+lang);
                var row=table.insertRow(table.rows.length);

                var cell1=row.insertCell(0);
                var song_json=JSON.stringify(data[song]);
                cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false;'>  <span class='glyphicon glyphicon-play'> </span> </a>";

                cell1=row.insertCell(1);
                cell1.innerHTML = "<a href='' onclick='play1("+song_json+"); return false'>"+data[song].title+"</a>";

                cell1=row.insertCell(2);
                var pass = JSON.stringify("load_album('/album/"+song.album+"'); return false;");
                cell1.innerHTML = "<a class='album_click' href='' onclick="+pass+">"+data[song].album+"</a>";

                cell1=row.insertCell(3);
                for(var j=0;j<data[song].artist.length;j++){
                    cell1.innerHTML += "<a href='' onclick='load_artist("+JSON.stringify('/artist/'+data[song].artist[j])+");return false;'>"+data[song].artist[j]+" </a>";
                }

                cell1=row.insertCell(4);
                cell1.innerHTML = data[song].length;

                cell1=row.insertCell(5);
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
                  console.log(song);
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
    console.log("Loading");
    $.get(url, function(data, status) {
        var elem = document.getElementById("tags");
        var x = JSON.stringify('/image/image.jpg');
        for(var i=0;i<data.length;i++)
        {
            elem.innerHTML += "<div class='album tags col-md-5ths'> <a onclick='load_tag_songs("+JSON.stringify(data[i])+"); return false;' > <div class='song_image'> <img onerror="+x+" src='/image/image.jpg'> </img> </div> <div class='ellip_name'> "+capitalizeFirstLetter(data[i])+" </a> </div> </div> ";
        }
    });
    return false;
}

