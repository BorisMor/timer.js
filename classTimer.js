// Клсс отвечающий за таймер
var _classTimer = function(seconds) {
    var self = this;

    // Значение меньше которого делаем stop
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
