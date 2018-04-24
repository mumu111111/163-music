{
    let view= {
        el: '.page-3',
        template: `
            <li>
            <h3>{{song.name}}</h3>
            <p>
                <svg class="icon icon-sq">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
                </svg>
                {{song.singer}}
            </p>
            <a class="playButton" href="./song.html?id={{song.id}}">
                <svg class="icon icon-play">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-17"></use>
                </svg>
            </a>
            </li>
        `,
        init(){
            this.$el= $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }

    let model= {}

    let controller= {
        init(view, model){
            this.view = view
            this.view.init()
            this.model= model
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('selectTab', (tabName)=>{
                if(tabName ==='page-3'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view, model)
}