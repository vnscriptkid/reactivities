import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useState } from 'react';
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';
import { Photo, Profile } from '../../app/models/Profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

function ProfilePhotos({profile} : Props) {

    const {profileStore: { isCurrentUser, loading, setMainPhoto }} = useStore();

    const [ addPhotoMode, setAddPhotoMode ] = useState(false);

    const [targetId, setTargetId] = useState<string | null>(null);
    
    function handleSetMainPhoto(photo: Photo, event: SyntheticEvent<HTMLButtonElement>) {
        setTargetId(event.currentTarget.name);
        setMainPhoto(photo);
    }
    
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    
                    {isCurrentUser && (
                        <Button 
                            floated='right' basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}

                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget setAddPhotoMode={setAddPhotoMode}/>
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button 
                                                basic={!photo.isMain}
                                                color='green'
                                                content='Main'
                                                name={photo.id}
                                                disabled={photo.isMain}
                                                loading={targetId === photo.id && loading}
                                                onClick={e => handleSetMainPhoto(photo, e)}
                                            />
                                            <Button 
                                                basic
                                                color='red'
                                                icon='trash'
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}

export default observer(ProfilePhotos);