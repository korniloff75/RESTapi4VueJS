'use strict';
// window.addEventListener('DOMContentLoaded', ...)
(function (d) {
	if (!window.Rotator || ['restapi.js-master.ru', 'restapi:90', 'online-obuchenie.com'].indexOf(location.host) === -1) {
		console.log("Привет плагиаторам!");
		return;
	};

	var dfr = d.createDocumentFragment(),
		area = d.querySelector('#rotator'),
		modal_ = area.querySelector('.modal_'),
		ifr = area.querySelector('iframe'),
		video = area.querySelector('.video'),
		curLink = area.querySelector('#curLink'),
		items = area.querySelector('.items'),
		actived; // defined in changeVideo

	function changeVideo(e) {
		e = e || {
			target: items.querySelector('.item')
		};
		var t = e.target.closest('.item'),
			activedOld = items.querySelector('.actived'),
			src = t.value;

		if(t === activedOld) return;

		curLink.href = curLink.textContent = src;

		activedOld && activedOld.classList.remove('actived');
		actived = t;
		// console.log('actived = ', actived);
		actived.classList.add('actived');
		var newIfr = d.createElement('iframe');
		newIfr.frameBorder = 0;
		newIfr.allowFullscreen = true;
		newIfr.width = 640;
		newIfr.height = 360;
		newIfr.src = src;

		video.innerHTML = '';
		video.appendChild(newIfr);

		// console.log('curLink = ', curLink);
		return newIfr;
	}


	function closeModal(e) {
		e.stopPropagation();
		var t = e.target;

		if (
			!t.closest('.close, .modal_-backdrop')
			&& e.keyCode !== 27
		) return;

		ifr = ifr && ifr.remove();
		// console.log(ifr);
		modal_.hidden = 1;
		modal_.style.display = 'none';
		d.body.style.overflow = '';
	}

	d.addEventListener('keyup', closeModal);
	area.addEventListener('click', closeModal);
	area.querySelector('.close').addEventListener('click', closeModal);

	Object.keys(Rotator).forEach(btn => {
		area.querySelector('#' + btn).addEventListener('click', e => {
			// console.log(ifr);

			var base = Rotator[btn];
			items.innerHTML = '';

			Object.keys(base).forEach(i => {
				var o = d.createElement('div');
				o.className = 'item';
				o.value = base[i];
				o.textContent = i;
				dfr.appendChild(o);
			});

			items.appendChild(dfr);

			ifr = changeVideo();
			modal_.hidden = 0;
			modal_.style.display = 'flex';
			d.body.style.overflow = 'hidden';
		});

	});

	items.addEventListener('click', e => {
		ifr = changeVideo(e);
	});
})(document);