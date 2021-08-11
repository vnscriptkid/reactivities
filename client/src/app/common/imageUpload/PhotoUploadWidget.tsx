import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";

interface Props {
    setAddPhotoMode: (state: boolean) => void;
}

function PhotoUploadWidget({ setAddPhotoMode }: Props) {
    const [files, setFiles] = useState<any>([]);

    const [cropper, setCropper] = useState<Cropper>();

    const {profileStore: { uploading, uploadPhoto }} = useStore();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas()
                .toBlob(blob => uploadPhoto(blob!)
                .then(() => setAddPhotoMode(false)));
        }
    }
    
    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])
    
    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo' />
                <PhotoWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image' />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview & Upload' />
                {files && files.length > 0 && (
                    <>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }}></div>
                        <Button.Group widths={2}>
                            <Button loading={uploading} disabled={uploading} onClick={onCrop} positive icon='check' />
                            <Button disabled={uploading} onClick={() => setFiles([])} icon='close' />
                        </Button.Group>
                    </>
                )}
            </Grid.Column>
        </Grid>
    );
}

export default observer(PhotoUploadWidget);