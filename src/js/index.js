(function() {
    class Life {
        _NEIGHBOARDS = [
            [-1, -1], [-1,  0], [-1,  1],
            [ 0, -1],           [ 0,  1],
            [ 1, -1], [ 1,  0], [ 1,  1]
        ]

        _default = {
            rows:     40,
            cols:     40,
            size:     20,
            interval: 100,
            color:   'rgb(30, 255, 60)'
        }

        constructor (selector, options) {
            this.container     = document.querySelector(selector)
            this.options       = options ? Object.assign(this._default, options) : this._default
            this.canvas        = this.container.querySelector('#canvas')
            this.context       = this.canvas.getContext('2d')
            this.canvas.width  = this.options.cols * this.options.size
            this.canvas.height = this.options.rows * this.options.size
            this.area          = Array(this.options.rows).fill(false).map(() => Array(this.options.cols).fill(false))
            
            this.canvas.addEventListener('click', this.updatePoint.bind(this))
            this.drawLines()
        }

        updatePoint(event) {
            const x = Math.floor(event.offsetX / this.options.size)
            const y = Math.floor(event.offsetY / this.options.size)
    
            this.area[y][x] = !this.area[y][x]
            this.drawRect(x, y)
        }

        drawRect (x, y) {
            const params = {
                x: x * this.options.size,
                y: y * this.options.size,
                size:  this.options.size
            }

            this.context.fillStyle = !!this.area[y][x] ? this.options.color : 'black'
            this.context.fillRect(params.x, params.y, params.size, params.size)
        }

        drawLines () {
            const svg     = this.container.querySelector('#svg')
            const filler  = this.container.querySelector('#filler')
            const pattern = svg.querySelector('#pattern')
            const rect    = pattern.querySelector('#pattern-rect')
            const width   = this.options.cols * this.options.size
            const height  = this.options.rows * this.options.size

            svg.setAttribute('height', height)
            svg.setAttribute('width', width)

            filler.setAttribute('height', height)
            filler.setAttribute('width', width)

            pattern.setAttribute('width', this.options.size)
            pattern.setAttribute('height', this.options.size)

            rect.setAttribute('width', this.options.size)
            rect.setAttribute('height', this.options.size)
        }

        isAlive(X, Y) {
            const count = this._NEIGHBOARDS.reduce((prev, curr) => {
                let x = X - curr[0]
                let y = Y - curr[1]

                if (x === -1) x = this.options.cols - 1
                if (y === -1) y = this.options.rows - 1
                if (x === this.options.cols) x = 0
                if (y === this.options.rows) y = 0

                return prev + this.area[y][x]
            }, 0)
            
            return this.area[Y][X] ? (count === 2 || count === 3) : count === 3
        }

        fillRect(x, y) {
            this.context.fillRect(x * this.options.size, y * this.options.size, this.options.size, this.options.size);
        }

        update() {
            const this_ = this
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.area.forEach((row, y) => row.forEach((col, x) => col && this_.fillRect(x, y)));
        }

        start () {
            if (!!this.gameTick) return
    
            this.gameTick = setInterval(this_ => {
                this_.area = this_.area.map((row, y) => row.map((_, x) => this_.isAlive(x, y)))
                this_.update()
            }, this.options.interval, this)
        }

        stop () {
            clearInterval(this.gameTick)
            this.gameTick = null
        }

        toggle () {
            !!this.gameTick ? this.stop() : this.start()
        }
    }
    
    
    const CONFIG = {
        rows:     30,
        cols:     30,
        size:     10,
        interval: 100
    }
    const life = new Life('#app', CONFIG)
    const btn  = document.querySelector('#toggleBtn')

    const toggleGame = () => {
        const isGameStarted = !!life.gameTick
        btn.innerHTML = isGameStarted ? 'Start' : 'Pause'
        if (isGameStarted) {
            btn.classList.remove('btn--active')
            btn.classList.add('btn--primary')
        } else {
            btn.classList.add('btn--active')
            btn.classList.remove('btn--primary')
        }
        life.toggle()
    }

    btn.addEventListener('click', toggleGame)
})()
