'use strict';

require('dotenv').config();
const DEBUG = process.env.DEBUG === 'true';

module.exports = function(){
  const Nightmare = require('nightmare');
  const nightmare = Nightmare({
    show: DEBUG
  });

  function fillNumericPassword(password){
    ShowTeclado('0');

    var keyMap = {};
    var keys = document.querySelectorAll('.TextoTecladoVar');

    keys.forEach(function(key){
      var keyNumbers = key.querySelector('strong').innerHTML.split(' ou ');
      var keyEvent = key.querySelector('a')
        .getAttribute('onclick')
        .replace('javascript:SendValClick(\'', '')
        .replace('\')', '');

      keyNumbers.map(function(n) {
        keyMap['key_' + n] = keyEvent;
      });
    });


    password.split('')
    .map(function(n) {
      SendValClick(keyMap['key_' + n]);
    });

    return true;
  }

  function getExtract(){
    return new Promise(function(resolve, reject){
      nightmare

        .goto('https://itau.com.br')

        // type agencia && conta and submit form
        .type('#campo_agencia', process.env.AGENCIA)
        .type('#campo_conta', process.env.CONTA)
        .click('.btnSubmit')

        // wait bearer page has been loaded
        .wait('.MSGTexto8')
        .wait(2 * 1000)

        // fill password and submit form
        .evaluate(fillNumericPassword, process.env.SENHA)
        .click('#idBtnContinuar')

        // wait page
        .wait('.menusup')
        .wait(2 * 1000)

        // go to Conta Corrente page
        .click('.menusup[title="Conta Corrente"]')
        .wait('#menuarea')
        .wait(2 * 1000)

        // go to Extrato Page
        .click('#menuarea .menunivel[title="Extrato Conta Corrente"]')
        .wait('#buscaPesquisaOnline')
        .wait(2 * 1000)

        // print for debug
        .screenshot('debug/saldo.jpg')

        // extract HTML
        .evaluate(function() {
          return document.getElementById('buscaPesquisaOnline').innerHTML;
        })

        // resolve promise
        .end(function(res){
          resolve(res);
        });
    });
  }

  return {
    getExtract: getExtract
  };
}();