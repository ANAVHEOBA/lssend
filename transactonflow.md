   User → Enter Amount → System Calculates NGN → User Confirms → 
   System Shows Payment Details → User Makes Payment → 
   User Uploads Proof → Admin Verifies → LSK Sent










   a@a:~/lssend$ curl -X POST http://localhost:5000/api/transactions/buy -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8" -d '{
  "liskAmount": 100,
  "liskAddress": "lskd8y4kxutncd97hwqfn7yz4bw7js2qgswqgswqg"
}'
{"status":"success","data":{"transaction":{"id":"6848ba510d3d457848a46b93","status":"pending_payment","paymentReference":"LSK-1749596753627-d357uktq4","paymentDeadline":"2025-06-11T23:05:53.627Z"},"amounts":{"base":{"lsk":100,"ngn":70293.99809000001,"usd":45.4786,"eur":39.7943,"gbp":33.6879},"fees":{"percentage":1.5,"lsk":1.5,"ngn":1054.4099713500002,"usd":0.682179,"eur":0.5969145,"gbp":0.5053185},"total":{"lsk":101.5,"ngn":71348.40806135001,"usd":46.160779,"eur":40.3912145,"gbp":34.1932185}},"currentRates":{"usd":0.454786,"eur":0.397943,"gbp":0.336879,"ngn":702.9399809,"usd_to_ngn_rate":1545.65},"paymentInstructions":{"amount":71348.40806135001,"bankDetails":{"accountName":"Lisk Exchange","accountNumber":"0123456789","bankName":"Access Bank"},"reference":"LSK-1749596753627-d357uktq4","deadline":"2025-06-11T23:05:53.627Z","instructions":["Make payment to the bank account details below","Use the payment reference provided","Payment must be completed within 24 hours","Keep your payment receipt for verification"]}}}a@a:~/lssend$ 














a@a:~/lssend$ curl -X GET http://localhost:5000/api/transactions/my-transactions \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8"
{"status":"success","data":{"transactions":[{"bankDetails":{"accountName":"Lisk Exchange","accountNumber":"0123456789","bankName":"Access Bank"},"fees":{"percentage":1.5,"lsk":1.5,"ngn":1054.4099713500002,"usd":0.682179,"eur":0.5969145,"gbp":0.5053185},"_id":"6848ba510d3d457848a46b93","userId":"6848a2a65b6fe23342b80d85","liskAmount":101.5,"nairaAmount":71348.40806135001,"liskAddress":"lskd8y4kxutncd97hwqfn7yz4bw7js2qgswqgswqg","paymentMethod":"bank_transfer","status":"pending_payment","paymentReference":"LSK-1749596753627-d357uktq4","paymentDeadline":"2025-06-11T23:05:53.627Z","createdAt":"2025-06-10T23:05:53.640Z","updatedAt":"2025-06-10T23:05:53.640Z","__v":0},{"bankDetails":{"accountName":"Lisk Exchange","accountNumber":"0123456789","bankName":"Access Bank"},"fees":{"percentage":1.5,"lsk":1.5,"ngn":1057.19480628,"usd":0.683994,"eur":0.5984820000000001,"gbp":0.5065605},"_id":"6848b9ced1d0c39487fda71b","userId":"6848a2a65b6fe23342b80d85","liskAmount":101.5,"nairaAmount":71536.84855827999,"liskAddress":"lskd8y4kxutncd97hwqfn7yz4bw7js2qgswqgswqg","paymentMethod":"bank_transfer","status":"pending_payment","paymentReference":"LSK-1749596622729-xjbsw78j7","paymentDeadline":"2025-06-11T23:03:42.729Z","createdAt":"2025-06-10T23:03:42.748Z","updatedAt":"2025-06-10T23:03:42.748Z","__v":0},{"bankDetails":{"accountName":"","accountNumber":"","bankName":""},"fees":{"percentage":1.5,"lsk":1.5,"ngn":1056.9138068700001,"usd":0.6837945000000001,"eur":0.5983364999999999,"gbp":0.5064105},"_id":"6848b8fcf68089011d129665","userId":"6848a2a65b6fe23342b80d85","liskAmount":101.5,"nairaAmount":71517.83426487,"liskAddress":"lskd8y4kxutncd97hwqfn7yz4bw7js2qgswqgswqg","paymentMethod":"bank_transfer","status":"pending_payment","paymentReference":"LSK-1749596412011-txryl251j","paymentDeadline":"2025-06-11T23:00:12.011Z","createdAt":"2025-06-10T23:00:12.028Z","updatedAt":"2025-06-10T23:00:12.028Z","__v":0}],"pagination":{"total":3,"page":1,"limit":10,"pages":1}}}a@a:~/lssend$ 













