class Registration{
    constructor(
        registrtaion_id,
        user_id,
        event_id,
        registration_date,
        status, // Registered, Cancelled, Attended, Missed
        attended
    ){
        this.registrtaion_id = registrtaion_id;
        this.user_id = user_id;
        this.event_id = event_id;
        this.registration_date = registration_date;
        this.status = status;
        this.attended = attended;
    }
    
}