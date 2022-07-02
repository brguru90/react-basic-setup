export function debounceAPI(delayMS = 1000) {
    this.scheduleAPI = {
        controller: null,
        timeout: null,
        set callback(cbFunc) {
            // to cancel last pending APIS
            this.controller?.abort()
            // to skip recent immediate repeated calls
            // & keep latest not aborted by scheduling it
            clearTimeout(this.timeout)
            const scheduleAPICall = (controller) => {
                this.timeout = setTimeout(() => {
                    cbFunc(controller)
                }, delayMS)
            }
            // scheduling API call
            this.controller = new AbortController()
            scheduleAPICall(this.controller)
        },
    }
}
