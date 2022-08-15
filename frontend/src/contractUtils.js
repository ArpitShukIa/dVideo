import DVideo from "./chain-info/contracts/DVideo.json"
import networkMapping from "./chain-info/deployments/map.json"
import {Contract, providers, utils} from "ethers";

export const getDeployedContract = async () => {
    const {abi} = DVideo
    const provider = new providers.Web3Provider(window.ethereum)
    const {chainId} = await provider.getNetwork()
    if (!chainId || !networkMapping[String(chainId)]) {
        return null
    }
    const contractAddress = networkMapping[String(chainId)]["DVideo"][0]
    const contractInterface = new utils.Interface(abi)
    const contract = new Contract(contractAddress, contractInterface, provider.getSigner())
    return await contract.deployed()
}

export const getAllVideos = async (contract) => {
    const videos = []
    const videoCount = await contract.videoCount()
    // Load videos starting from the newest
    for (let i = videoCount; i > 0; i--) {
        const video = await contract.videos(i)
        videos.push({
            id: video.id,
            hash: video.hash,
            title: video.title,
            author: video.author,
            likes: video.likes.toNumber()
        })
    }
    return videos
}
