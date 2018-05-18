class ViewsTransition 
{
    constructor(oldDOMView, newDOMView, transitionOutClass, transitionInClass)
    {
        this.oldDOMView = document.querySelector('.' + oldDOMView)
        this.newDOMView = document.querySelector('.' + newDOMView)
        this.$body = document.querySelector('body')

        this.oldDOMView.classList.add(transitionOutClass)
        setTimeout(() => 
        { 
            this.oldDOMView.remove() 

            this.$body.appendChild(this.newDOMView)
            setTimeout(() => { this.newDOMView.classList.add(transitionInClass) }, 20)
        }, 300)
    }
}