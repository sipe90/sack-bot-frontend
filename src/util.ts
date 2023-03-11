export type JsonResponse<E = void> = ({
    headers: Headers
    status: number
    statusText: string
} & ({
    ok: true
    json: E
} | {
    ok: false
    json: ErrorResponse | null
})
)

interface ErrorResponse {
    field: string
    message: string
    stack?: string
}

const isJsonResponse = (headers: Headers) => !!headers.get('content-type')?.includes('application/json')

export const fetchJson = async <E>(url: string, init?: RequestInit): Promise<JsonResponse<E>> => {
    const res = await fetch(url, init)
    const { headers, json, ok, status, statusText } = res

    const resJson = isJsonResponse(headers) ? await json.call(res) : null

    return {
        headers,
        json: resJson,
        ok,
        status,
        statusText,
    }
}

export const buildQueryString = (params: { [key: string]: any | any[] }) =>
    Object
        .keys(params)
        .filter(key => Array.isArray(params[key]) ? params[key].length : params[key] !== undefined)
        .map(key => Array.isArray(params[key]) ?
            params[key].map((val: any) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&') :
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        ).join('&')
