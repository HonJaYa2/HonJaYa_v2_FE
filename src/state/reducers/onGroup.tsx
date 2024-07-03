interface onGroupState {
    onGroup: boolean;
}

type groupAction = {type: 'JOIN_GROUP'} | {type: 'EXIT_GROUP'} 

const initialState: onGroupState = {
    onGroup: false,
}

const onGroup = (state: onGroupState = initialState, action: groupAction ): onGroupState  => {
    switch (action.type) {
        case 'JOIN_GROUP':
            return {...state, onGroup: true};
        case 'EXIT_GROUP':
            return {...state, onGroup: false};
        default:
            return state;
    } 
}

export default onGroup;