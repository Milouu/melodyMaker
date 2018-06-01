class Rooter 
{
    constructor() 
    {
        this.$callToAction = document.querySelector('.callToAction')

        // Homepage
        this.$callToAction.addEventListener('mousedown', () => 
        {
            if(this.$callToAction.classList.contains('callToAction--home'))
            {
                let mouseUp = false

                
                this.$callToAction.addEventListener('mouseup', () => { mouseUp = true })
                setTimeout(() => 
                {
                    // Pause video canvas
                    if(!mouseUp)
                    {
                        new ViewsTransition
                        (
                            'calibration', 'domView', 'domView', 
                            ['transitionOut', 'track--animate', 'loop--animate', 'drum--animate', 'header__title--animate'], 
                            ['transitionTitle--display', 'transitionIn', 'calibrationIn', 'calibrationIn'], 
                            ['Calibration', 'MusicalCanvas']
                        )
                        // console.log('STOPPPPPP')
                        canvas.stop()
                    }
                
                }, 1000)
            }
            if(this.$callToAction.classList.contains('callToAction--calibration'))
            {
                console.log('DASHBOARD')
            }
        })
    }
}