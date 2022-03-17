alert('1');
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('bandeco.html');
});

alert('A');
const axios = require('axios');
alert('B');
const Q = require("q");
alert('C');
//const notifications = require('./notifications')

//token é buscado via docker secrets
//let token = secrets.bot_token
//let bot = new TelegramBot(token, { polling: true })
//moment.locale('pt-br')

//logging da aplicação
//winston.exitOnError = false
//winston.add(winston.transports.File, { filename: '../storage/actions.log' })
//winston.handleExceptions(winston.transports.File, { filename: "../storage/errors.log" });

function fetchMenuFromApi(index) {
    let params = `callCount=1\n
windowName=\n
nextReverseAjaxIndex=0\n
c0-scriptName=CardapioControleDWR\n
c0-methodName=obterCardapioRestUSP\n
c0-id=0\n
c0-param0=string:${index}\n
batchId=1\n
instanceId=0\n
page=%2Frucard%2FJsp%2FcardapioSAS.jsp%3Fcodrtn%3D8\n
scriptSessionId=qEqk7ItaLEzxe*E*86DiBQhKpZl/hKILpZl-dc3rvbwx5`;
    
    //let deferred = q.defer();
    axios.post('https://uspdigital.usp.br/rucard/dwr/call/plaincall/CardapioControleDWR.obterCardapioRestUSP.dwr', params)
        .then(response => {

        let json_doidao = response.data;
        let json_normal = json_doidao.split('\n').slice(6).join('\n').replace('dwr.engine.remote.handleCallback("1","0",', "").replace("})();", "").trim().replace(");", "")
        let json_melhor = json_normal.replace(/([\[{,])([a-z][a-z0-9]+):/g, "$1\"$2\":");
        let cardapio = JSON.parse(json_melhor);

        //deferred.resolve(cardapio);
    });

    return cardapio;
    //return deferred.promise;
}

//SETUP INICIAL
//console.log('Server up!')
alert( fetchMenuFromApi( 9));
cardapios.setupCaching();
alert('2');
let menu = cardapios.fetch(splitter[2], splitter[1] == 'ALMOCO' ? 0 : 1);
alert('3');
