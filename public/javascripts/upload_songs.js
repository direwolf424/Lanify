var arr_title=[],arr_album=[],arr_artist=[],arr_year=[],arr_lang=[];
var upload_cnt;
$(document).ready(function() {

   $('#uploadForm').submit(function() {
      var r = confirm("Please Check the details , If correct then press ok else correct the information");
      if(r==true){
      $("#status").empty().text("-------------->File is Uploading...Please be patient :P");
      $(this).ajaxSubmit({

         error: function(xhr) {
            status('Error: ' + xhr.status);
         },

         success: function(response) {
            console.log(response);
            $("#status").empty().text(response);
         }
      });
      }
      return false;
   });    
});

function showMetaData(data,i,callback) {
   musicmetadata(data, function (err, result) {
      if (err) throw err;
      //console.log(result);
      var title=delete_info(result.title);
      var album=delete_info(result.album);
      var artist=result.artist;
      var year=result.year;
      if (result.picture.length > 0) {
         var picture = result.picture[0];
         var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
         var image = document.getElementById('myImg');
         image.src = url;
      }
      //var div = document.getElementById('info');
      //div.innerText = JSON.stringify(result, undefined, 2);
      arr_album[i]=album;
      arr_artist[i]=artist;
      arr_year[i]=year;
      arr_title[i]=title;
      console.log(i,upload_cnt,title);
      upload_cnt++;
      callback('error',title,album,artist,year);
   });
}

function myFunction(){
   var x = document.getElementById("myFile");
   var txt = "",html="";
   $("#song_upload_body tr").remove();
   upload_cnt=0;
   if ('files' in x) {
      if (x.files.length == 0) {
         txt = "Select one or more files.";
      } else {
         for (var i = 0; i < x.files.length; i++) {
            //txt += "<br><strong>" + (i+1) + ". file</strong><br>";
            var file = x.files[i];
            //if ('name' in file) {
            //txt += "name: " + file.name + "<br>";
            //}
            //if ('size' in file) {
            //txt += "size: " + file.size + " bytes <br>";
            //}
            showMetaData(x.files[i],i,function(err,title,album,artist,year){
      if(upload_cnt==x.files.length)
         assign_value_table();
            });
         }
      }
   } 
   else {
      if (x.value == "") {
         txt += "Select one or more files.";
      } else {
         txt += "The files property is not supported by your browser!";
         txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
      }
   }
   document.getElementById("demo").innerHTML = txt;
   //song_table.innerHTML=html;
}

function assign_value_table(){
   var table = document.getElementById("song_upload_body");
   for(var i=0;i<upload_cnt;i++){
      var row=table.insertRow(table.rows.length);
      var cell1=row.insertCell(0);
      cell1.innerHTML = '<input name="title" type="text" value="'+arr_title[i]+'" style="width:100%"></input>';
      cell1=row.insertCell(1);
      cell1.innerHTML = '<input name="album" type="text" value="'+arr_album[i]+'" style="width:100%""></input>';
      cell1=row.insertCell(2);
      cell1.innerHTML = '<input name="artist" type="text" value="'+arr_artist[i]+'" style="width:100%""></input>';
      cell1=row.insertCell(3);
      cell1.innerHTML = '<input name="year" type="text" value="'+arr_year[i]+'" style="width:100%""></input>';
      cell1=row.insertCell(4);
      cell1.innerHTML = '<select name="language"><option value="english">English</option><option value="hindi">Hindi</option><option value="telugu">Telugu</option></select>';
   }
}
function delete_info(str){
   str = str.replace(/\([0-9]+\)/gi,""); //for format (1234)
   str = str.replace(/\[[0-9 a-z _ : , @ .]+\]/gi,""); //for anything beetween [word]
   str = str.replace(/[']+/,""); //for ' "
   str = str.replace(/["]+/,""); //for ' "
   str = str.replace(/[#]+/,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.com/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.org/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.pk/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.se/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.net/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.info/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.link/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.inf/gi,""); //for ' "
   str = str.replace(/www\.[0-9 a-z]+\.eu/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.com/gi,""); //for ' "
   str = str.replace(/@ [0-9 a-z]+\.com/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.org/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.PK/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.SE/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.net/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.info/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.link/gi,""); //for ' "
   str = str.replace(/- [0-9 a-z]+\.inf/gi,""); //for ' "
   str = str.replace(/[:]+/gi,''); //for ' "
   str=str.replace(" - DJMaza.Info", "");
   str=str.replace(" - DJMaza.INFO", "");
   str=str.replace(" - www.Songs.PK", "");
   str=str.replace(" -  www.Songs.PK", "");
   str=str.replace("[www.DJMaza.Com]", "");
   str=str.replace(" - www.DJMaza.Com", "");
   str=str.replace(" - www.MP3Khan.Com", "");
   str=str.replace(" - DJMaza.Com", "");
   str=str.replace(" - SceneDL", "");
   str=str.replace(" - DownloadMing.SE", "");
   str=str.replace(" - MP3Khan.Com", "");
   str=str.replace("[PagalWorld.com]", "");
   str=str.replace("(PagalWorld.com)", "");
   str=str.replace("[www.Mp3HunGama.IN]", "");
   str=str.replace(" - www.SongsPK.info", "");
   str=str.replace("- Songspk.LINK", "");
   str=str.replace("- DJMaza.Link", "");
   str=str.replace("[www.LatestZone.Net]", "");
   str=str.replace("- Songspk.name", "");
   str=str.replace("- www.SongsLover.com", "");
   str=str.replace("- urgrove.com", "");
   str=str.replace("- Tinhkhucbathu.com", "");
   str=str.replace("www.Songs.PK", "");
   str=str.replace("www.djrobsonmichel.com", "");
   str=str.replace("{www.LatestZone.Net}", "");
   str=str.replace(":: www.FreeTeluguMp3Songs.com ::", "");
   str=str.replace("[Songs.PK]", "");
   str=str.replace("- PagalWorld.com", "");
   str=str.replace("- www.SongsLover.com", "");
   str = str.replace(/[-]+/,""); //for ' "
   str = str.trim();
   return str;
}
