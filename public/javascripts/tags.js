/**
 * Created by Saurabh on 22-Feb-16.
 */
$(document).ready(function() {
    var favorite = [];
    $("#submit_tags").click(function(){
        favorite = [];
        $.each($("input[name='tags']:checked"), function(){
            favorite.push($(this).val());
            $(this).attr('checked', false);
        });

        var id = document.getElementById('tag_id').value;
//        var lang = document.getElementById('tag_lang').value;

        var url="/tags/update/"+id;

        $.ajax({
            type: "GET",
            data: {tag:favorite},
            url: url
        });


//        alert("My favourite sports are: " + favorite.join(", ") );
    });
});

$(document).on("click", ".add_tags", function () {
    var myBookId = $(this).data('id');
    $(".modal-body #tag_id").val( myBookId );
/*
    var myBookId = $(this).data('lang');
    $(".modal-body #tag_lang").val( myBookId );
*/
    // As pointed out in comments,
    // it is superfluous to have to manually call the modal.
    // $('#addBookDialog').modal('show');
});