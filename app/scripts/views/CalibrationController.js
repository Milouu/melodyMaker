class CalibrationController
{
    constructor()
    {   
        this.box1 = document.querySelector('.box-1')
        this.end = false 
        this.button = document.querySelector('.newViewButton')
        this.button.addEventListener('click', () => 
        {
            console.log('click')
        })
    }
    add()
    {
        new Calibration()
        const timeline = new TimelineMax({onComplete: this.instances, onCompleteScope: this})

        timeline 
            .from(".transitionTitle", 1, {opacity: 0})
            .to(".transitionTitle", 1, {opacity: 0})

            .to(".calibrationContainer", 1, {opacity: 1, scale: 1})
    }
    remove()
    {
        const timeline = new TimelineMax({onComplete: this.ending, onCompleteScope: this })
        
        timeline
        .to(".calibrationContainer", 0.3, {opacity: 0, scale: 1})
    }
    instances()
    {
    }
    ending()
    {
        this.end = true
    }
    endRemove()
    {
        return this.end
    }
}