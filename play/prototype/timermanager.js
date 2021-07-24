function TimerManager(){
	this.timers = [];
	
	this.Update = function(dt){
		this.timers.forEach(function(t){
			t.timeLeft -= dt;
			if(t.timeLeft < 0){
				t.callback(t.callback, t.timeLeft);
			}
		});
		this.timers = this.timers.filter(t => t.timeLeft > 0);
	}
	
	this.Set = function(c, t){
		this.timers.push({
			callback: c,
			timeLeft: t
		});
	}
}