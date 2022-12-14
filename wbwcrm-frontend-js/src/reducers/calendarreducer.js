const initialState = {
    calendar_info: [],
    connected_people: []
}

export default function calendarReducer(state = initialState, action){
    switch(action.type){
        case 'USER_CALENDAR_INFORMATION':
            return{
                ...state,
                calendar_info: action.payload.map(element => {
                    return {title: element.subject, attendees: element.attendees, start: element.start.dateTime, end: element.end.dateTime, isAllDay: element.isAllDay, categories: element.categories, location: element.location, 
                        recurrence: element.recurrence, id: element.id
                }})
            }
        case 'USER_PEOPLE_CONNECTIONS':
            return{
                ...state,
                connected_people: action.payload.map(person => {
                    return {name: person.displayName, email: person.emailAddresses[0].address
                }})
            }
        default:
            return{
                ...state
            }
    }
}

