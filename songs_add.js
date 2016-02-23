var mongoose = require('mongoose');
var fs = require('fs');
var pa = require('path');
var Sync = require('sync');
var mm = require('musicmetadata');
var Song = require('./Songs').song;

mongoose.createConnection('mongodb://localhost/music');

function endsWith(str, suffix) {
   return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function isBlank(str) {
   return (!str || /^\s*$/.test(str));
}
function capitalizeFirstLetter(string) {
   console.log('here',string);
   return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
   function to remove url from the string  
   write regex for it
   */
function delete_info(str){
   str = str.replace(/\([0-9]+\)/gi,""); //for format (1234)
   str = str.replace(/\[[0-9 a-z _ : , @ .]+\]/gi,""); //for anything beetween [word]
   str = str.replace(/[']+/,""); //for ' "
   str = str.replace(/["]+/,""); //for ' "
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

function split_Artist(str){
   str1 = str[0].split(/[&,]+/);
   for(var i=0;i<str1.length;i++){
      str1[i]=delete_info(str1[i]);
   }
   return str1;
}
function calculate_length(time){
   var time1 = parseInt(time);
   var min = time1/60;
   var sec=time%60;
   if(isNaN(sec)){
      sec='00';
   }
   else
      sec=Math.floor(sec);
   if(isNaN(min)){
      min='00';
   }
   else
      min=Math.floor(min);
   min = min.toString();
   sec = sec.toString();
   if(min.length == 1)
      min='0'+min;
   if(sec.length == 1)
      sec='0'+sec;
   time = min +":"+sec;
   return time;
}
var name;

//--------------------Hindi-----------------------------------
//var lang='hindi';
//var path= "/myfile/dc/lanify/Hindi/";
//var path1="Hindi/";
//---------------------English--------------------------
var lang='english';
var path= "/myfile/dc/lanify/English/";
var path1="English/";
//----------------telugu----------------------------------
//var lang='telugu';
//var path= "/myfile/dc/lanify/Telugu/";
//var path1="Telugu/";
var song_folder_arr = fs.readdirSync(path);
//console.log("hello",song_folder_arr);
var cntr=0;
Sync(function(){
   var cnt=0;
   for(j=0;j<song_folder_arr.length;j++){
      var folder = path+song_folder_arr[j];

      song_arr = fs.readdirSync(folder);
      console.log(folder);
      console.log(song_arr,song_arr.length);
      var tags;
      for(var i=0;i<song_arr.length;i++)
      {
         var file = song_arr[i];
         console.log(file);
         if(endsWith(file, ".mp3"))
            {
               cnt++;
               if(cnt<=9000)
                  continue;
               var pat = path1+song_folder_arr[j]+'/'+file;
               var time,metadata;
               try{
                  metadata = mm.sync(null,fs.createReadStream("/myfile/dc/lanify/"+pat),{duration:true});
               }
               catch(e){
                  //console.log('-------------------------------------->>'+e);
                  continue;
               }
               time=metadata.duration;
               //console.log('hello',metadata);
               //console.log('hello1');
               time = calculate_length(time);
               if(isBlank(metadata.title)||isBlank(metadata.artist)||isBlank(metadata.album))
                  {
                     //console.log("----------->the string was empty");
                     continue;
                  }
                  console.log('hello1');
                  arr_artist=split_Artist(metadata.artist);
                  //console.log('hello2');
                  var title = delete_info(metadata.title);
                  var album = delete_info(metadata.album);
                  var year = metadata.year;

                  if(isBlank(metadata.title))
                     {
                        //console.log("----------->the string was empty");
                        continue;
                     }
                     Song.update({"title":title},
                                 {
                                    "title":title,
                                    "album":album,
                                    artist:arr_artist,
                                    genre:metadata.genre,
                                    path:pat,
                                    album_art_small:path1+song_folder_arr[j]+'/cover/FRONT_COVER.jpg',
                                    album_art:path1+song_folder_arr[j]+'/cover/FRONT_COVER.jpg',
                                    rating:0,
                                    views:0,
                                    likes:0,
                                    dislikes:0,
                                    release_date:year,
                                    length:time,
                                    language:lang
                                 },
                                 { upsert:true },function(err,write){
                                    if(err)
                                       console.log('updated');
                                    else{
                                       console.log(cnt + ' written ',title+' ',i);
                                       //cnt++;
                                    }
                                 });

            }
      }
   }
});



