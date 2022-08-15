import React, {useRef, useState} from 'react';

function UploadForm({uploadVideo}) {
    const [title, setTitle] = useState("")
    const [file, setFile] = useState(null)
    const fileRef = useRef()

    const onSubmit = (e) => {
        e.preventDefault()
        if (title)
            uploadVideo(file, title)
    }

    return (
        <div className="card">
            <span className="card-header text-center">Share a video</span>
            <form className="card-body" onSubmit={onSubmit}>
                <input className="form-control"
                       placeholder="Enter video title"
                       value={title}
                       onChange={e => setTitle(e.target.value)}
                       required
                />
                <input type="file"
                       accept=".mp4, .mkv .ogg .wmv"
                       className="form-control mt-3"
                       ref={fileRef}
                       required
                       onChange={e => setFile(e.target.files[0])}
                />
                <button className="btn btn-primary w-100 mt-3" type="submit">Upload</button>
            </form>
        </div>
    );
}

export default UploadForm;
