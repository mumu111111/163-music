window.eventHub= {

    events:{//hash
        // "青岛晚报": []
        // '黄岛晚报': []
    },

    emit(eventName, data){//发布 更新数据
        for(let key in this.events){
            if(key === eventName){
              let fnList  =this.events[key]
              fnList.map((fn)=>{
                fn.call(undefined, data)
              })
            }
        }
    },

    on(eventName, fn){//订阅  先查看订阅
        if(this.events[eventName] === undefined){
            this.events[eventName] =[]
        }
        this.events[eventName].push(fn)
        
    }
    // off(){}






}