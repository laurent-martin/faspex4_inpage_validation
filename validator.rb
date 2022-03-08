require 'action_view'
require 'find'
require 'json'

# copy to: <faspex install dir>/lib/tasks

namespace :dropbox do
  desc 'run dropbox validation service'
  task :validator => :environment do

    $llogger = Logger.new('/tmp/log.txt')
    $llogger.level=Logger::DEBUG
    $llogger.error('started')

    require 'webrick'

    class FaspexQuotaServlet < WEBrick::HTTPServlet::AbstractServlet
      def do_POST (request, response)
        data=JSON.parse(request.body)
        $llogger.error("data=#{data}")
        # TODO: validfate here
        #response.status = 200
        #response.content_type = 'text/plain'
        #response.body = ''
        response.status = 400
        response.content_type = 'application/json'
        response.body = {:error=>{ :code=>18, :message=>'my long message here fdshgfkagdsfhjkasdgfhjkdgfhjadksfgdjsakfgdhsajkfgdjfkgasfjksdgahfjkdasgfjadsfdsgk'}}.to_json
      end
    end

    server = WEBrick::HTTPServer.new(:Port => 12345)

    server.mount '/', FaspexQuotaServlet

    trap('INT') {
      server.shutdown
    }

    server.start
  end
end
