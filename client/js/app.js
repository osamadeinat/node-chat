'use strict';

var angular = this.angular;
var io = this.io;
var app = angular.module('app', []);

app.controller('ChatController', function($scope) {
        var socket = io.connect();

        $scope.messages = [];
        $scope.roster = [];
        $scope.name = '';
        $scope.text = '';
        $scope.typingMsg = false;
        $scope.userTyping = '';

        socket.on('connect', function () {
          $scope.setName();
        });

        socket.on('message', function (msg) {
          $scope.messages.push(msg);
          $scope.$apply();
        });
        
        socket.on('usr-typing', function(username) {
           $scope.typingMsg = (username != '');
           $scope.userTyping = (username.length > 0) ? username : "";
           $scope.$apply();
        });

        socket.on('roster', function (names) {
          $scope.roster = names;
          $scope.$apply();
        });
        
        $scope.typing = function typing() {
          var userTypeNow = ($scope.text != '' && $scope.name != '') ? $scope.name : 'Guest';
          var isTyping = ($scope.text != '');
          console.info('typing now .. !');
          socket.emit('typing', [userTypeNow, isTyping]);
        }

        $scope.send = function send() {
          console.log('Sending message:', $scope.text);
          socket.emit('message', $scope.text);
          $scope.text = '';
        };

        $scope.setName = function setName() {
          socket.emit('identify', $scope.name);
          console.info('Change Name');
        };
});