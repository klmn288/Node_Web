		var Body ={ /*객체활용법*/
			setColor:function (color){
			//document.querySelector('body').style.color = color;
			$('body').css('color', color);
			}, /*객체를 구분할때는 ,를 사용한다.*/
			setBackgroundColor:function (color){
				//document.querySelector('body').style.backgroundColor = color;
				$('body').css('backgroundColor', color);
			}
		}

		var Links = {
			setColor:function(color){
			// var alist = document.querySelectorAll('a');
			// var i = 0;
			// while(i < alist.length){
			// 	alist[i].style.color = color;
			// 	i = i + 1;
			// 	}
			$('a').css('color', color);
			}				
		}
		
		function nightDayHandler(self){
			var target = document.querySelector('body');				
				if(self.value ==='night'){						
					Body.setBackgroundColor('black');						
					self.value = 'day';
					Body.setColor('white');
					Links.setColor('powderblue');
				} else {
					Body.setBackgroundColor('white');					
					self.value = 'night';						
					Body.setColor('black');
					Links.setColor('black');
				}					
		}
	