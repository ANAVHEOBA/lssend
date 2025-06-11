a@a:~/lssend$ curl -X POST   -H "Content-Type: application/json"   -d '{
    "email": "wisdomabraham92@gmail.com",
    "password": "your-password-here"
  }'   http://localhost:5000/api/admin/initialize
{"status":"success","data":{"admin":{"id":"6848c7c530d2a247971ca7ee","email":"wisdomabraham92@gmail.com","role":"admin"},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhjN2M1MzBkMmEyNDc5NzFjYTdlZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0OTYwMDE5OCwiZXhwIjoxNzUwMjA0OTk4fQ.O8iAWSkjk338dar2cSLwj4rrLQvsgZjX0MbD2e9Y5wM"}}a@a:~/lssend$ 





a@a:~/lssend$ curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wisdomabraham92@gmail.com",
    "password": "your-password-here"
  }' \
  http://localhost:5000/api/admin/login
{"status":"success","data":{"admin":{"id":"6848c7c530d2a247971ca7ee","email":"wisdomabraham92@gmail.com","role":"admin","lastLogin":"2025-06-11T00:03:58.916Z"},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhjN2M1MzBkMmEyNDc5NzFjYTdlZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0OTYwMDIzOSwiZXhwIjoxNzUwMjA1MDM5fQ.hhKw7YXTk-_GvTz1TLcBfxbyVITeC9zfwWHVcjjNidM"}}a@a:~/lssend$ 