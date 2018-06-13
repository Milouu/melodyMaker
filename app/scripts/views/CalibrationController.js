class CalibrationController
{
	constructor()
	{   
		this.box1 = document.querySelector('.box-1')
		this.end = false 
		this.button = document.querySelector('.newViewButton')
		this.calibration = undefined
	}
	add()
	{
		this.calibration = new Calibration()
		const timeline = new TimelineMax({onComplete: this.instances, onCompleteScope: this})

		timeline 
			.from(".transitionTitle", 1, {opacity: 0})
			.to(".transitionTitle", 1, {opacity: 0})
			.from(".explanations", 0.3, {scale: 0, transformOrigin: 'left top'})
			.from(".explanations__title", 0.3, {opacity:0, x: -80, transformOrigin: 'left'}, '-=0.2')
			.from(".explanations__numberContainer", 0.3, {scale: 0}, '-=0.1')
			.from(".explanations__sentence", 0.3, {opacity: 0})
			.from(".pickedColors", 0.3, {scale: 0, transformOrigin: 'left'}, '-=0.2')
			.from(".pickedColors__addCross", 0.3, {scale: 0})
	}
	remove()
	{
		console.log('remoefgnpzqeogo');
        
		const timeline = new TimelineMax({onComplete: this.ending, onCompleteScope: this })
        
		timeline
			.to(".calibrationContainer", 1, {opacity: 0})
    }
    
	instances()
	{
    }
    
	ending()
	{
		console.log('calibration ending')
		this.end = true
    }
    
	endRemove()
	{
		return this.end
    }

    getPickedColor()
    {
        return this.calibration.getPickedColor()
    }
}