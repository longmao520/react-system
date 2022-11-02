const loadingReducer = (prevState = { isLoading: false }, action) => {
    let newState = { ...prevState }
    let { type, payload } = action
    switch (type) {
        case "change-loading":
            newState.isLoading = payload
            return newState
        default:
            return prevState
    }

}
export default loadingReducer