class DOMLoader
{   
    constructor(sourceClass, arrayOfElementsClassName, arrayOfStateClassName) 
    {
        this.elements = arrayOfElementsClassName
        this.states = arrayOfStateClassName
        this.sources = document.querySelectorAll('.' + sourceClass)

        this.loader()
    }
    loader()
    {
        let loaded = -1

        window.addEventListener('DOMContentLoaded', () => {
            loaded ++
            loaded == this.sources.length ? this.init() : false
        })

        for(const source of this.sources) 
        {
            console.log("oui")
            const $newImg = document.createElement('img')

            $newImg.addEventListener('load', () => 
            {
                loaded++
                console.log(source)
                loaded == this.sources.length ? this.init() : false
            })
            $newImg.src = source.src
        }
    }
    init()
    {
        for(let i = 0; i < this.elements.length; i++) {
            const element = document.querySelector('.' + this.elements[i])
            element.classList.add(this.states[i])
        }
    }
}