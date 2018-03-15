{
    let view = {
        el: '.page > main',
        template: `
            <h1>新建歌曲</h1>
            <form class="form">
            <div class="row">
                <label>
                    歌名
                </label>
                <input type="text" name="name" value="__name__">
            </div>
            <div class="row">
                <label>
                    歌手
                </label>
                <input type="text" name="singer" value="__singer__">
            </div>
            <div class="row">
                <label>
                    外链
                </label>
                <input type="text" name="url" value="__url__">
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data={}){//如果为空 默认{}
            let placeholer= ['name', 'url', 'singer', 'id']
            let html= this.template
            placeholer.map((string)=>{
                html=  html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        }
    }

    let model = {

    }

    
    let controller = {
        init(view, model){
            this.view= view
            this.model= model
            this.view.render(this.model.data)

            window.eventHub.on('upload', (data)=>{
                this.model.data= data
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
    
}