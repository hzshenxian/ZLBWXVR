
import { get } from "./request"

export const getData = (data) => get("/v1/wuxing/emergency", data)
