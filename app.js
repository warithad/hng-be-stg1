require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const axios = require('axios')

async function getWeather(ip){
    try {
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${ip}`)
        const city = response.data.location.name;
        const temp = response.data.current.temp_c;
        return {city, temp}
    }catch(error){
        console.error('Error fetching data from weatherapi:', error);
        throw error
    }
}

app.get('/api/hello', async (req, res)=>{
    try{
        const visitor_name = req.query.visitor_name

        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const {city, temp} = await getWeather(ip)
        const greeting = `Hello, ${visitor_name}!, the temperature is ${temp} degrees Celcius in ${city}`
       
        if (ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }
    
        if(ip == '::1'){
            ip = '127.0.0.1'
        }

        res.json({
            client_ip: ip,
            location: city,
            greeting
        })
    }catch(error){
        res.status(500).json({
          error: 'An error occurred while processing your request.'
        });
    }   
})  

app.listen(port, () =>{
    console.log(`App listening on port ${port}`)
})


module.exports = app