import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface Props {
    setFiles: (files: object[]) => void;
}

function PhotoWidgetDropzone({ setFiles }: Props) {
    const dzStyles = {
        border: 'dashed 3px',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        height: '200px'
    }

    const dzActive = {
        borderColor: 'green'
    }

    const onDrop = useCallback((acceptedFiles: any) => {
        setFiles(
            acceptedFiles.map((file: any) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            )
        );
    }, [setFiles])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
            <input {...getInputProps()} />
            <Icon name='upload' size='huge' />
            <Header content='Drop image here' />
        </div>
    )
}

export default PhotoWidgetDropzone