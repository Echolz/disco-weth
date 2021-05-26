const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token, apitoken} = require('./config.json');
const axios = require('axios')

client.once('ready', () => {
    console.log('Sinoptika e tuka!');
});


const exampleEmbed = (
    temp,
    maxTemp,
    minTemp,
    pressure,
    humidity,
    wind,
    cloudness,
    icon,
    author,
    profile,
    cityName,
    country
) => {

    let footer = minTemp <= 8 ? "Today is not good for riding a bike :(" : "Today is good for riding a bike :)";


    return new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(`Hello, ${author}`, profile)
        .setTitle(`It is ${temp}\u00B0 C in ${cityName}, ${country}`)
        .addField(`Maximum Temperature:`, `${maxTemp}\u00B0 C`, true)
        .addField(`Minimum Temperature:`, `${minTemp}\u00B0 C`, true)
        .addField(`Humidity:`, `${humidity} %`, true)
        .addField(`Wind Speed:`, `${wind} m/s`, true)
        .addField(`Pressure:`, `${pressure} hpa`, true)
        .addField(`Cloudiness:`, `${cloudness}`, true)
        .setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)
        .setFooter(footer)

}

const helpEmbed = () =>
    new Discord.MessageEmbed()
        .setColor('#0099ff')
        .addField("How to use the command: ", `Use ${prefix} sega (City Name) to get weather information. For Example 'sinoptik sega Lom'`, true)
        .setFooter('Hope ur having a nice day :)!');

const errorEmbed = () =>
    new Discord.MessageEmbed()
        .setColor('#0099ff')
        .addField(`Baluk! You are not using the chat bot properly, please refer to sinoptik help`, true);


client.on('message', message => {
        if (!message.content.startsWith(prefix)) return;

        const args = message.embeds[0].title.slice(prefix.length).split(' ');

        if (args.length <= 1) {
            message.channel.send(errorEmbed());
        }

        const command = args[1];


        if (command === 'help') {
            message.channel.send(helpEmbed());
        } else if (command === 'sega') {
            if (args.length < 3) {
                message.channel.send(errorEmbed());
            }

            sendWeatherData(args[2], message);
        }
    }
)


function sendWeatherData(city, message) {
    axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apitoken}`
        )
        .then(response => {
            let apiData = response;
            let currentTemp = Math.ceil(apiData.data.main.temp)
            let maxTemp = apiData.data.main.temp_max;
            let minTemp = apiData.data.main.temp_min;
            let humidity = apiData.data.main.humidity;
            let wind = apiData.data.wind.speed;
            let author = message.author.username;
            let profile = message.author.displayAvatarURL;
            let icon = apiData.data.weather[0].icon;
            let cityName = apiData.data.name;
            let country = apiData.data.sys.country;
            let pressure = apiData.data.main.pressure;
            let cloudness = apiData.data.weather[0].description;
            message.channel.send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country));
        }).catch(err => {
        message.channel.send(errorEmbed());
    })

}

client.login(token);
