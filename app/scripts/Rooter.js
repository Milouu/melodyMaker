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

                // Pause video canvas
                canvas.stop()

                this.$callToAction.addEventListener('mouseup', () => { mouseUp = true })
                setTimeout(() => 
                {
                    !mouseUp ? new ViewsTransition
                    (
                        'calibration', 'domView', 'domView', 
                        ['transitionOut', 'track--animate', 'loop--animate', 'drum--animate', 'header__title--animate'], 
                        ['transitionTitle--display', 'transitionIn', 'calibrationIn', 'calibrationIn'], 
                        ['Calibration', 'MusicalCanvas']
                    ) : false
                
                }, 1000)
            }
            if(this.$callToAction.classList.contains('callToAction--calibration'))
            {
                console.log('DASHBOARD')
            }
        })
    }
}