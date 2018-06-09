class DOMLoader
{   
    constructor(sourceClass, loaderClass, loaderUndisplayClass) 
    {
        this.loader = document.querySelector('.' + loaderClass)
        console.log(this.loader)
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
        console.log('load')
        // for(let i = 0; i < this.elements.length; i++) {
        //     console.log(this.elements[i])
        //     const element = document.querySelector('.' + this.elements[i])
        //     element.classList.add(this.states[i])
        // }
        console.log(this.loaderUndisplay)
        this.loader.classList.add(this.loaderUndisplay)

        new ViewsController('home', true)
    }
}