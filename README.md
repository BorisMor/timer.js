Таймер на js c примером обертки на AngularJS 1.x

Пример для AngularJS:
<pre>
	$scope.secRun = 0;
	$scope.timeRun = {hour: 0, minute: 0, sec: 0}; // форматированое значение
	...

	// таймер на 5 минут
	$scope.waitTimeout = timerService.newTimer(300);
	$scope.waitTimeout.onChange = function(sec ,f) {
		$scope.timeRun = f;
		$scope.secRun = sec;
		if(!$scope.$$phase) {
			$scope.$digest();
		}
	};
	...

	$scope.waitTimeout.start();
</pre>