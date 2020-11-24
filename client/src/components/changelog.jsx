import React, { useEffect, useState } from 'react'
import changeLog from '../CHANGELOG.md'
import ReactMarkdown from 'react-markdown'


export default function Changelog() {
    const [mdText, setMdText] = useState('')
    useEffect(() => {
        fetch(changeLog)
            .then((res) => res.text())
            .then((text) => {
                setMdText(text)
            })
    })

    return (
        <div>
           {mdText ? <ReactMarkdown source={mdText} /> : 'Loading'}
        </div>
    )

}