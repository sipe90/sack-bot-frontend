type MessageHandler = (msg: string) => void

class WS {

    private url: string
    private instance: WebSocket | null = null
    private messageHandler: MessageHandler
    private retryTimeout: number

    public connected: boolean

    constructor(url: string, messageHandler?: MessageHandler) {
        this.url = url
        this.connected = false
        this.messageHandler = messageHandler ?? (() => undefined)
        this.retryTimeout = 0
    }

    public setMessageHandler(messageHandler: MessageHandler) {
        this.messageHandler = messageHandler
        if (this.instance) {
            this.instance.onmessage = (ev) => {
                this.messageHandler(ev.data)
            }
        }
    }

    public connect() {
        this.connected = true
        setTimeout(() => {
            const ws = new WebSocket(this.url)

            ws.onopen = () => {
                this.retryTimeout = 0
            }

            ws.onmessage = (ev) => {
                this.messageHandler(ev.data)
            }

            ws.onclose = (ev) => {
                if (!ev.wasClean) {
                    console.error(`WebSocket connection closed unexpectedly: (${ev.code}) ${ev.reason}`)
                    this.increaseTimeout()
                    this.connect()
                }
            }

            this.instance = ws
        }, this.retryTimeout)
    }

    public close() {
        this.instance?.close()
    }

    private increaseTimeout() {
        this.retryTimeout = Math.max(Math.min(this.retryTimeout * 2, 30000), 250)
    }
}

export default WS
