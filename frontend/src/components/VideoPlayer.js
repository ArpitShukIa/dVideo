import React, {useEffect, useState} from 'react';
import {getIpfsUrl} from "../ipfs";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import {CircularProgress} from "@mui/material";

function VideoPlayer({video, liked, toggleLiked}) {

    const [loading, setLoading] = useState(false)

    const onLikeButtonClick = async () => {
        setLoading(true)
        await toggleLiked()
        setLoading(false)
    }

    useEffect(() => {
        setLoading(false)
    }, [video])

    return (
        video
            ? <div className="ms-4 me-4">
                <video
                    className="w-100"
                    src={getIpfsUrl(video.hash)}
                    controls
                />
                <div className="d-flex justify-content-between align-items-center me-2">
                    <h4 className="mt-2">{video.title}</h4>
                    {
                        liked !== null
                            ? loading
                                ? <CircularProgress size={30}/>
                                : <div className="d-flex align-items-center" role="button" onClick={onLikeButtonClick}>
                                    {
                                        liked ? <ThumbUpIcon/> : <ThumbUpOffAltOutlinedIcon/>
                                    }
                                    <span className="ms-2">{video.likes}</span>
                                </div>
                            : ""
                    }
                </div>
                Uploaded by: <i>{video.author}</i>
            </div>
            : <div
                className="d-flex justify-content-center align-items-center"
                style={{height: "80vh", fontSize: 24}}
            >
                Choose a video to play...
            </div>
    );
}

export default VideoPlayer;
