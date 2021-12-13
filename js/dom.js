/*Copyright 2021 Hussein zahaki 

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.*/

// JavaScript Document
class BackgroundFX{
	constructor(el, 
				buffer_size=40, 
				start_angle=0,
				speed_and_channelsize=5, 
				start_color_id=0xff,
				opacity_max=.3,
				opacity_min=.1,
				opacity_direction=true){
		
		this.angle = start_angle;
		this.obj=el;
		var opacity = []
		let jump_number = speed_and_channelsize
		let op_size = buffer_size //must be even number
		let start_id = start_color_id
		
		op_size = Number((op_size/2).toFixed())
		let opacity_step = (opacity_max - opacity_min) / op_size * (opacity_direction? 1: -1)
		
		for(let i=0; 
			(i < op_size) && (start_id >= 0); 
			i++, start_id-=jump_number, opacity_max+=opacity_step){
			
			opacity.push([start_id, start_id - 1, start_id - 2, opacity_max])
		}
		
		let tmp = opacity.concat()
		this.copacity = opacity.concat(tmp.reverse())
		
	}
	
	fx_apply(){
		this.copacity.push( this.copacity.shift());	
		
		let copacity = this.copacity;
		let style = "linear-gradient(" + this.angle +"deg,";
		let j = 0;
		let len = copacity.length;
		
		for (let i=0; i < len; i++) {
			style += (copacity[i].length > 3)? 'rgba(': 'rgb(';
			
			for (j=0; j < copacity[i].length - 1; j++) {
				style += copacity[i][j] + ',';
			}
			
			style += copacity[i][j] + ((i == len - 1)? ')': '),');
		}
		style += ')';
		
		this.obj.style.background = style;
	}
	
	mouse_move(self, ev, obj){
		let x = ev.clientX - obj.offsetWidth / 2;
		var y = ev.clientY - obj.offsetHeight / 2;
		let angle = 0;
		
		if(x == 0){
			angle = Math.PI * (y >= 0? 1 : -1); 
		
		}else{
			angle = Math.atan(y / x);
			if(x < 0){
				angle += Math.PI *  (y >= 0? 1 : -1);
			}
			
		}
		
		self.angle = angle * 180 / Math.PI;
	}
	
}

function menuFX(interval, 
				buffer_size=40, 
				start_angle=0,
				speed_and_channelsize=5, 
				start_color_id=0xff,
				opacity_max=.3,
				opacity_min=.1,
				opacity_direction=true){
	
	var bgproject =document.getElementById("project_section");
	let bgproject_apply= new BackgroundFX(	el=bgproject, 
										  	buffer_size=buffer_size, 
											start_angle=start_angle,
											speed_and_channelsize=speed_and_channelsize, 
											start_color_id=start_color_id,
											opacity_max=opacity_max,
											opacity_min=opacity_min,
											opacity_direction=opacity_direction);
	
	bgproject.onmousemove = (ev)=>{bgproject_apply.mouse_move(bgproject_apply, ev, bgproject)};
	setInterval(()=>{bgproject_apply.fx_apply();}, interval);
	
}

var card_interval = {};
var card_timeout = {};


function card_fx(card, step, last_width, text){
	if(card.offsetWidth > last_width){
		clearInterval(card_interval[card]);
		card.text = text;
		return ;
	}
	
	let width = card.offsetWidth + step;
	card.style.width =  width + 'px';
}

function card_move(card, ev){
	if(!(card_timeout[card] == undefined)){
		clearTimeout(card_timeout[card]);
		delete card_timeout[card];
	}
}

function card_over(card, ev, interv, delay, first_width, last_width, text){
	if(!(card_timeout[card] == undefined)){
		clearTimeout(card_timeout[card]);
		delete card_timeout[card];
	}
	
	if(!(card_interval[card] == undefined))
		return ;
	
	card.style.display = '';
	card.style.width = first_width + 'px';
	let step = (last_width - first_width) / delay * interv;
	card_interval[card] = setInterval(()=>{card_fx(card, step, last_width, text);}, interv);
}


function card_out(card, ev, delay, action=false){
	if(card_interval[card] == undefined)
		return ;
	
	if(action==true){
		delete card_interval[card];
		card.style.display = 'contents';
		card.text = '';
	}
	card_timeout[card] = setTimeout(()=>{card_out(card, ev, delay, action=true);}, delay)
	
}

function key_expand(delay, interv, first_width, last_width, out_delay = 1000, text = ''){
	var cards = $(".card-body");
	for (let card of cards){
		let child = card.querySelector('a');
		child.style.display = 'none';
		child.text='';
		
		card.onmouseover = (ev)=>{card_over(child, ev, interv, delay, first_width, last_width, text)};
		card.onmousemove = (ev)=>{card_move(child, ev)};
		card.onmouseout =   (ev)=>{card_out(child, ev, out_delay)};
	}
//	alert(cards.length);
}

function loader_skip_onclick(){
	$('body').addClass('loaded');
}

/*main start*/
var loader_skip =  document.getElementById('loader_skip');
var loader =  document.getElementById('loader');
let loading_min_time = 4000;
	
	setTimeout(()=>{
		loader_skip.style.display = "inline";
		
		loader_skip.style.left = (loader.offsetLeft + loader.offsetWidth/2 - loader_skip.offsetWidth/2) + 'px';
	
		loader_skip.style.top = (loader.offsetTop + loader.offsetHeight + loader_skip.offsetHeight) + 'px';
		
	}, loading_min_time / 2);


window.onload = () =>{
	var mediaQuery = window.matchMedia('(min-width: 460px)');
	var mediaQuery_max900 = window.matchMedia('(max-width: 900px)');
	var assets_section = $('.assets_section');
	
//	alert(loader_skip.offsetWidth
	
	setInterval(()=>{
		if(mediaQuery.matches){
			if(!$('.main_photo_2').length)
				$('#media_main').prepend('<img class="rounded-circle mr-3 ml-1 main_photo_2" src="images/logo.jpg" alt="Generic placeholder image">');
		}
		else
			$('.main_photo_2').remove();
		
		
		if(mediaQuery_max900.matches)
			assets_section.removeClass( "col-md-4" ).addClass( "row" );
		else
			if(assets_section.hasClass('row'))
				assets_section.removeClass( "row" ).addClass( "col-md-4" );
	
	}, 1000);
	
	
	
	
	
	setTimeout(function(){
		$('body').addClass('loaded');
		$('nav').css('display', '');
		$('#project_section').css('width', '98%');
		
	}, loading_min_time);
	
	menuFX(	interval=60,
		  	buffer_size=40, 
			start_angle=100,
			speed_and_channelsize=7, 
			start_color_id=255,
			opacity_max=.2,
			opacity_min=0,
			opacity_direction=true);
	
	key_expand(delay=500, 
			   interv=20, 
			   first_width=0, 
			   last_width=120, 
			   out_delay = 2000, 
			   text = 'Learn More');	
	
}




