export type JsonResponse<T = void> = SuccessResponse<T> | ErrorResponse

export interface SuccessResponse<T = void> {
    headers: Headers
    status: number
    statusText: string
    ok: true
    json: T
}

export interface ErrorResponse {
    headers: Headers
    status: number
    statusText: string
    ok: false
    json: ErrorJson | null
}

interface ErrorJson {
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

type QueryParam = string | number | boolean

export const buildQueryString = (params: { [key: string]: QueryParam | QueryParam[] | undefined }) =>
    Object
        .keys(params)
        .filter(key => Array.isArray(params[key]) ? (params[key] as QueryParam[]).length : params[key] !== undefined)
        .map(key => Array.isArray(params[key]) ?
            (params[key] as QueryParam[]).map((val: QueryParam) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&') :
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key] as QueryParam)}`
        ).join('&')
