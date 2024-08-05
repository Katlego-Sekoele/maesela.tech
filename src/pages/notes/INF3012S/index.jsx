import { useEffect, useState } from 'react';
import "react-notion/src/styles.css";
import { NotionRenderer } from "react-notion";
import { Link, Route, Routes } from 'react-router-dom';
import ScrollableContainer from '../../../components/scrollable-container';
import './styles.css';

const notes = [
    {
        title: 'Introduction to Business Processes',
        pageId: '5e4431ee30ae41608d1254714a766a8a'
    },
    {
        title: 'Business Process Modelling',
        pageId: 'bf4c229e2a0941398b205dd61498b0a1'
    },
    {
        title: 'Business Process Redesign (Notes based on reader)',
        pageId: '5cfcc6bc3f3148bc8c1bc3a480f0b77e'
    },
    {
        title: 'Business Process Redesign (Notes based on live lecture)',
        pageId: 'dc6e2b9ef36c46dfab8b34bdbb723fb5'
    },
    {
        title: 'Enterprise Systems Introduction',
        pageId: 'a697e8b4d59a450a98fa336f28afb272'
    },
    {
        title: 'Enterprise Systems Introduction (2)',
        pageId: '05b039fb94bc4c6cbd8c9f98532c6e9c'
    },
    {
        title: 'Enterprise Systems Implementation',
        pageId: '9b9edae03a2e4c20bd910334fd462fef'
    },
    {
        title: 'Enterprise Systems Investment Governance',
        pageId: '1103d2726eb940339d4c8d1bcea63d2c'
    },
    {
        title: 'Business Process Human Impact',
        pageId: '239ce9b67d394071a8bda93bf03e1de8'
    },
    {
        title: 'Business Process Change',
        pageId: '349d0d42834a4dd9a189adae75878d46'
    },
    {
        title: 'Enterprise Resource Planning Business Case',
        pageId: '6ac37440a27f429d8e3eae279105a634'
    },
    {
        title: 'Process: Sales (Order-to-cash)',
        pageId: 'bf4abac41c3840dd831116a411a13e0b'
    },
    {
        title: 'Process: Procure-to-pay',
        pageId: 'bac32c421f204fdfab4520a2c158d715'
    },
    {
        title: 'Business Process Risk, Controls, and Compliance (Reader)',
        pageId: '0dce5da23c344b09b66e1c18c3666467'
    },
    {
        title: 'Business Process Risk, Controls, and Compliance (Lecture)',
        pageId: 'b597f42799c24403b5ecb137e16b0a35'
    },

]

const API_BASE = 'https://notion-api.splitbee.io/v1/page'

function INF3012_Notes() {
    const [notionData, setNotionData] = useState([])


    useEffect(() => {
        const fetchNotes = async () => {
            const newNotes = await Promise.all(
                notes.map(async (note) => {
                    const response = await fetch(`${API_BASE}/${note.pageId}`)
                    const data = await response.json()
                    return data
                })
            )

            console.log(newNotes)

            setNotionData(newNotes)
        }

        fetchNotes().catch(console.error).then(() => console.log('done', notionData))
    }, [])

    useEffect(() => {
        async function fetchNotes() {
            const response = await fetch(`${API_BASE}/${notes[0].pageId}`)
            const data = await response.json()
            console.log("first note", data)
        }
        fetchNotes()
    }, [])

    return (
        <div>
            {/*  */}
            <Routes>
                <Route path="/" element={
                    <ScrollableContainer>
                        <div>
                            <h1
                                style={{
                                    marginTop: "0.8em",
                                    marginBottom: "0.8em",
                                }}
                            >Notes for INF3012S</h1>
                            <ul>
                                {notes.map((note, index) => (
                                    <li key={index}
                                        style={{
                                            marginBottom: "0.5em",
                                        }}>
                                        <a href={`/INF3012S/${note.pageId}`}>{note.title}</a>
                                    </li>
                                ))}
                                <li
                                    style={{
                                        marginBottom: "0.5em",
                                    }}>
                                    <a href={`/INF3012S/exam-notes`}>Exam Notes</a>
                                </li>
                            </ul>
                        </div>
                    </ScrollableContainer>
                } />
                {notes.map((note, index) => (
                    <Route key={index} path={note.pageId} element={<SingleNote title={note.title} pageId={note.pageId} />} />
                ))}
                <Route path="exam-notes" element={
                    <ScrollableContainer>
                        <Link to="/INF3012S" style={{
                            display: "block",
                            marginBottom: "1em",
                            color: "blue",
                            textDecoration: "underline",
                            margin: "1em 0"
                        }}>← Back</Link>
                        <h1
                            style={{
                                marginTop: "0.8em",
                                marginBottom: "0.8em",
                            }}
                        >Exam Notes</h1>
                        <iframe src="https://coda.io/embed/euXXRLXuYs/_suxkZ?viewMode=embedplay" title='exam-notes' height={'500'} style={{ minWidth: "100%", minHeight: "100%" }} allow="fullscreen"></iframe>
                    </ScrollableContainer>
                } />
            </Routes>
        </div>
    );
}

function SingleNote({ title, pageId }) {
    const [notionData, setNotionData] = useState({})

    useEffect(() => {
        const fetchNote = async () => {
            const response = await fetch(`${API_BASE}/${pageId}`)
            const data = await response.json()
            setNotionData(data)
        }

        fetchNote().catch(console.error)
    }, [pageId])

    return (
        <div>
            <Link to="/INF3012S" style={{
                display: "block",
                marginBottom: "1em",
                color: "blue",
                textDecoration: "underline",
                margin: "1em 0"
            }}>← Back</Link>
            {/* <h1 style={{
                marginTop: "0.8em",
                marginBottom: "0.8em",
            }}>{title}</h1> */}
            <NotionRenderer blockMap={notionData} fullPage={true} hideHeader />
        </div>
    )
}

export default INF3012_Notes;