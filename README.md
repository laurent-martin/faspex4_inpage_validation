# Faspex customized validation: in browser

Note: This is not officially supported by IBM. Do not ask support to IBM for this.

This works on Faspex 4, but will not work on Faspex5.

Tested with Faspex v4.4.1.178477 Patch level 10.

## Overview

This document proposes a way to modify Faspex, so that package ingest is validated in two steps:

* Metadata for Dropbox packages is validated on browser side, without interaction to server side.
* Files contained in the package are validated during the transfer using Aspera inline validation procedure.

## In Browser form validation

### Elements

This consists in modifying Faspex JavaScript code, by injecting modified JavaScript code on the Faspex server.

Two files are placed on the Faspex server:

* `custom_browser_validation_engine.js`

  This overrides Faspex package creation validation. This is intended to be fixed code.

* `custom_browser_validation_definitions.js`

  This is the file that describes per Dropbox validation. Each validation function shall follow the following signature:

* The name of the function is `validate_` followed by the Dropbox name, e.g. `validate_MyDropbox`
* It takes one argument: `forminfo` which contains the list of file names to be sent. (It can be improved by adding metadata values if necessary). `forminfo.files` is an array.
* The function shall return an array with a list of error. The array is empty if there is no error.

The file `custom_browser_validation_engine.js` overrides the last function defined in `[Faspex]/public/javascripts/send/form/fieldsets/source_shares.js`.
The default method validates the form when there is at least one file attached.
The `send button is greyed out if the form is not valid, making it impossible to send the package.

`[Faspex]` refers to Faspex main installation folder.

### Sample

The sample validation script validates the following:

* The package must contain exactly two files
* The first file must have extension `.mxf`
* The second file must have extension `.xml`
* Both files must have the same basename.

It is a good idea to place package submission instructions in the Dropbox' Instruction area.

### Deployment

Place both JavaScript (engine and definitions) files in the folder: `[Faspex]/public/javascripts`.
On Linux `[Faspex]` is `/opt/aspera/faspex`.

Make sure that those files have the same ownership and access rights than other files in the same folder.
(typically, on Linux: `chown faspex:` and `chmod a+r`)

To activate the engine: add the following line at the end of:
`[Faspex]/app/views/layouts/_javascripts.html.erb`

```php
<%= javascript_include_tag 'custom_browser_validation_engine' %>
<%= javascript_include_tag 'custom_browser_validation_definitions' %>
```

The line will load the custom JavaScript in Faspex and override the default behavior.

Note that this modification is active on runtime, no need to restart Faspex.
It will be active on next package submission page display.

Alternatively, create a file named `server.txt` with the SSH parameters as follows:

```bash
echo root@192.168.0.14:33001 > server.txt
```

Where 33001 is the accessible SSH port on server 192.168.0.14 where Faspex 4 is installed.

Then do: `make deploy`

### Debugging

The JavaScript logs info in browser console, so if there is a problem, inspect the browser console in developer mode

## Inline validation

The officially supported validation method uses the feature "inline validation".

A sample ruby validator is provided.

Typically, though, inline validation can be performed using IBM Aspera Orchestrator.

Under Construction...
