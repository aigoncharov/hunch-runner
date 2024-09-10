'use strict';

var _ = require('underscore'),
    Class = require('class.extend'),
    express = require('express'),
    Persistor = require('./lib/Persistor'),
    Games = require('./model/Games'),
    path = require('path'),
    TopScores = require('./model/TopScores');

module.exports = Class.extend({

   init: function() {
      var persistor = new Persistor();

      this.games = new Games(persistor);
      this.topScores = new TopScores(persistor);
   },

   startServer: function(port) {
      console.log('starting server on port %d', port);
      this.app = express();
      this.app.use(express.json());
      this.app.use(express.static(path.resolve(__dirname, '../public')))

      // this.app.use(cors());

      this.app.post('/games', function(req, res) {
         this.games.saveGame(req.body)
            .then(function() {
               res.send(JSON.stringify({ msg: 'success' }));
            })
            .catch(function(err) {
               console.log(err);
               res.send(JSON.stringify({ msg: 'error' }));
            })
            .done();
      }.bind(this));

      this.app.get('/top-scores', function(req, res) {
         var limit = 10;

         this.topScores.list(limit)
            .then(function(topScores) {
               res.send(JSON.stringify(topScores));
            })
            .done();
      }.bind(this));

      this.app.get('/*', function(req, res) {
         res.sendFile(path.resolve(__dirname, '../public/index.html'));
      }.bind(this));

      this.app.listen(port, function() {
         console.log('server listening on port %d', port);
      });
   },

});
