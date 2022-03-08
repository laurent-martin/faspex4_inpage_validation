all:: faspex_validation.zip

faspex_validation.zip: README.pdf custom_browser_validation_definitions.js custom_browser_validation_engine.js
	rm -f $@
	zip -r faspex_validation.zip $^
	cp faspex_validation.zip faspex_validation_zip.dat

README.pdf: README.md
	pandoc --resource-path=. --toc -o README.html README.md
	wkhtmltopdf README.html README.pdf

clean::
	rm -f faspex_validation.zip faspex_validation_zip.dat README.html README.pdf
FASPEX_DIR=/opt/aspera/faspex
JS_DIR=$(FASPEX_DIR)/public/javascripts
MODIF=$(FASPEX_DIR)/app/views/layouts/_javascripts.html.erb
SERVER_ADDR=$(shell cut -f1 -d: server.txt)
SERVER_PORT=$(shell cut -f2 -d: server.txt)
server.txt:
	@echo "see README.md to create file $@"
	@exit 1
deploy: server.txt
	scp -P $(SERVER_PORT) custom_browser_validation_definitions.js custom_browser_validation_engine.js $(SERVER_ADDR):$(JS_DIR)
	ssh -p $(SERVER_PORT) $(SERVER_ADDR) 'chown --reference=$(JS_DIR)/application.js $(JS_DIR)/custom_browser_validation_*.js'
	ssh -p $(SERVER_PORT) $(SERVER_ADDR) 'set -x;for m in engine definitions;do f=custom_browser_validation_$$m;grep $$f $(MODIF) || echo -e "<%= javascript_include_tag \047$$f\047 %>" >> $(MODIF);done'
