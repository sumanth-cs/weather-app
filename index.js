const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
     return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=hassan&units=metric&appid=20816d2ba843292e85f5cb5d09b64b1c')
            .on('data',  (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]; 
                const realTimeData = arrData.map((val)=> replaceVal(homeFile,val)).join("");
                res.write(realTimeData);
            })
            .on('end',  (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end()
            });
    }
})

server.listen(8080,'127.0.0.1');