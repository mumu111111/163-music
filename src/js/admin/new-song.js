{
    let view=  {
        el: '.newSong',
        template: `
            <span>新增歌曲</span>
        `,
        render(data){
            $(this.el).html(this.template)//渲染到页面
        }
        

    }
    let model={
      data:{}
    }
    let controller={
        init(view, model){
            this.view= view;
            this.model= model;
            this.view.render(this.model.data);
            this.active() //默认激活状态
           
            window.eventHub.on('select', (data)=>{
               
                this.deactive()
            })
            
            window.eventHub.on('new',(data)=>{
                this.active()//新建歌曲
            })
            
            $(this.view.el).on('click', ()=>{
                window.eventHub.emit('new')
            })

        },
        active(){
            $(this.view.el).addClass('active')
        },
        deactive(){
            $(this.view.el).removeClass('active')
        }
    }
    controller.init(view, model)
}