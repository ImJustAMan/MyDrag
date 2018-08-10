/*
init{
	draged: el,
	scroll: true||false,
	clone: true||false
}
*/

class MyDrag {
	constructor (init) {
		Object.assign(this,init);
		this.disX = this.disY = 0;
		this.down();
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
		})
	}
	move (e) {
		let position = {
			left : e.clientX - this.disX + 'px',
			top : e.clientY - this.disY + 'px'
		};
		this.setPos(position);
	}
	up (move,up) {
		document.removeEventListener('mousemove',move);
		document.removeEventListener('mouseup',up);
		if (this.clone) {
			this.draged.parentNode.removeChild(this.cloneChild);
			this.draged.style.opacity = 1;
		}
	}
	setPos (attrs) {
		Object.assign(this.draged.style,attrs);
	}
}