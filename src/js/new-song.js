{
    let view=  {
        el: '.newSong',
        template: `
            新建歌曲
        `,
        render(data){
            $(this.el).html(this.template)//渲染到页面
        }
        

    }
    let model={
      
    }
    let controller={
        init(view, model){
            this.view= view;
            this.model= model;
            this.view.render(this.model.data);
            this.active() //激活状态
            window.eventHub.on('upload', (data)=>{
                this.active()
            })

        },
        active(){
            $(this.el).addClass('active')
        }
    }
    controller.init(view, model)
}