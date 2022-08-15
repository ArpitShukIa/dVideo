import React from 'react';
import UploadForm from "./UploadForm";
import VideosList from "./VideosList";
import VideoPlayer from "./VideoPlayer";

function Main({videos, currentVideoIndex, likedCurrentVideo, uploadVideo, changeVideo, toggleLiked}) {
    return (
        <div className="d-flex mt-4 me-4">
            <div style={{width: "70%"}}>
                <VideoPlayer
                    video={videos[currentVideoIndex]}
                    liked={likedCurrentVideo}
                    toggleLiked={toggleLiked}
                />
            </div>
            <div style={{width: "30%"}}>
                <UploadForm uploadVideo={uploadVideo}/>
                <VideosList videos={videos} changeVideo={changeVideo}/>
            </div>
        </div>
    );
}

export default Main;
