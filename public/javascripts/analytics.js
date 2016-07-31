/**
 * Created by Saurabh on 29-Jul-16.
 */
var reference='index';
var start_date=new Date();
start_date.setHours(start_date.getHours() - 1);
start_date = start_date.toISOString();
var end_date=new Date().toISOString();
var dataTable;
$(document).ready(function (){

    $.fn.dataTable.ext.errMode = 'none';

    $('#start_date').datetimepicker({
        maxDate:Date.now()
    });
    $('#end_date').datetimepicker({
        maxDate:Date.now(),
        useCurrent: false //Important! See issue #1075
    });
    $("#start_date").on("dp.change", function (e) {
        $('#end_date').data("DateTimePicker").minDate(e.date);
        start_date = e.date.toISOString();
    });
    $("#end_date").on("dp.change", function (e) {
        $('#start_date').data("DateTimePicker").maxDate(e.date);
        end_date = e.date.toISOString();
    });
    $("#get_active_sessions").click(function() {
        get_active_sessions();
    });
    $("#get_all_sessions").click(function() {
        get_all_sessions();
    });
    dataTable = $('#table_active_sessions').DataTable();
});


function analytics_actions(action_name)
{
/*
    var url="/analytics/";
    $.ajax({
        type:"GET",
        data:{flag:'action',name:action_name,reference:reference,socket_id:socket_id},
        url:url
    });
*/
    return false;
}

function get_active_sessions()
{
    var url="/analytics/";
    $.ajax({
        type:"GET",
        data:{flag:'get_active_sessions'},
        url:url,
        success: function(data) {
            populate_active_user_table(data,'active');
        }
    });
    return false;
}

function get_all_sessions()
{
    var url="/analytics/";
    $.ajax({
        type:"GET",
        data:{flag:'get_all_sessions',start_date:start_date,end_date:end_date},
        url:url,
        success: function(data) {
            populate_active_user_table(data,'total');
        }
    });
    return false;
}

function populate_active_user_table(data,option) {
    dataTable.clear();
    $('#number_sessions').html(data.length+' sessions');
    var visit_time,exit_time;
    for(var i in data)
    {
        var session = data[i];
        visit_time = new Date(session.visit_time).toLocaleString();
        exit_time = new Date(session.exit_time).toLocaleString();
        dataTable.row.add([session.username,session.logged_in,session.ip_address,visit_time,exit_time,session.browser,session.operating_system,session.socket_id]).draw();
    }
    if(data.length==0)
        dataTable.clear().draw();
}