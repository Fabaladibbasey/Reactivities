import React from 'react'
import { Message } from 'semantic-ui-react'

interface Props {
    errors: string[]
}

function ValidationErrors({ errors }: Props) {
    return (
        <Message error>
            <h1>Errors</h1>
            <Message.List>
                {errors.map((err, i) => (
                    <Message.Item key={i}>{err}</Message.Item>
                ))}

            </Message.List>
        </Message>
    )
}

export default ValidationErrors