a@a:~/lssend$ curl -X GET http://localhost:5000/api/transactions/6848ba510d3d457848a46b93 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8"
{"status":"success","data":{"transaction":{"bankDetails":{"accountName":"Lisk Exchange","accountNumber":"0123456789","bankName":"Access Bank"},"fees":{"percentage":1.5,"lsk":1.5,"ngn":1054.4099713500002,"usd":0.682179,"eur":0.5969145,"gbp":0.5053185},"_id":"6848ba510d3d457848a46b93","userId":"6848a2a65b6fe23342b80d85","liskAmount":101.5,"nairaAmount":71348.40806135001,"liskAddress":"lskd8y4kxutncd97hwqfn7yz4bw7js2qgswqgswqg","paymentMethod":"bank_transfer","status":"pending_payment","paymentReference":"LSK-1749596753627-d357uktq4","paymentDeadline":"2025-06-11T23:05:53.627Z","createdAt":"2025-06-10T23:05:53.640Z","updatedAt":"2025-06-10T23:05:53.640Z","__v":0}}}a@a:~/lssend$ 














a@a:~/lssend$ curl -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8" -F "paymentProof=@Screenshot from 2025-04-08 12-12-51.png" http://localhost:5000/api/transactions/6848ba510d3d457848a46b93/payment-proof
{"status":"success","data":{"transaction":{"bankDetails":{"accountName":"Lisk Exchange","accountNumber":"0123456789","bankName":"Access Bank"},"fees":{"percentage":1.5,"lsk":1.5,"ngn":1054.4099713500002,"usd":0.682179,"eur":0.5969145,"gbp":0.5053185},"_id":"6848ba510d3d457848a46b93","userId":"6848a2a65b6fe23342b80d85","liskAmount":101.5,"nairaAmount":71348.40806135001,"liskAddress":"lskd8y4kxutncd97hwqfn7yz4bw7js2qgswqgswqg","paymentMethod":"bank_transfer","status":"pending_payment","paymentReference":"LSK-1749596753627-d357uktq4","paymentDeadline":"2025-06-11T23:05:53.627Z","createdAt":"2025-06-10T23:05:53.640Z","updatedAt":"2025-06-10T23:25:42.962Z","__v":0,"paymentProof":"https://res.cloudinary.com/dzzvvkwqa/image/upload/v1749597941/payment-proofs/1749597940235-Screenshot%20from%202025-04-08%2012-12-51.png.png"},"paymentProof":{"url":"https://res.cloudinary.com/dzzvvkwqa/image/upload/v1749597941/payment-proofs/1749597940235-Screenshot%20from%202025-04-08%2012-12-51.png.png","uploadedAt":"2025-06-10T23:25:43.961Z"}}}a@a:~/lssend$ 














a@a:~/lssend$ curl -X POST   -H "Content-Type: application/json"   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDhhMmE2NWI2ZmUyMzM0MmI4MGQ4NSIsImlhdCI6MTc0OTU5NTk2MiwiZXhwIjoxNzUwMjAwNzYyfQ.rWQK1YD7E0vDM84tq1Vh-0u3KISrRokCZLImXlNxGu8"   -d '{
    "liskAmount": 100,
    "bankDetails": {
      "accountName": "John Doe",
      "accountNumber": "1234567890",
      "bankName": "Access Bank",
      "branchCode": "123",
  }'   http://localhost:5000/api/transactions/sell
{"status":"success","data":{"transaction":{"id":"6848c39f1f1b327a86a85390","status":"pending_payment","paymentReference":"LSK-1749599135133-jqc0b0n2j","paymentDeadline":"2025-06-11T23:45:35.133Z"},"amounts":{"base":{"lsk":100,"ngn":70420.578732,"usd":45.5602,"eur":39.840399999999995,"gbp":33.7291},"fees":{"percentage":1.5,"lsk":1.5,"ngn":1056.30868098,"usd":0.683403,"eur":0.597606,"gbp":0.5059365},"total":{"lsk":98.5,"ngn":69364.27005102,"usd":44.876797,"eur":39.242793999999996,"gbp":33.223163500000005}},"currentRates":{"usd":0.455602,"eur":0.398404,"gbp":0.337291,"ngn":704.20578732,"usd_to_ngn_rate":1545.66},"paymentInstructions":{"amount":100,"lskAddress":"lskd8y4kxutncd97hwqfn7yz4bw7js2qgswqgswqg","reference":"LSK-1749599135133-jqc0b0n2j","deadline":"2025-06-11T23:45:35.133Z","instructions":["Send LSK to the address provided below","Use the payment reference provided","Payment must be completed within 24 hours","Keep your transaction hash for verification","Note: A fee of 1.5% will be deducted from your payment"]}}}a@a:~/lssend$ 
