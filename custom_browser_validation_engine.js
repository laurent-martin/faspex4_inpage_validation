// Laurent Martin, IBM 2018
// This code is provide as a sample and is not supported
// Refer to README file.
// returns the base name of file, i.e. removes path and extension
String.prototype.basename = function() {
  result=this.substring(1 + Math.max(this.lastIndexOf('/'), this.lastIndexOf('\\')));
  if(result.lastIndexOf(".") != -1)
    result = result.substring(0, result.lastIndexOf("."));
  return result;
}
// override the function in [Faspex]/public/javascripts/send/form/fieldsets/source_shares.js
jQuery(function($) {
$(document).ready(function(){
  console.log("dropbox inpage validator loaded");
  //$('#folders-browse').remove();
  DROPBOX_TITLE_MARKER=': *';
  title=$('h1').text();
  titlepos=title.indexOf(DROPBOX_TITLE_MARKER);
  validation_function=undefined;
  if (-1 != titlepos) {
      dropboxname=title.substring(titlepos+DROPBOX_TITLE_MARKER.length);
      console.log("dropbox name="+dropboxname);
      validation_function=window["validate_"+dropboxname];
      console.log("function="+validation_function);
  }
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
    if (undefined != validation_function) {
      filelist=[];
      $(this).find('tr').map(function(){filelist.push($.trim($(this).data('path')));});
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
    // only at the end, change button enableness
    $('#send_button').prop('disabled',disable_send);
  });
});
});
