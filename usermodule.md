a@a:~/lssend$ curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d '{"email":"wisdomabraham92@gmail.com", "password":"Test@123456", "firstName":"Wisdom", "lastName":"Abraham"}'
{"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5MDY5NSwiZXhwIjoxNzUwMTk1NDk1fQ.uxR74aYNvJtNJJNB3uCmzpbTKwRwwwORy-Sg97y7nRg","data":{"user":{"email":"wisdomabraham92@gmail.com","firstName":"Wisdom","lastName":"Abraham","isEmailVerified":false,"role":"user","isActive":true,"_id":"6848a2a65b6fe23342b80d85","createdAt":"2025-06-10T21:24:54.353Z","updatedAt":"2025-06-10T21:24:54.353Z","__v":0}}}a@a:~/lssend$ 



a@a:~/lssend$ curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email":"wisdomabraham92@gmail.com", "password":"Test@123456"}'
{"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8","data":{"user":{"isVerified":false,"_id":"6848a2a65b6fe23342b80d85","email":"wisdomabraham92@gmail.com","firstName":"Wisdom","lastName":"Abraham","isEmailVerified":false,"role":"user","isActive":true,"createdAt":"2025-06-10T21:24:54.353Z","updatedAt":"2025-06-10T21:24:54.353Z","__v":0}}}a@a:~/lssend$ 




a@a:~/lssend$ curl -X GET http://localhost:5000/api/users/profile \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8"
{"status":"success","data":{"user":{"isVerified":false,"_id":"6848a2a65b6fe23342b80d85","email":"wisdomabraham92@gmail.com","password":"$2b$12$bdZm1GBZ2.tdbx.Ki3hgheMiVykmk2v2DzX6YgzPsrwTklXG1aw8.","firstName":"Wisdom","lastName":"Abraham","isEmailVerified":false,"role":"user","isActive":true,"createdAt":"2025-06-10T21:24:54.353Z","updatedAt":"2025-06-10T21:24:54.353Z","__v":0}}}a@a:~/lssend$ 