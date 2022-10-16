import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useState } from 'react'
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react'
import { useStore } from '../../app/api/stores/store'
import ImageUploadWidget from '../../app/common/imageUpload/ImageUploadWidget'
import { Photo, Profile } from '../../app/models/profile'

interface Props {
    profile: Profile
}

function ProfilePhotos({ profile }: Props) {
    const { profileStore: { isCurrentUser, uploadingPhoto, uploadPhoto, loading, setMainPhoto, deletePhoto } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(false);

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setDeleteTarget(true);
        deletePhoto(photo);
    }

    function handleUploadImage(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                            floated='right'
                            basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <ImageUploadWidget
                            uploadPhoto={handleUploadImage}
                            loading={uploadingPhoto}
                        />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos!.map((photo) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button

                                                basic
                                                positive
                                                content='Main'
                                                name={photo.id}
                                                onClick={e => handleSetMainPhoto(photo, e)}
                                                disabled={photo.isMain}
                                                loading={loading && target === photo.id && !deleteTarget}
                                            />
                                            <Button
                                                basic
                                                negative
                                                icon='trash'
                                                name={photo.id}
                                                onClick={e => handleDeletePhoto(photo, e)}
                                                disabled={photo.isMain}
                                                loading={loading && target === photo.id && deleteTarget}
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

    )
}

export default observer(ProfilePhotos)