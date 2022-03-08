// Laurent Martin, IBM 2018
// This code is provide as a sample and is not supported
// Refer to README file.
console.log("laurent1");
// returns the base name of file, i.e. removes path and extension
String.prototype.basename = function(sep) {
  sep = sep || '\\/';
  result=this.split(new RegExp("["+sep+"]")).pop();
  if(result.lastIndexOf(".") != -1)
	  result = result.substring(0, result.lastIndexOf("."));
  return result;
}
// override the function in [Faspex]/public/javascripts/send/form/fieldsets/source_shares.js
jQuery(function($) {
$(document).ready(function(){
  //$('#folders-browse').remove();
  DROPBOX_TITLE_PREFIX="Send to Dropbox: *";
  //$('<div id="validation_status" style="color:red"/>').insertAfter( "h1" );
  // "files" is tbody
  $('#files').bind('contentchanged', function (e) {
    e.preventDefault();
    // by default send button is disabled
    disable_send=true;
    $("#ajax_messages").text("");    	  
    if ($(this).is(":empty")) {
      $('#files-controls').hide();
    } else {
      $('#files-controls').show();
      disable_send=false;
    }
    // update value of file list
    $('#delivery_source_paths_list').val($(this).find('tr').map(function () {
      return $.trim($(this).data('path'));
    }).get().join('\n'));
    // special per dropbox handling
    title=$("h1").text();
    if (0 == title.indexOf(DROPBOX_TITLE_PREFIX)) {
      dropboxname=title.substring(DROPBOX_TITLE_PREFIX.length);
      console.log("dropbox name="+dropboxname);
      validation_function=window["validate_"+dropboxname];
      console.log("function="+validation_function);
      if (undefined != validation_function) {
        filelist=[];
        $(this).find('tr').map(function(){filelist.push($(this).data('path').trim());});
        forminfo={files:filelist};
        console.log("form="+JSON.stringify(forminfo));
        errors=validation_function(forminfo);
        console.log("errors="+JSON.stringify(errors));
        if (0 == errors.length) {
          disable_send=false;
        } else {
            $("#ajax_messages").html('<div class="ajax_error_messages" role="alert">'+errors.join('<br/>')+'</br>');    	  
    	    disable_send=true;
        }
      }
    }
    // only at the end, change button enableness
    $('#send_button').prop('disabled',disable_send);
  });
});
});
