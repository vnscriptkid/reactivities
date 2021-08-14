import { observer } from 'mobx-react-lite';
import { SyntheticEvent } from 'react';
import { Reveal, Button } from 'semantic-ui-react';
import { Profile } from '../../app/models/Profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

function FollowButton({profile}: Props) {

    const {userStore, profileStore} = useStore();

    const {user} = userStore;
    const {toggleFollowing, loading} = profileStore;

    if (user?.username === profile?.username) return null;

    function handleClick(e: SyntheticEvent) {
        e.preventDefault();
        toggleFollowing(profile.username, !profile.following);
    }
    
    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button fluid color='teal' content={profile?.following ? 'Following' : 'Not following'} />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button 
                    basic
                    fluid
                    onClick={handleClick}
                    loading={loading}
                    disabled={loading}
                    color={profile?.following ? 'red' : 'green'} 
                    content={profile?.following ? 'Unfollow' : 'Follow'} />
            </Reveal.Content>
        </Reveal>
    );
}

export default observer(FollowButton);