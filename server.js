const http = require('http')
const PORT = 7000


const FS = require('./lib/local')
const market = new FS('./model/market.json')
const marketBranches = new FS ('./model/marketBranches.json')
const marketProducts = new FS ('./model/marketProducts.json')
const marketWorkers = new FS('./model/marketWorkers.json')

const server = http.createServer((req, res) => {
    const route = req.url.split('/').filter(e => e != "favicon.ico")

    //get
    if (req.method == 'GET') {
        
        //get single market
        if( route[1] == 'markets' && route[2] ){
            const allMarket = market.read()
            const findMarket =  allMarket.find(e => e.id == route[2])
            if(!findMarket){
                res.writeHead( 400, {"Content-Type": "application/json"})
                return res.end(JSON.stringify({
                    message: 'There is not such a market'
                }))
            }

            res.writeHead(200, {"Content-Type" : "application/json"})
            return res.end(JSON.stringify(findMarket))
            
        }
        
        //get markets
        if(route[1] == 'markets'){
            res.writeHead(200, {"Content-Type" : "application/json"})
            return res.end(JSON.stringify(market.read()))
        }

        //get all data of a market
        if (route[1] == 'marketInfo' && route[2]) {
            const allMarket = market.read()
            const branch = marketBranches.read()
            const product = marketProducts.read()
            const workers = marketWorkers.read()

            const newArr = []
            const filterMarket = allMarket.find(e => e.id == route[2])
            const filterBranch = branch.find(e => e.id == route[2])
            const filterProduct = product.find(e => e.id == route[2])
            const filterWorkers = workers.find(e => e.id == route[2])
            let allData = {
                id: filterMarket.id,
                name: filterMarket.name,
                year: filterMarket.year,
                branches: filterBranch,
                workers: filterWorkers,
                products: filterProduct

            }
            newArr.push(allData)
            res.writeHead(200, {"Content-Type" : "application/json"})
            return res.end(JSON.stringify(newArr))
        }
        
    }

    ///post markets
    if(req.method == 'POST'){

        //creat market
        if(route[1] == 'newMarket') {
            req.on('data', chunk => {
                const allMarket = market.read()
                const { name, year } = JSON.parse(chunk)

                allMarket.push({ id: allMarket.length + 1, name, year })
                
                market.write(allMarket)
               
                
                res.end("New market is created")
            }) 
        }

        //creat branch
        if(route[1] == 'newBranch') {
            req.on('data', chunk => {
                const allBranches = marketBranches.read()
                const { name, branchId } = JSON.parse(chunk)

                allBranches.push({ id: allBranches.length + 1, name, branchId })
                
                marketBranches.write(allBranches)
                console.log(allBranches);
                
                res.end("New branch is created")
            }) 
        }
        
        ///create worker
        if(route[1] == 'newWorker') {
            req.on('data', chunk => {
                const allWorkers = marketWorkers.read()
                const { name, workType } = JSON.parse(chunk)

                allWorkers.push({ id: allWorkers.length + 1, name, workType })
                
                marketWorkers.write(allWorkers)
                
                res.end("New worker is created")
            }) 
        }

        ///creat product
        if(route[1] == 'newProduct') {
            req.on('data', chunk => {
                const allProduct = marketProducts.read()
                const { name, count } = JSON.parse(chunk)

                allProduct.push({ id: allProduct.length + 1, name, count })
                
                marketProducts.write(allProduct)
                
                res.end("New product is created")
            }) 
        }


       
    }
})
server.listen(7000, () => {
    console.log(`You are in ${PORT} port`)
})