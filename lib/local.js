const fs = require('fs')
const path = require('path')

class FS {
    constructor(dir){
        this.dir = dir
    }

    read() {
        try {
         return JSON.parse(fs.readFileSync(this.dir, { encoding: 'utf-8', flag: 'r'}))
        } catch (err) {
          return  console.log(err)
        }
        
    }

   
    write(data) {
        fs.writeFile(path.resolve(this.dir), JSON.stringify(data, null, 4), (err) => {
            if(err) throw err
            console.log("OK")
        })
    }

    
}
module.exports = FS