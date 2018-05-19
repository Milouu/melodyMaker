class ViewsTransition 
{
    constructor(oldDOMView, newDOMView, transitionOutClass, transitionInClass, classInstance = null)
    {
        this.oldDOMView = document.querySelectorAll('.' + oldDOMView)
        this.$body = document.querySelector('body')
        this.$newViewContainer = document.querySelector('.calibration')
        // this.$body = document.querySelectorAll('body')
        console.log(this.$body)
        setTimeout(() => 
        {
            this.oldDOMView[0].classList.add(transitionOutClass[0])
        }, 300)

        for(let i = 1; i < this.oldDOMView.length; i++) 
        {
            this.oldDOMView[i].classList.remove(transitionOutClass[i])
        }
        setTimeout(() => 
        { 
            for(let i = 0; i < this.oldDOMView.length; i++) 
            {
                this.oldDOMView[i].remove() 
            }

            this.musicalCanvas = classInstance

            window.location.href = "http://localhost:3000/views/calibration.html"
            this.$newViewContainer = document.querySelector('.calibration')
            this.$newViewContainer.appendChild(this.newDOMView)
            this.newDOMView = document.querySelector('.' + newDOMView)
            console.log(this.newDOMView)

            setTimeout(() => { this.newDOMView.classList.add(transitionInClass) }, 20)
        }, 1000)
    }
}