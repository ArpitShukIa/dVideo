import React from 'react';
import {getIpfsUrl} from "../ipfs";

function VideosList({videos, changeVideo}) {
    return (
        videos.map((video, index) =>
            <div className="d-flex mt-4" role="button" key={index} onClick={() => changeVideo(index)}>
                <video src={getIpfsUrl(video.hash)} style={{width: "40%"}}/>
                <div className="ms-2 d-flex flex-column">
                    <b>{video.title}</b>
                    <i>{video.author.slice(0, 20)}...</i>
                    Likes: {video.likes}
                </div>
            </div>
        )
    );
}

export default VideosList;
