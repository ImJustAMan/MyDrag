/*init{
	draged: el,
	scroll: {
		bar: el,
		page: el,
		dir: "x" || "y",
		wheelScroll: true || false
	},
	clone: true || false,
	range: {
		left: num,
		right: num,
		top: num,
		bottom: num
	} || el
}*/
	class MyDrag {
		constructor (init) {
		Object.assign(this,init);
		this.disX = this.disY = 0;
		if (this.scroll) {
			this.scroll.wheelScroll = this.scroll.wheelScroll || false;
			this.dir = (this.dir || "Y").toUpperCase();
			this.draged = this.scroll.bar;
			this.range = this.draged.offsetParent;
			if (this.dir == "X") {
				this.forBar = this.scroll.page.offsetWidth / this.scroll.page.parentNode.clientWidth;
				if(this.range.clientWidth / this.forBar > this.range.clientWidth) {
					this.draged.style.width = this.range.clientWidth + 'px';
					this.range.style.display = 'none';
				}else {
					this.draged.style.width = this.range.clientWidth / this.forBar + 'px';
				}
				this.forScroll = (this.scroll.page.offsetWidth - this.scroll.page.parentNode.clientWidth) / (this.range.clientWidth - this.draged.offsetWidth);
			}else if (this.dir == "Y") {
				this.forBar = this.scroll.page.offsetHeight / this.scroll.page.parentNode.clientHeight;
				if(this.range.clientHeight / this.forBar > this.range.clientHeight) {
					this.draged.style.height = this.range.clientHeight + 'px';
					this.range.style.display = 'none';
				}else {
					this.draged.style.height = this.range.clientHeight / this.forBar + 'px';
				}
				this.forScroll = (this.scroll.page.offsetHeight - this.scroll.page.parentNode.clientHeight) / (this.range.clientHeight - this.draged.offsetHeight);
			}
			this.scroll.page.style.transform = 'translate'+this.dir+'(0)';
			this.scroll.page.style.transform += 'translateZ(0)';
			if (this.scroll.wheelScroll) {
				this.wheelEv();
			}
		}
		if (this.range) {
			let range = '';
			if (this.range instanceof HTMLElement) {
				range = this.setRange(this.range);
			}else {
				range = this.range;
			}
			this.around = {
				right: range.right - this.draged.offsetWidth,
				left: range.left,
				top: range.top,
				bottom: range.bottom - this.draged.offsetHeight
			};
		}
		this.down();
		this.event = {};
	}
	down () {
		const THIS = this;
		this.draged.addEventListener('mousedown',function (e) {
			THIS.disX = e.clientX - THIS.draged.offsetLeft;
			THIS.disY = e.clientY - THIS.draged.offsetTop;
			if (THIS.clone) {
				THIS.cloneChild = THIS.draged.cloneNode(true);
				THIS.draged.parentNode.appendChild(THIS.cloneChild);
				THIS.draged.style.opacity = .4;
			}
			function move(e) {
				THIS.move(e);
			}
			function up() {
				THIS.up(move,up);
			}
			document.addEventListener('mousemove',move);
			document.addEventListener('mouseup',up);
			e.preventDefault();
			THIS.trigger('dragStart');
		})
	}
	move (e) {
		let position = {
			left : e.clientX - this.disX + 'px',
			top : e.clientY - this.disY + 'px'
		};
		this.change(position);
		this.trigger ('draging');
	}
	up (move,up) {
		document.removeEventListener('mousemove',move);
		document.removeEventListener('mouseup',up);
		this.trigger ('dragEnd');
		if (this.clone) {
			this.draged.parentNode.removeChild(this.cloneChild);
			this.draged.style.opacity = 1;
		}
	}
	setPos (attrs) {
		Object.assign(this.draged.style,attrs);
	}
	setRange (el) {
		return {
			right: el.clientWidth,
			left: 0,
			top: 0,
			bottom: el.clientHeight
		};
	}
	wheel (el,up,down) {
		el.addEventListener('mousewheel',function (e) {
			if (e.wheelDelta > 0) {
				up&&up();
			}else {
				down&&down();
			}
		});
		el.addEventListener('DOMScroll',function (e) {
			if (e.details > 0) {
				down&&down();
			}else {
				up&&up();
			}
		});
	}
	wheelEv () {
		const THIS = this;
		let position = {
			left : parseFloat(getComputedStyle(this.draged).left),
			top : parseFloat(getComputedStyle(this.draged).top)
		};
		this.wheel(this.scroll.page.parentNode,up,down);
		function up() {
			position.left = parseFloat(position.left) - 10;
			position.top = parseFloat(position.top) - 10;
			THIS.change(position);
		}
		function down() {
			position.left = parseFloat(position.left) + 10;
			position.top = parseFloat(position.top) + 10;
			THIS.change(position);
		}
	}
	change(position) {
		if (this.range) {
			if (parseInt(position.left) > this.around.right) {
				position.left = this.around.right + 'px';
			}else if (parseInt(position.left) < this.around.left) {
				position.left = this.around.left + 'px';
			}else {
				position.left = parseFloat(position.left) + 'px';
			}
			if (parseInt(position.top) > this.around.bottom) {
				position.top = this.around.bottom + 'px';
			}else if (parseInt(position.top) < this.around.top) {
				position.top = this.around.top + 'px';
			}else {
				position.top = parseFloat(position.top) + 'px';
			}
		}
		if (this.scroll) {
			if (this.dir == "X") {
				this.scroll.page.style.transform = 'translate' + this.dir + '('+ -parseFloat(position.left) * this.forScroll+'px)';
			}else if (this.dir == "Y") {
				this.scroll.page.style.transform = 'translate' + this.dir + '('+ -parseFloat(position.top) * this.forScroll+'px)';
			}
		}
		this.setPos(position);
	}
	addEV (eventName,fn) {
		this.event[eventName] = this.event[eventName]||[];
		for (let i of this.event[eventName]) {
			if (fn == i) {
				return;
			}
		}
		this.event[eventName].push(fn);
	}
	trigger (eventName) {
		if(this.event[eventName]){
			this.event[eventName].forEach((item)=>{
				item.call(this);
			})
		}
	}
}