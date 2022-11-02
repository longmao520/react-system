const collapseReducer = (prevState = { isCollapsed: false }, action) => {
    let newSate = { ...prevState }
    let { type } = action
    switch (type) {
        case "change-collapsed":
            newSate.isCollapsed = !newSate.isCollapsed
            return newSate
        default:
            return prevState
    }

}
export default collapseReducer