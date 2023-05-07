import { useEffect, useRef, useState } from 'react'

type ConnectionState = "disconnected" | "connected" | "finished"

interface Options {
    url: string | null
    messageHandler: (msg: string) => void
}

const useWebSocket = ({ url, messageHandler }: Options) => {
    const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
    const [retryTimeout, setRetryTimeOut] = useState(0)

    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        if (url && connectionState === "disconnected") {
            setTimeout(() => {
                const ws = new WebSocket(url)

                const increaseTimeout = () => setRetryTimeOut(Math.max(Math.min(retryTimeout * 2, 30000), 250))

                ws.onopen = () => {
                    setRetryTimeOut(0)
                    setConnectionState("connected")
                }

                ws.onmessage = (ev) => {
                    messageHandler(ev.data)
                }

                ws.onclose = (ev) => {
                    if (!ev.wasClean) {
                        console.error(`WebSocket connection closed unexpectedly: (${ev.code}) ${ev.reason}`)
                        increaseTimeout()
                        setConnectionState("disconnected")
                    }
                    if (ev.code === 1008) {
                        setConnectionState("finished")
                    }
                }

                ws.onerror = (ev) => {
                    console.error(ev)
                    if (connectionState === "disconnected") {
                        increaseTimeout()
                    }
                }

                wsRef.current = ws
            }, retryTimeout)
        }
    }, [connectionState, retryTimeout, messageHandler, url])

    const ws = wsRef.current

    useEffect(() => {
        if (ws) {
            ws.onmessage = (ev) => {
                messageHandler(ev.data)
            }
        }
    }, [messageHandler, ws])

    return {
        ws,
        connectionState
    }
}

export default useWebSocket
