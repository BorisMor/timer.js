/**
 * Создание таймера для Angular.js
 *
 *  timerService.newTimer(<time>) - создать таймер. Если время не указано то время берется из config.timeWait
 *  start(<time>) - запустить таймер
 *  stop() - остановить таймер
 *  getTime() - количество секунд
 *
 *  onInit - при инцилизации таймера
 *  onRun - при выполнение шага таймера
 *  onEnd - при окончание работы таймера
 *  onChange - при любых измениях таймера
 *
 * Пример использования:
 * ================================================================
 *
 *   $scope.waitTimeoutSms = timerService.newTimer();
 *   $scope.waitTimeoutSms.onChange = function(sec, format){
 *      $scope.secNextSms = sec;
 *      if(!$scope.$$phase) {
 *          $scope.$digest();
 *      }
 *   }
 * ================================================================
 *
 *   $scope.secNextSms = config.timeWait;
 *
 *   $scope.waitTimeoutSms = timerService.newTimer();
 *
 *   $scope.waitTimeoutSms.onRun = function(sec){
 *      $scope.secNextSms = sec;
 *      $scope.$digest();
 *   };
 *
 *   $scope.waitTimeoutSms.onEnd = function(sec){
 *      $scope.secNextSms = 0;
 *      $scope.$digest();
 *   };
 */

define(['app'], function (app) {

    'use strict';

    app.factory('timerService', [
        function () {

            // Клсс отвечающий за таймер
            var _classTimer = function(seconds) {
                var self = this;

                // Значение ментше которого делаем stop
                var _valueMinStop = 1;

                // общее количество секунд
                var _allTime = seconds;

                // текущеаа время
                var _cutTimer = _allTime;

                // id интервала
                var _intervalId = undefined;

                // Переиницилизируем время таймера
                function reinitiTimer(newSeconds) {
                    if(typeof newSeconds !=="undefined") {
                        _allTime = newSeconds;
                    }

                    _cutTimer = _allTime;
                }

                /**
                 * Вернет сколько часов/минту/секунд еще ждать
                 * @returns {{hour: number, minute: number, sec: number}}
                 */
                function formatCurTime()
                {
                    var res = {
                        hour: 0,
                        minute: 0,
                        sec: 0
                    };

                    var t = _cutTimer;
                    res.hour =  Math.floor(t / 3600);
                    t -= res.hour * 3600;
                    res.minute = Math.floor(t / 60);
                    t -= res.minute * 60;
                    res.sec = t;

                    return res;
                }

                // Обработка таймера
                function workTimer(){
                    _cutTimer--;

                    // Время закончилось
                    if(_cutTimer < _valueMinStop){
                        self.stop();
                        self.onEnd();
                    }
                    else{
                        self.onRun(_cutTimer);
                    }

                    var format = formatCurTime();
                    self.onChange(_cutTimer, format);
                }

                /**
                 * Сколько секунд осталось
                 * @returns {*}
                 */
                this.getTime = function(){
                    return _cutTimer
                };

                /**
                 * Запустить таймер
                 */
                this.start = function(newTime){
                    if(typeof _intervalId !== "undefined") {
                        self.stop();
                    }

                    reinitiTimer(newTime);


                    var format = formatCurTime();
                    self.onInit(_cutTimer, format);
                    self.onChange(_cutTimer, format);

                    _intervalId = window.setInterval(workTimer, 1000);
                };

                /**
                 * Остановить таймер
                 */
                this.stop = function(){
                    window.clearInterval(_intervalId);
                    _intervalId = undefined;
                };

                // --- события ---
                // при любых изменениях
                this.onChange = function(){};
                // инициализация перед запуском
                this.onInit = function(){};
                // Вызов на секунде работы
                this.onRun = function(){};
                // Окончание работы
                this.onEnd = function(){};
            };

            var Content = function() {
                this.newTimer = function(newSeconds){
                    newSeconds = (typeof newSeconds == "undefined") ? 30 : newSeconds;
                    return new _classTimer(newSeconds);
                }
            };

            return new Content();
        }
    ]);
});