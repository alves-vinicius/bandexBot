//classe principal do sistema
//const TelegramBot = require('node-telegram-bot-api')
//const moment = require('moment')
//const winston = require('winston')
//const secrets = require('@cloudreach/docker-secrets')
alert('A');
//const axios = require('axios');
//alert('B');
//const Q = require("q");
//alert('C');
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
//notifications.setup((text, id) => {
//  bot.sendMessage(id, text, {
//    parse_mode: 'Markdown',
//    reply_markup: {
//      inline_keyboard: [
//        [
//          {
//            text: '📝 Abrir Menu',
//            callback_data: 'DUPE_INITIAL',
//          },
//        ],
//      ],
//    },
//  })
//})

//ao receber qualquer mensagem, printar o menu inicial
//bot.on('message', msg => {
//  comm = mensagens.prepare(mensagens.INITIAL)
//  bot.sendMessage(msg.chat.id, comm.text, comm.opts).catch(handleError)
//})

//interpretar respostas do teclado interativo
//bot.on('callback_query', function onCallbackQuery(callbackQuery) {
//  let action = callbackQuery.data
//  let msg = callbackQuery.message
//  let from = callbackQuery.from
//  let userid = from.id
//  let noEdit = false
//
//  //log das atividades
//  if (from.username)
//    winston.info({
//      action: action,
//      user: from.username,
//      group: msg.chat.title,
//      userid: userid,
//    })
//  else
//    winston.info({
//      action: action,
//      user: from.first_name + ' ' + from.last_name,
//      group: msg.chat.title,
//      userid: userid,
//    })
//
//  //pra voltar pro anterior sempre começa com back
//  if (action.startsWith('BACK')) {
//    action = action.split(/_(.+)/)[1] //regex para splitar apenas no primeiro "_"
//  }
//  //se for pra voltar pro anterior mas preservando a mensagem atual, é dupe
//  else if (action.startsWith('DUPE')) {
//    action = action.split(/_(.+)/)[1]
//    noEdit = true
//  }
//
//  //listagem de bandejões para almoço/janta, passamos como parametro
//  //qual dos dois é, qual a pagina da lista de bandejões e a lista toda
//  if (action.startsWith('BNDLIST')) {
//    let splitter = action.split('_')
//    let list = cardapios.getBandexList()
//    comm = mensagens.prepareForEdit(mensagens['BNDLIST'], msg, {
//      time: splitter[1],
//      page: splitter[2],
//      list: list,
//    })
//  }
//  //pedido de cardapio, obtemos no bd e passamos como parametro
//  //junto com se é almoco/janta
//  else if (action.startsWith('BNDFULL')) {
//    let splitter = action.split('_')
//    let menu = cardapios.fetch(splitter[2], splitter[1] == 'ALMOCO' ? 0 : 1)
//    comm = mensagens.prepareForEdit(mensagens['BNDFULL'], msg, {
//      menu: menu,
//      time: splitter[1],
//    })
//  } else if (action == 'NOTIFICATIONS') {
//    comm = mensagens.prepareForEdit(mensagens[action], msg, {
//      paused: notifications.isPaused(userid),
//    })
//  }
//  //ligar/desligar notificações no geral
//  else if (action == 'NOTIPAUSE') {
//    notifications.togglePause(userid)
//    comm = mensagens.prepareForEdit(mensagens[action], msg, {
//      paused: notifications.isPaused(userid),
//    })
//  }
//  //listar bandejões e se eles notificam ou não
//  //parametros: almoco/janta e pagina
//  else if (action.startsWith('NOTILIST')) {
//    let splitter = action.split('_')
//    let list = cardapios.getBandexList()
//    let times = notifications.getTimes(userid)
//    notifications.fillListWithNotifications(userid, list, splitter[1])
//    comm = mensagens.prepareForEdit(mensagens['NOTILIST'], msg, {
//      list: list,
//      time: splitter[1],
//      page: splitter[2],
//      times: times,
//    })
//  }
//  //ligar/desligar notificações de um bandejão
//  //parametros: almoco/janta, pagina e bandex
//  //realiza a ação e redireciona pro NOTILIST adequado
//  else if (action.startsWith('NOTITOGGLE')) {
//    let splitter = action.split('_')
//    notifications.toggleNotifications(userid, splitter[1], splitter[3])
//    let list = cardapios.getBandexList()
//    notifications.fillListWithNotifications(userid, list, splitter[1])
//    let times = notifications.getTimes(userid)
//    comm = mensagens.prepareForEdit(mensagens['NOTILIST'], msg, {
//      list: list,
//      time: splitter[1],
//      page: splitter[2],
//      times: times,
//    })
//  }
//  //exibir horários de notificação atuais
//  else if (action.startsWith('NOTITIMES')) {
//    let times = notifications.getTimes(userid)
//    comm = mensagens.prepareForEdit(mensagens['NOTITIMES'], msg, {
//      times: times,
//    })
//  }
//  //gerenciar horários pra notificação
//  else if (action.startsWith('NOTITIMEPICKER')) {
//    let splitter = action.split('_')
//    comm = mensagens.prepareForEdit(mensagens['NOTITIMEPICKER'], msg, {
//      time: splitter[1],
//    })
//  } else if (action.startsWith('NOTITIMECHOOSE')) {
//    let splitter = action.split('_')
//    notifications.setTime(userid, splitter[1] == 'JANTA', splitter[2])
//    let times = notifications.getTimes(userid)
//    comm = mensagens.prepareForEdit(mensagens['NOTITIMES'], msg, {
//      times: times,
//    })
//  } else {
//    comm = mensagens.prepareForEdit(mensagens[action], msg)
//  }
//
//  if (noEdit)
//    bot.sendMessage(msg.chat.id, comm.text, comm.opts).catch(handleError)
//  else bot.editMessageText(comm.text, comm.opts).catch(handleError)
//})
//
////tratar erros
//bot.on('polling_error', handleError)
//
//function handleError(error) {
//  if (error.response && error.response.body)
//    console.log(error.response.body.description)
//  else console.log(error)
//}
//
