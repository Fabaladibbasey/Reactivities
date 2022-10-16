import React from 'react'
import { Cropper } from 'react-cropper'
import 'cropperjs/dist/cropper.css'

interface Props {
    setCropper: (cropper: Cropper) => void;
    imagePreview: string;
}

function PhotoWidgetCropper({ setCropper, imagePreview }: Props) {
    return (
        <Cropper
            src={imagePreview}
            style={{ height: 200, width: '100%', objectFit: 'cover' }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            dragMode='move'
            scalable={false}
            // cropBoxMovable={true}
            // cropBoxResizable={true}
            onInitialized={(cropper) => setCropper(cropper)}
        // crop={this.cropImage}
        />
    )
}

export default PhotoWidgetCropper