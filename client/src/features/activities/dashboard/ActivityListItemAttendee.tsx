import { Link } from 'react-router-dom';
import { List, Image } from 'semantic-ui-react';
import { Profile } from '../../../app/models/Profile';

interface Props {
    attendees: Profile[]
}

function ActivityListItemAttendee({ attendees }: Props) {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                    <Image size='mini' circular src={attendee.image || '/assets/user.png'}  />
                </List.Item>
            ))}
        </List>
    );
}

export default ActivityListItemAttendee;