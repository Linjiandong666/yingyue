(function(w){
	w.contentDrag = function (navWrap,callback){
			var navList = navWrap.firstElementChild;
			transformCss(navList,'translateZ',0.1);
			var startY = 0;
			var startX = 0;
			var eleY = 0;
			var isFirst = true;
			var s1 = 0;
			var s2 = 0;
			var t1 = 0;
			var t2 = 0;
			var tween = {
				Linear: function(t,b,c,d){ return c*t/d + b; },
				easeOut: function(t,b,c,d,s){
		        	if (s == undefined) s = 3;
		            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		        }
			};
			var timer = null;
			
			navWrap.addEventListener('touchstart',function(event){
				var touch = event.changedTouches[0];
				navList.style.transition = 'none';
				eleY = transformCss(navList,'translateY');
				startY = touch.clientY;
				startX = touch.clientX;
				s1 = eleY;
				t1 = new Date().getTime();//毫秒
				clearInterval(timer);
				isFirst = true;
				if(callback && typeof callback['start'] == 'function'){
					callback['start']();
				}
				
			});
			
			navWrap.addEventListener('touchmove',function(event){
				var touch = event.changedTouches[0];
				if(!isFirst){
					return;
				}
				var endY = touch.clientY;
				var endX = touch.clientX;
				var disY = endY - startY;
				var disX = endX - startX;
				
				if(Math.abs(disX) > Math.abs(disY)){
					isFirst = false;
					return;
				}
				
				
				var lastY = eleY + disY;
				//当滑倒边界的时候，会出现橡皮筋效果
				if(lastY > 0){
					//每一次的移动 lasY不断增大，但是系数再不断减小。也就是每一次拉的时候，走的实际距离会越小
					var scale = 0.6 - lastY/(3*document.documentElement.clientHeight);
					lastY = lastY * scale;
				}else if(lastY < document.documentElement.clientHeight - navList.offsetHeight){
					var temp = Math.abs(lastY) - Math.abs(document.documentElement.clientHeight - navList.offsetHeight);
					var scale = 0.6 - temp/(3*document.documentElement.clientHeight);
					temp = temp * scale;
					lastY = document.documentElement.clientHeight - navList.offsetHeight - temp;
				}
				transformCss(navList,'translateY',lastY);
				if(callback && typeof callback['move'] == 'function'){
					callback['move']();
				}
			});
			
			navWrap.addEventListener('touchend',function(){
				//手指离开后会有一个加速的效果/求一个速度
				s2 = transformCss(navList,'translateY');
				t2 = new Date().getTime();
				var speed = (s2 - s1) / (t2 -t1);
				var lastY = transformCss(navList,'translateY');
				lastY = lastY + speed * 100;
				var timeAll = 1;
				
//				var bezier= '';
//				
//				if(lastY > 0){
//					lastY = 0;
//					bezier = 'cubic-bezier(.13,.67,.85,1.43)';
//				}else if(lastY < document.documentElement.clientHeight - navList.offsetHeight){
//					lastY = document.documentElement.clientHeight - navList.offsetHeight;
//					bezier = 'cubic-bezier(.13,.67,.85,1.43)';
//				}
//				
//				navList.style.transition = '1s '+bezier;
//				transformCss(navList,'translateY',lastY);
				//我们得把加速的距离进行分段移动，使用tween算法进行实现
				
				var type = 'Linear';
				if(lastY > 0){
					lastY = 0;
					type = 'easeOut';
				}else if(lastY < document.documentElement.clientHeight - navList.offsetHeight){
					lastY = document.documentElement.clientHeight - navList.offsetHeight;
					type = 'easeOut';
				}
				
				TweenMove(lastY,type,timeAll);
				
				function TweenMove(lastY,type,timeAll){
					var t = 0;
					var b = transformCss(navList,'translateY');
					var c = lastY - b;
					var d = timeAll/0.02;
					
					timer = setInterval(function(){
						t++;
						if(t > d){
							clearInterval(timer);
							if(callback && typeof callback['end'] == 'function'){
								callback['end']();
							}
						}else{
							lastY = tween[type](t,b,c,d);
							transformCss(navList,'translateY',lastY);
							if(callback && typeof callback['move'] == 'function'){
								callback['move']();
							}
						}
						
					},20)
					
				}
				
				
			})
		}
})(window);
