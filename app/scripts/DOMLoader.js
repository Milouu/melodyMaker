class DOMLoader
{   
    constructor(arrayOfElementsClassName, arrayOfStateClassName) 
    {
        this.elements = arrayOfElementsClassName
        this.states = arrayOfStateClassName

        window.addEventListener('DOMContentLoaded', () => {
            for(let i = 0; i < this.elements.length; i++) {
                const element = document.querySelector('.' + this.elements[i])
                element.classList.add(this.states[i])
            }
        })
    }
}