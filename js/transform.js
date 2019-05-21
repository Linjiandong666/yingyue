(function(w){
	w.transformCss = function(node,name,value){
		if(!node.obj){
			node.obj = {}
		}
		if(arguments.length > 2){
			node.obj[name] = value;
			var result = '';
			for(var k in node.obj){
				switch(k){
					case 'translateX':
					case 'translateY':
					case 'translateZ':
					case 'translate':
						result += k+'('+ node.obj[k] +'px )';
						break;
					case 'scale':
					case 'scaleX':
					case 'scaleY':
						result += k+'('+ node.obj[k] +' )';
						break;
					case 'rotateX':
					case 'rotateY':
					case 'rotateZ':
					case 'rotate':
					case 'skewX':
					case 'skewY':
					case 'skew':
						result += k+'('+ node.obj[k] +'deg )';
						break;
				}
			}
			node.style.transform = result;
		}else{
			var result = ''
			if(node.obj[name] == undefined){
				if(name == 'scale' || name == 'scaleX' || name == 'scaleY'){
					result = 1;
				}else{
					result = 0;
				}
			}else{
				result = node.obj[name];
			}
			return result
		}
		
	};
	
})(window);
