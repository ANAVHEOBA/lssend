a@a:~/lssend$ curl -X GET http://localhost:5000/api/crypto/price
{"status":"success","data":{"prices":{"usd":0.45472,"usd_market_cap":86302752.97263578,"usd_24h_vol":6339165.316658654,"usd_24h_change":0.9428339523047117,"eur":0.397871,"eur_market_cap":75513096.49324392,"eur_24h_vol":5546636.5296046715,"eur_24h_change":0.892674675928839,"gbp":0.336795,"gbp_market_cap":63921342.22772434,"gbp_24h_vol":4695191.540097666,"gbp_24h_change":1.3306920254554808,"ngn":702.8243264,"usd_to_ngn_rate":1545.62}}}a@a:~/lssend$ 






a@a:~/lssend$ curl -X GET http://localhost:5000/api/crypto/history
{"status":"success","data":{"prices":[{"_id":"6848a6bbbcfe6430d4d40d50","symbol":"LSK","usd":0.454387,"eur":0.397777,"gbp":0.336537,"usd_market_cap":86129397.69900943,"usd_24h_vol":6427135.409642662,"usd_24h_change":0.9639516611949797,"timestamp":"2025-06-10T21:42:19.521Z","createdAt":"2025-06-10T21:42:19.535Z","updatedAt":"2025-06-10T21:42:19.535Z","__v":0}]}}a@a:~/lssend$ 