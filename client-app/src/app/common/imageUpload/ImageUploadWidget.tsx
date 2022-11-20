import React, { useState, useEffect } from 'react'
import { Button, Grid, Header } from 'semantic-ui-react'
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropzone from './PhotoWidgetDropzone'

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

function ImageUploadWidget({ loading, uploadPhoto }: Props) {
    const [files, setFiles] = useState<any[]>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => {
                uploadPhoto(blob!);
            }, 'image/jpeg')
        }
    }


    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        }
    }, [files])


    return (
        <Grid>
            <Grid.Column width={4}>
                <Header color='teal' sub content='Step 1 - Add Photo' />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header color='teal' sub content='Step 2 - Resize image ' />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header color='teal' sub content='Step 3 - Preview & upload' />
                {files && files.length > 0 && (
                    <>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }}>
                        </div>
                        <Button.Group widths={2}>
                            <Button loading={loading} onClick={onCrop} positive icon='check' />
                            <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
                        </Button.Group>
                    </>
                )}
            </Grid.Column>

        </Grid>
    )
}

export default ImageUploadWidget
