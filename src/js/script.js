document.querySelector('#search-weather').addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const cityName = document.querySelector('#city_name').value; 
    if (!cityName) {
        return showAlert('Você precisa digitar uma cidade ...'); 
    }

    const apiKey = 'dba64f2b98628800a7b3708f1e458361'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const results = await fetch(apiUrl); 
        const json = await results.json(); 

        if (json.cod === 200) {
            showInfo({
                city: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                description: json.weather[0].description,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed, 
                humidity: json.main.humidity, 
            });
        } else {
            showAlert('Cidade não encontrada!'); 
        }
    } catch (error) {
        showAlert(''); 
        console.error(error); 
    }
});

function showInfo(json) {
    showAlert(''); 
    document.querySelector("#weather").classList.add('show');
    
    document.querySelector(`#title`).innerHTML = `${json.city}, ${json.country}`;
    document.querySelector(`#temp_value`).innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)} km/h`; 
}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg; 
}

function calcularIMC_TMB() {
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const idade = parseInt(document.getElementById('idade').value);
    const sexo = document.getElementById('sexo').value;

    if (peso > 0 && altura > 0 && idade > 0 && sexo) {

        const imc = (peso / (altura * altura)).toFixed(2);
        let classificacao;

        if (imc < 18.5) {
            classificacao = 'Abaixo do peso';
        } else if (imc >= 18.5 && imc < 24.9) {
            classificacao = 'Peso normal';
        } else if (imc >= 25 && imc < 29.9) {
            classificacao = 'Sobrepeso';
        } else {
            classificacao = 'Obesidade';
        }

        let tmb;
        if (sexo === 'male') {
            tmb = (88.362 + (13.397 * peso) + (4.799 * (altura * 100)) - (5.677 * idade)).toFixed(2); 
        } else {
            tmb = (447.593 + (9.247 * peso) + (3.098 * (altura * 100)) - (4.330 * idade)).toFixed(2); 
        }

        document.getElementById('resultado').innerText = `Seu IMC é ${imc} - ${classificacao}\nSua TMB é ${tmb} kcal/dia`;
    } else {
        document.getElementById('resultado').innerText = 'Por favor, insira valores válidos.';
    }
}

const timezones = {
    'Acre': 'America/Rio_Branco',
    'Alagoas': 'America/Maceio',
    'Amapá': 'America/Belem',
    'Amazonas': 'America/Manaus',
    'Bahia': 'America/Bahia',
    'Ceará': 'America/Fortaleza',
    'Distrito Federal': 'America/Sao_Paulo',
    'Espírito Santo': 'America/Sao_Paulo',
    'Goiás': 'America/Sao_Paulo',
    'Maranhão': 'America/Fortaleza',
    'Mato Grosso': 'America/Cuiaba',
    'Mato Grosso do Sul': 'America/Campo_Grande',
    'Minas Gerais': 'America/Sao_Paulo',
    'Pará': 'America/Belem',
    'Paraíba': 'America/Fortaleza',
    'Paraná': 'America/Sao_Paulo',
    'Pernambuco': 'America/Recife',
    'Piauí': 'America/Fortaleza',
    'Rio de Janeiro': 'America/Sao_Paulo',
    'Rio Grande do Norte': 'America/Fortaleza',
    'Rio Grande do Sul': 'America/Sao_Paulo',
    'Rondônia': 'America/Porto_Velho',
    'Roraima': 'America/Boa_Vista',
    'Santa Catarina': 'America/Sao_Paulo',
    'São Paulo': 'America/Sao_Paulo',
    'Sergipe': 'America/Maceio',
    'Tocantins': 'America/Araguaina'
};

async function buscarHora() {
    const estadoInput = document.getElementById('city_name').value.trim();
    
  

    const estado = Object.keys(timezones).find(key => key.toLowerCase() === estadoInput.toLowerCase());
    
 

    const timezone = timezones[estado];

    try {
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
        
      

        const data = await response.json();
        const dateTime = new Date(data.datetime);
        const formattedTime = dateTime.toLocaleTimeString('pt-BR', { hour12: false });
        
    
        document.getElementById('horario').textContent = formattedTime;
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}
