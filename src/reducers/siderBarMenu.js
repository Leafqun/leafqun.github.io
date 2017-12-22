export function collapsed(collapsed = false, actions) {
    switch (actions.type) {
        case 'setCollapsed':
            return !collapsed
        default:
            return collapsed
    }
}