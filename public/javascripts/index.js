function load_home(){
    $('.nav-stacked a[href="#home"]').tab('show');
    return false;
}

$(document).ready(function(){


    document.getElementById('clear_queue').addEventListener('click',clear_queue);

    var myInput = document.getElementById("bar");
    if ("onpropertychange" in myInput && !("oninput" in myInput)) {
        myInput.onpropertychange = function () {
            if (event.propertyName == "value")
                inputChanged.call(this, event);
        }
    }
    else
        myInput.oninput = inputChanged;

    function inputChanged () {
        if(this.value.length<2)
        {
            var res = document.getElementById('search_result');
            res.style.visibility="hidden";
            res.style.display='none';
        }
        // Check the length here, e.g. this.value.length
    }

    window.onbeforeunload = function(e) {
        return 'Reloading the page will stop your music.';
    };




    function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82)
        e.preventDefault(); };

    $(document).on("keydown", disableF5);

    $('.album_slick').slick({
//        infinite: true,
        slidesToShow: 8,
        slidesToScroll: 3,
        swipeToSlide: true,
        prevArrow: $('.prev1'),
        nextArrow: $('.next1'),
       focusOnSelect:true
    });

    $('.song_slick').slick({
//        infinite: true,
        slidesToShow: 8,
        slidesToScroll: 3,
        swipeToSlide: true,
        prevArrow: $('.prev2'),
        nextArrow: $('.next2'),
        focusOnSelect:true

    });

    $('.artist_slick').slick({
//        infinite: true,
        slidesToShow: 8,
        slidesToScroll: 3,
        swipeToSlide: true,
        prevArrow: $('.prev3'),
        nextArrow: $('.next3'),
        focusOnSelect:true

    });
    $('.nav-stacked').click(function() {
        history.pushState(null, null, "http://192.168.159.28:3000/db");
    });

    $(document).click(function() {
        var res = document.getElementById('search_result');
        res.style.visibility="hidden";
        res.style.display='none';
        myInput.value = "";
    });

});

$(function () {

   $("#bar").autocomplete({
      source: function (request, response) {
         $.ajax({
            url: "http://192.168.159.28:3000/search",
            type: "GET",
            data: request,  // request is the value of search input
            success: function (data) {
                var res = document.getElementById('search_result');
                res.style.visibility="visible";
                res.style.display='block';
                var songs = data[0];
                var albums = data[1];
                var artists = data[2];
                var res = document.getElementById('search_song');
                res.style.visibility="visible";
                res.style.display='block';
                res.innerHTML = "";
                for(var i in songs)
                {
                    var pass = JSON.stringify("play('"+songs[i].path+"',"+"'"+songs[i].title+"',"+"'"+songs[i].artist+"',"+"'"+songs[i].album+"')");
                    res.innerHTML += "<p class='ui-menu-item' onclick="+pass+">"+songs[i].title+"<p>";
                    if(i>5)
                        break;
                }
                var res = document.getElementById('search_album');
                res.style.visibility="visible";
                res.style.display='block';
                res.innerHTML = "";
                if(albums.length==0)
                {
                    res.innerHTML = "No Albums Found";
                }
                for(var i in albums)
                {
                    var pass = JSON.stringify("load_album('/album/"+albums[i]+"')");
                    res.innerHTML += "<p class='ui-menu-item' onclick="+pass+">"+albums[i]+"<p>";
                    if(i>5)
                        break;
                }
                var res = document.getElementById('search_artist');
                res.style.visibility="visible";
                res.style.display='block';
                res.innerHTML = "";
                for(var i in artists)
                {
                    res.innerHTML += "<p class='ui-menu-item' onclick='load_artist("+JSON.stringify('/artist/'+artists[i])+"); return false;'>"+artists[i]+"<p>";
                    if(i>5)
                        break;
                }
               }
               });
         },

               // The minimum number of characters a user must type before a search is performed.
               minLength: 1,

               // set an onFocus event to show the result on input field when result is focused
               focus: function (event, ui) {
                  this.value = ui.item.label;
                  event.preventDefault();
               },
               select: function (event, ui) {
                  // Prevent value from being put in the input:
                  this.value = ui.item.label;
                  // Set the id to the next input hidden field
                  $(this).next("input").val(ui.item.value);
                  // Prevent other event from not being execute
                  event.preventDefault();
                  // optionnal: submit the form after field has been filled up
                  $('#quicksearch').submit();
               }
            });

         });


$(document).ready(function()
                  {
                     $(".backup_picture").error(function(){
                        //alert('hello');
                        $(this).attr('src', '/image/image.jpg');
                     });
                  });
