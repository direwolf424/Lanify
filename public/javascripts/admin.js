$(document).ready(function() {

   $('#uploadForm').submit(function() {
      $("#status").empty().text("File is uploading...");

      $(this).ajaxSubmit({

         error: function(xhr) {
            status('Error: ' + xhr.status);
         },

         success: function(response) {
            console.log(response);
            $("#status").empty().text(response);
         }
      });

      return false;
   });    
   if(loggedin && adminp ){
   $('#rename_album').editable({
      type: 'text',
      pk: 1,
      url: '/lanify/admin/rename',
      title: 'Enter valid name',
      ajaxOptions: {
         type: 'get',
         dataType: 'json'
      },
      autotext:'never',
      params: function(params) {
         //originally params contain pk, name and value
         params.flag = 'album';
         params.album_name = $("#album_single_name").html();
         return params;
      }
   });
   $('#rename_artist').editable({
      type: 'text',
      pk: 1,
      url: '/lanify/admin/rename',
      title: 'Enter valid name',
      ajaxOptions: {
         type: 'get',
         dataType: 'json'
      },
      autotext:'never',
      params: function(params) {
         //originally params contain pk, name and value
         params.flag = 'artist';
         params.artist_name = $("#artist_single_name").html();
         return params;
      }
   });
   }
   else{
      $('#rename_album').webuiPopover({title:'Rename',content:'You need admin rights to rename'});
      $('#rename_artist').webuiPopover({title:'Rename',content:'you need admin rights to rename'});
   }
});


function showMetaData(data) {
   musicmetadata(data, function (err, result) {
      if (err) throw err;
      console.log(result);
      $('#title').val(result.title);
      $('#album').val(result.album);
      $('#artist').val(result.artist);
      $('#year').val(result.year);
      if (result.picture.length > 0) {
         var picture = result.picture[0];
         var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
         var image = document.getElementById('myImg');
         image.src = url;
      }
      var div = document.getElementById('info');
      div.innerText = JSON.stringify(result, undefined, 2);
   });
}
function myFunction(){
   var x = document.getElementById("myFile");
   var txt = "";
   if ('files' in x) {
      if (x.files.length == 0) {
         txt = "Select one or more files.";
      } else {
         showMetaData(x.files[0]);
         for (var i = 0; i < x.files.length; i++) {
            txt += "<br><strong>" + (i+1) + ". file</strong><br>";
            var file = x.files[i];
            if ('name' in file) {
               txt += "name: " + file.name + "<br>";
            }
            if ('size' in file) {
               txt += "size: " + file.size + " bytes <br>";
            }
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
}

