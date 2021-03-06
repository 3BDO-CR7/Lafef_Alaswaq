const INITIAL_STATE = { lang: 'ar' };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'chooseLang':
            console.log('reducer lang', action.payload);
            return { lang: action.payload };
        default:
            return state;
    }
};