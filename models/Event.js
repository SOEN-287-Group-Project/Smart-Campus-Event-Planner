class Event{
    constructor(
        event_id,
        title,
        description,
        category, 
            /*
            Academic workshops
            Career events
            Club activities
            Sports events
            Cultural events
            Volunteering events
            Social events
            Guest lectures
            Networking events
            Other
            */
        event_date,
        start_time,
        end_time,
        location,
        capacity,
        status, // open, full, cancelled, completed, disabled
        organizer_id,
        created_on
    ){
        this.event_id = event_id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.event_date = event_date;
        this.start_time = start_time;
        this.end_time = end_time;
        this.location = location;
        this.capacity = capacity;
        this.status = status;
        this.organizer_id = organizer_id;
        this.created_on = created_on;
    }

}