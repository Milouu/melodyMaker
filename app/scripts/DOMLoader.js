class DOMLoader
{   
    constructor(sourceClass, loaderClass, loaderUndisplayClass) 
    {
        this.loader = document.querySelector('.' + loaderClass)
        this.loaderUndisplay = loaderUndisplayClass
        this.sources = document.querySelectorAll('.' + sourceClass)

        this.load()
    }
    load()
    {
        let loaded = -1

        window.addEventListener('DOMContentLoaded', () => {
            loaded ++
            loaded == this.sources.length ? this.init() : false
        })

        for(const source of this.sources) 
        {
            const $newImg = document.createElement('img')

            $newImg.addEventListener('load', () => 
            {
                loaded++
                loaded == this.sources.length ? this.init() : false
            })
            $newImg.src = source.src
        }
    }
    init()
    {
        // for(let i = 0; i < this.elements.length; i++) {
        //     console.log(this.elements[i])
        //     const element = document.querySelector('.' + this.elements[i])
        //     element.classList.add(this.states[i])
        // }
        this.loader.classList.add(this.loaderUndisplay)

        new Rooter()
    }
}