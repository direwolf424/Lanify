$(document).ready(function(){
   $("#chatRoom").click(function(){
      $('#notify_chat').html('');
      cnt=0;
      $('.nav-stacked a[href="#chatroom"]').tab('show');
   });
});
