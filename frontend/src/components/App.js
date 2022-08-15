import {useEffect, useState} from "react";
import {useEthers} from "@usedapp/core";
import {providers} from "ethers";
import {getAllVideos, getDeployedContract} from "../contractUtils";
import NavBar from "./NavBar";
import {CircularProgress} from "@mui/material";
import Main from "./Main";
import {ipfsClient} from "../ipfs";

function App() {

    const [contract, setContract] = useState(null)
    const [videos, setVideos] = useState([])
    const [currentVideoIndex, setCurrentVideoIndex] = useState(null)
    const [likedCurrentVideo, setLikedCurrentVideo] = useState(null)
    const [loading, setLoading] = useState(false)

    const {account, activateBrowserWallet, chainId} = useEthers()

    const isConnected = account !== undefined

    useEffect(() => {
        const provider = new providers.Web3Provider(window.ethereum, "any")
        provider.on("network", (newNetwork, oldNetwork) => {
            // When a Provider makes its initial connection, it emits a "network"
            // event with a null oldNetwork along with the newNetwork. So, if the
            // oldNetwork exists, it represents a changing network
            if (oldNetwork) {
                window.location.reload()
            }
        })
    }, [])

    useEffect(() => {
        if (!account || contract)
            return
        const run = async () => {
            setLoading(true)
            const contract = await getDeployedContract()
            if (contract) {
                setContract(contract)
                await refresh(contract)
                setLoading(false)
            } else {
                window.alert('Please connect to Rinkeby Test Network')
            }
        }
        run()
    }, [account, chainId])

    useEffect(() => {
        if (currentVideoIndex === null)
            return
        setLikedCurrentVideo(null)
        const run = async () => {
            const liked = await contract.videoLikes(videos[currentVideoIndex].id, account)
            setLikedCurrentVideo(liked)
        }
        run()
    }, [account, currentVideoIndex, videos])

    const refresh = async (contract) => {
        try {
            const videos = await getAllVideos(contract)
            setVideos(videos)
        } catch (e) {
            console.error(e)
        }
    }

    const uploadVideo = async (videoFile, videoTitle) => {
        setLoading(true)
        try {
            const result = await ipfsClient.add(videoFile)
            const tx = await contract.uploadVideo(result.path, videoTitle)
            await tx.wait(1)
            await refresh(contract)
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    const changeVideo = (videoIndex) => {
        setCurrentVideoIndex(videoIndex)
    }

    const toggleLiked = async () => {
        try {
            if (likedCurrentVideo) {
                const tx = await contract.removeLike(videos[currentVideoIndex].id)
                await tx.wait(1)
            } else {
                const tx = await contract.addLike(videos[currentVideoIndex].id)
                await tx.wait(1)
            }
            await refresh(contract)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <NavBar account={account}/>
            {
                loading
                    ? <div style={{height: "80vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <CircularProgress size={80}/>
                    </div>
                    : <div>
                        {
                            isConnected
                                ? <Main
                                    videos={videos}
                                    currentVideoIndex={currentVideoIndex}
                                    likedCurrentVideo={likedCurrentVideo}
                                    uploadVideo={uploadVideo}
                                    changeVideo={changeVideo}
                                    toggleLiked={toggleLiked}
                                />
                                : <div className="text-center mt-4">
                                    <p style={{fontSize: 20}}>Connect to your Metamask wallet</p>
                                    <button className="btn btn-primary" onClick={activateBrowserWallet}>Connect</button>
                                </div>
                        }
                    </div>
            }
        </div>
    );
}

export default App;
