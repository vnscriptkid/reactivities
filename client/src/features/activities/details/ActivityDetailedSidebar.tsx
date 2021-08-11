import { Segment, List, Label, Item, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Activity } from '../../../app/models/Activity'

interface Props {
    activity: Activity;
}
function ActivityDetailedSidebar ({ activity }: Props) {
    if (!activity.profiles) return null;
    
    return (
        <>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {activity.profiles.length} People Going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {activity.profiles.map(attendee => (
                        <Item key={attendee.username} style={{ position: 'relative' }}>
                            {attendee.username === activity.hostUsername && (<Label
                                style={{ position: 'absolute' }}
                                color='orange'
                                ribbon='right'
                            >
                                Host
                            </Label>)}
                            <Image size='tiny' src={'/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='h3'>
                                    <Link to={`#`}>{attendee.username}</Link>
                                </Item.Header>
                                {/* <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra> */}
                            </Item.Content>
                        </Item>
                    ))}

                    {/* <Item style={{ position: 'relative' }}>
                        <Image size='tiny' src={'/assets/user.png'} />
                        <Item.Content verticalAlign='middle'>
                            <Item.Header as='h3'>
                                <Link to={`#`}>Tom</Link>
                            </Item.Header>
                            <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                        </Item.Content>
                    </Item>

                    <Item style={{ position: 'relative' }}>
                        <Image size='tiny' src={'/assets/user.png'} />
                        <Item.Content verticalAlign='middle'>
                            <Item.Header as='h3'>
                                <Link to={`#`}>Sally</Link>
                            </Item.Header>
                        </Item.Content>
                    </Item> */}
                </List>
            </Segment>
        </>
    )
}


export default observer(ActivityDetailedSidebar);