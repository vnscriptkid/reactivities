import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import Loading from "../../app/layout/Loading";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

function ProfilePage() {

    const {username} = useParams<{ username: string }>();

    const {profileStore: { loadProfile, initialLoading, profile, setActiveTab }} = useStore();

    useEffect(() => {
        if (username) loadProfile(username);

        return () => setActiveTab(0);
    }, [username, loadProfile, setActiveTab]);

    if (initialLoading) return <Loading  content='Loading profile...' />
    
    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} />
                <ProfileContent profile={profile!} />
            </Grid.Column>
        </Grid>

    );
}

export default observer(ProfilePage);