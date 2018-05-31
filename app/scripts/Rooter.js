class Rooter 
{
    constructor() 
    {
        this.$callToAction = document.querySelector('.callToAction')

        // Homepage
        this.$callToAction.addEventListener('click', () => 
        {
            if(this.$callToAction.classList.contains('callToAction--home'))
            {
                canvas.stop()
                new ViewsTransition('calibration', 'domView', 'domView', ['transitionOut', 'track--animate', 'loop--animate', 'drum--animate', 'header__title--animate'], ['transitionTitle--display', 'transitionIn', 'calibrationIn', 'calibrationIn'], ['Calibration', 'MusicalCanvas'])
            }
            if(this.$callToAction.classList.contains('callToAction--calibration'))
            {
                console.log('DASHBOARD')
            }
        })
    }
}