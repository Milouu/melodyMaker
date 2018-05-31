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
                new ViewsTransition('calibration', 'homeView', 'newView', ['transitionOut', 'track--animate', 'loop--animate', 'drum--animate', 'header__title--animate'], ['transitionIn', 'transitionTitle--display'], ['Calibration', 'MusicalCanvas'])
            }
            if(this.$callToAction.classList.contains('callToAction--calibration'))
            {
                console.log('DASHBOARD')
            }
        })
    }
}