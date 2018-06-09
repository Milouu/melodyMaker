class organicButton 
{
	constructor(buttonClass, hitboxClass, expendContainer, expendClass, activeClass)
	{
		this.$button = document.querySelector('.' + buttonClass)
		this.$buttonBase = document.querySelector('.hoverButton__base')
		this.$buttonAccess = document.querySelector('.hoverButton__access')
		this.$hitbox = document.querySelector('.' + hitboxClass)
		this.$expendContainer = document.querySelector('.' + expendContainer)
		this.$expend = expendClass

		this.active = activeClass

		this.mouse = { x: 0, y: 0 }

		this.$hitbox.addEventListener('mousemove', this.setMouse.bind(this))
		this.$hitbox.addEventListener('mouseenter', this.buttonLeech.bind(this))
		this.$hitbox.addEventListener('mouseleave', this.buttonReset.bind(this))
		this.$button.addEventListener('mousedown', this.toggleClass.bind(this))
		this.$button.addEventListener('mousedown', this.buttonAction.bind(this))
	}
	setMouse(event)
	{
		this.mouse.x = (event.clientX - this.$hitbox.offsetLeft) / this.$hitbox.offsetWidth - 0.5
		this.mouse.y = (event.clientY - this.$hitbox.offsetTop) / this.$hitbox.offsetHeight - 0.5
	}
	buttonLeech()
	{
		this.loop = requestAnimationFrame(this.buttonLeech.bind(this))
		this.$button.style.transition = 'transform 150ms ease'
		this.$button.style.transform = `translateX(${ this.mouse.x * 50 }px) translateY(${ this.mouse.y * 50 }px) scale(1.1)`
	}
	buttonReset()
	{
		cancelAnimationFrame(this.loop)
		this.$button.style.transition = 'transform 500ms ease'
		this.$button.style.transform = `translateX(0px) translateY(0px)`
	}
	toggleClass()
	{
		console.log('toggle')
		this.$expenders = []

		this.$expender = document.createElement('div')
		this.$expender.classList.add(this.$expend)
		this.$expender.classList.add(this.active)

		this.$expendContainer.appendChild(this.$expender)

		this.$expenders.push(this.$expender)
        
		for(const $expender of this.$expenders){ setTimeout(() => { $expender.remove() }, 500) }
	}
	buttonAction()
	{
		let mouseUp = false

		window.addEventListener('mouseup', () => 
		{
			mouseUp = true
		})

		setTimeout(() => 
		{
			!mouseUp ? this.$buttonBase.classList.add('hoverButton__base--valid') : false
			!mouseUp ? this.$buttonAccess.classList.add('hoverButton__access--valid') : false
			// !mouseUp ? canvas.stop() : false
			// !mouseUp ? new ViewsTransition('homeView', 'newView', ['transitionOut', 'track--animate', 'loop--animate', 'drum--animate', 'header__title--animate'], ['transitionIn', 'transitionTitle--display'], ['Calibration', 'MusicalCanvas']) : console.log('dontLaunch')
		}, 1000)
	}
}
