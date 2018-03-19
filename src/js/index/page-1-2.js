{
    let view = {
        el: 'section.songs',
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
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
                    </svg>
                  </a>
                </li>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let { songs } = data
            songs.map((song) => {
                let $li = $(this.template
                    .replace('{{song.name}}', song.name)
                    .replace('{{song.singer}}', song.singer)
                )
                this.$el.find('ol.list').append($li)
            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {//leacloud 
            var query = new AV.Query('Song')
            return query.find().then((songs) => {//所有歌曲
                this.data.songs = songs.map((song) => {//数据库歌曲赋给data
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }

    let controller = {
        init() {
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }



    }
    controller.init(view, model)
}