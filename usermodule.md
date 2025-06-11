a@a:~/lssend$ curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d '{"email":"wisdomabraham92@gmail.com", "password":"Test@123456", "firstName":"Wisdom", "lastName":"Abraham"}'
{"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5MDY5NSwiZXhwIjoxNzUwMTk1NDk1fQ.uxR74aYNvJtNJJNB3uCmzpbTKwRwwwORy-Sg97y7nRg","data":{"user":{"email":"wisdomabraham92@gmail.com","firstName":"Wisdom","lastName":"Abraham","isEmailVerified":false,"role":"user","isActive":true,"_id":"6848a2a65b6fe23342b80d85","createdAt":"2025-06-10T21:24:54.353Z","updatedAt":"2025-06-10T21:24:54.353Z","__v":0}}}a@a:~/lssend$ 


a@a:~/lssend$ curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d '{"email":"jessicaanavheobass@gmail.com", "password":"Abrisco@real17", "firstName":"Wisdom", "lastName":"Abraham"}'
{"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDllZmFlMGYxM2M1YzRhODc0NDQyZiIsImlhdCI6MTc0OTY3NTk1MSwiZXhwIjoxNzUwMjgwNzUxfQ.Af0-YI53W2gZkaIy2fxbbG7iikw78Uq0zQamuKtFO4k","data":{"user":{"email":"jessicaanavheobass@gmail.com","firstName":"Wisdom","lastName":"Abraham","isVerified":false,"role":"user","_id":"6849efae0f13c5c4a874442f","createdAt":"2025-06-11T21:05:50.812Z","updatedAt":"2025-06-11T21:05:50.812Z","__v":0}}}a@a:~/lssend$ 



a@a:~/lssend$ curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email":"wisdomabraham92@gmail.com", "password":"Test@123456"}'
{"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8","data":{"user":{"isVerified":false,"_id":"6848a2a65b6fe23342b80d85","email":"wisdomabraham92@gmail.com","firstName":"Wisdom","lastName":"Abraham","isEmailVerified":false,"role":"user","isActive":true,"createdAt":"2025-06-10T21:24:54.353Z","updatedAt":"2025-06-10T21:24:54.353Z","__v":0}}}a@a:~/lssend$ 


curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email":"jessicaanavheobass@gmail.com", "password":"Abrisco@real17"}'

a@a:~/lssend$ curl -X GET http://localhost:5000/api/users/profile \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8"
{"status":"success","data":{"user":{"isVerified":false,"_id":"6848a2a65b6fe23342b80d85","email":"wisdomabraham92@gmail.com","password":"$2b$12$bdZm1GBZ2.tdbx.Ki3hgheMiVykmk2v2DzX6YgzPsrwTklXG1aw8.","firstName":"Wisdom","lastName":"Abraham","isEmailVerified":false,"role":"user","isActive":true,"createdAt":"2025-06-10T21:24:54.353Z","updatedAt":"2025-06-10T21:24:54.353Z","__v":0}}}a@a:~/lssend$ 








a@a:~/lssend$ curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jessicaanavheobasss@gmail.com",
    "password": "Abrisco@real17",
    "firstName": "Wisdom",
    "lastName": "Abraham"
  }'
{"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDlmMDRlNDFjNzRlYzU4MjdiOWViYiIsImlhdCI6MTc0OTY3NjExMSwiZXhwIjoxNzUwMjgwOTExfQ.ha61gdEpqXAR_wfTCDNV4URUarMdHCGyeHa_eQqxcGE","data":{"user":{"email":"jessicaanavheobasss@gmail.com","firstName":"Wisdom","lastName":"Abraham","isVerified":false,"role":"user","_id":"6849f04e41c74ec5827b9ebb","createdAt":"2025-06-11T21:08:30.650Z","updatedAt"a@a:~/lssend$ curl -X POST http://localhost:5000/api/users/login \ttp://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jessicaanavheobasss@gmail.com",
    "password": "Abrisco@real17"
  }'
{"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDlmMDRlNDFjNzRlYzU4MjdiOWViYiIsImlhdCI6MTc0OTY3NjEzMCwiZXhwIjoxNzUwMjgwOTMwfQ.9-6Ljpi649p6znWxDPcGV_Kj4PMY_UldMzEu2huTaeA","data":{"user":{"_id":"6849f04e41c74ec5827b9ebb","email":"jessicaanavheobasss@gmail.com","firstName":"Wisdom","lastName":"Abraham","isVerified":false,"role":"user","createdAt":"2025-06-11T21:08:30.650Z","updatedAt":"2025-06-11T21:08:30.650Z","__v":0}}}a@a:~/lssend$ v