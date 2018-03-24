{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
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
            <div class="row">
                <label>
                    封面
                </label>
                <input name="cover" type="text" value="__cover__">
            </div>
            <div class="row">
                <label>
                    歌词
                </label>
                <textarea cols=100 rows=10 name="lyrics">__lyrics__</textarea>
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}) {//如果为空 默认{}
            let placeholer = ['name', 'url', 'singer', 'id','cover','lyrics']
            let html = this.template
            placeholer.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)

            if (data.id) {
                this.$el.prepend('<h1>编辑歌曲</h1>')
            } else {
                this.$el.prepend('<h1>新建歌曲</h1>')
            }
        },
        reset() {
            this.render({})//清除数据，data为空
        }
    }

    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            cover: '',
            lyrics: '',
            id: ''
        },
        update(data) {//更新数据库 和 mode.data数据
            // 第一个参数是 className，第二个参数是 objectId
            var song = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            // 保存到云端
            return song.save().then((reponse) => {
                Object.assign(this.data, data)
            })
        },

        create(data) {//创建数据库表
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            // song.set('id', '工作');//id 在数据库自动生成
            //save() 时真正创建data，返回一个promise对象
            return song.save().then((newSong) => {
                // console.log('objectId is ' + todo.id);

                //数据库数据给当前model--data
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })

            }, (error) => {
                console.error(error);
            });
        }

    }


    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                if (this.model.data.id) {//当前form有数据，清空
                    this.model.data = {
                        name: '',
                        singer: '',
                        url: '',
                        cover: '',
                        lyrics: '',
                        id: ''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        create() {
            let data = {}
            let needs = 'name singer url cover lyrics'.split(' ')
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })//获取输入框数据data

            this.model.create(data)//创建数据库表，return 一个promise
                .then(() => {
                    this.view.reset()
                    //this.model.data=== 'ADDR 102' ，是个引用地址， so 深拷贝
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)

                    window.eventHub.emit('create', object)
                })
        },
        update() {
            let data = {}
            let needs = 'name singer url cover lyrics'.split(' ')
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })//获取输入框数据data

            this.model.update(data)//创建数据库表，return 一个promise
                .then(() => {
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)

                    window.eventHub.emit('update', object)
                })
        },
        bindEvents() {//保存歌曲，点击提交保存

            this.view.$el.on('submit', 'form', (e) => {//事件委托
                e.preventDefault()//阻止默认提交

                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)

}