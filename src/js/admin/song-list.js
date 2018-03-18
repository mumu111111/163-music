{
    let view = {
        el: '.songList-container',
        template: `
            <ul class="songList">
               
            </ul>
        `,
        render(data) { //data==={songs:[]}
            let $el = $(this.el)
            $el.html(this.template)



           
            // let {songs, selectedSongId}= data
            // let liList= songs.map((song)=>{
            //     let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
            //     if(song.id=== selectedSongId){
            //         $li.addClass('active')
            //     }
            //     return $li
            // })

            let {songs, selectedSongId} = data
                  let liList = songs.map((song)=> {
                    let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
                    if(song.id === selectedSongId){ $li.addClass('active') }
                    return $li
                  })


            $el.find('ul').empty()//必须清空，要不叠加list
            liList.map((domLi) => {
                $(this.el).find('ul').append(domLi)
                console.log('List' + domLi)
            })
        },
   
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [],
            selectedSongId: undefined
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }

    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.getAllSong()
            this.bindEvents()

            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            //获取到数据， 到view
            this.EventHub()
            

        },

        getAllSong() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },

        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedSongId = songId   //当前li的id
                this.view.render(this.model.data)  //别忘了调用
                let data
                let songs= this.model.data.songs
                for(let i=0; i< songs.length; i++){
                    if(songs[i].id === songId){// id 判断对应（数据）项
                        data = songs[i] 
                        break
                    }
                }
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))// 深拷贝


            })
        },
        EventHub(){
            window.eventHub.on('create', (songData) => {//songData数据库歌信息
                //songs===['ADDR 108'] 
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', ()=>{
                this.view.clearActive()
            })

            window.eventHub.on('update', (song)=>{
                let songs= this.model.data.songs
                for(let i=0; i<　songs.length; i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
                
            })
        }
    }
    controller.init(view, model)

}