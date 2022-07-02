import React, {useEffect} from "react"
import {Link} from "react-router-dom"
import {debounceAPI} from "../utils/api_utils"

const testAPI = new debounceAPI(800)
export default function page1() {
    useEffect(() => {
        return () => testAPI?.scheduleAPI?.controller?.abort()
    }, [])

    function callAPI(value, controller) {
        fetch("https://demo.dataverse.org/api/search?q=" + value, {
            signal: controller.signal,
        })
            .then((r) => r.json())
            .then(console.log)
            .catch(console.warn)
    }
    const WrapperAPI = (e) => {
        testAPI.scheduleAPI.callback = (c) => callAPI(e.target.value, c)
    }

    return (
        <div>
            Page1 <br />
            <Link to="page2">view Page2</Link> <br />
            <br />
            <br />
            <br />
            <input type="text" onChange={WrapperAPI} />
        </div>
    )
}
