import {useEffect, useState} from "react";
import {useEthers} from "@usedapp/core";
import {providers} from "ethers";
import {getAllVideos, getDeployedContract} from "../contractUtils";
import NavBar from "./NavBar";
import {CircularProgress} from "@mui/material";

function App() {

    const [contract, setContract] = useState(null)
    const [videos, setVideos] = useState([])
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
                refresh(contract)
            } else {
                window.alert('Please connect to Rinkeby Test Network')
            }
        }
        run()
    }, [account, chainId])

    const refresh = async (contract) => {
        setLoading(true)
        try {
            const videos = await getAllVideos(contract)
            setVideos(videos)
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
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
                                ? <div>
                                </div>
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
