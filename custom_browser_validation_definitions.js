// Laurent Martin, IBM 2018
// This code is provide as a sample and is not supported
// Refer to README file.

// one function per dropbox name : name of dropbox: "validation"
function validate_validation(forminfo) {
	errors=[];
	var nfiles = forminfo.files.length;
	if (2 != nfiles) {
		errors.push("Expecting exactly 2 files, currently: "+nfiles);
	}
	firstfileext=undefined;
	hasmxf=false;
	if (1 <= nfiles) {
		if (!forminfo.files[0].toLowerCase().endsWith(".mxf")) {
			errors.push("first file must be mxf");
		}
		firstbasename=forminfo.files[0].basename();
		if (!firstbasename.match(/^[A-Z0-9]{8}$/)) {
			errors.push("First basename must match be exactly 8 characters of digits or uppercase letter");
		}
		if (2 <= nfiles) {
			if (! forminfo.files[1].toLowerCase().endsWith(".xml")) {
				errors.push("Second file must be an xml file");
			}
			secondbasename=forminfo.files[1].basename();
			if (firstbasename != secondbasename) {
				errors.push("Both files must have same basename");
			}
		}
	}
	return errors;
}
