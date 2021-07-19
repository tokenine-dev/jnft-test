/* 

  TODOs:
    - Improve loading interaction on submit work.
    - Add actionable pathway for user to be interacted with after submit.
    - Add a button to route to see their work.
    - Improve image preview pane by fix preview box sizes and position.
*/

import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { useDropzone } from 'react-dropzone'
import swal from 'sweetalert';

import { useDAppContext } from 'providers/dapp'
import { useEthersContext } from 'providers/ethers'
import { functions } from 'libs/firebase-sdk'
import { POST } from 'api'
import { ConnectButton, FallbackWalletNotConnect } from 'components/Wallet'
import { LoadingScreen } from 'components/Loader'
import { callbackify } from 'util';

export interface MyModel {
    name: string;
    description: string;
    // owner: string;
}

export default function CreateWork() {
    const { account, isConnectible } = useDAppContext();
    const { contracts } = useEthersContext();
    const [file, setFile] = useState<Blob[]>([]);
    const [filepreview, setFilepreview] = useState("");
    const [mintStatus, setMintStatus] = useState(false);
    const [imgSize, setImgSize] = useState("width")
    const [imgHeight, setImgHeight] = useState(0)
    const [imgWidtg, setImgWidh] = useState(0)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ perfectImageSize, setPerfectImageSize ] = useState({ maxWidth: 640, maxHeight: 480, width: 640, height: 480 })

    const history = useHistory();

    const [inputs, handleInputChange] = useFormFields<MyModel>({
        name: "",
        description: "",
        // owner: "",
    });

    // ----- On Drag and Drop Image  ----- //

    const perfectImageResizer = ({ width, height }: { width: number, height: number }) => {
        /* 
            Resize if 
            Know orientation first
        */

        const _orientation = width >= height ? "landscape" : "portrait"
        const initialSize_: any = {
            maxWidth: 640,
            maxHeight: 800
        }

        let _resizeFactor = 1;

        if (_orientation === "landscape") {
            if (width > initialSize_.maxWidth) {
                initialSize_.width = initialSize_.maxWidth
                _resizeFactor = width / initialSize_.maxWidth
            }
            // initialSize_.height = initialSize_.maxHeight
            // if (height > initialSize_.maxHeight) {
            initialSize_.height = Math.round(height / _resizeFactor)
            initialSize_.maxHeight = initialSize_.height
            // }
        } else {
            if (height > initialSize_.maxHeight) {
                initialSize_.width = initialSize_.maxWidth
                _resizeFactor = width / initialSize_.maxWidth
            }
            initialSize_.height = Math.round(height / _resizeFactor)
            initialSize_.maxHeight = initialSize_.height
            // initialSize_.height = "auto"
            // initialSize_.width = initialSize_.maxWidth
        }
            
        return initialSize_
    }

    const onDrop = useCallback((acceptedFiles) => {
        const type = acceptedFiles[0].name.split(".")[1];
        if (type === "png" || type === "jpg" || type === "jpeg" || type === "PNG" || type === "JPG" || type === "JPEG") {

            const reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            reader.onload = function (e) {
                setFilepreview("")

                let dataURL = reader.result;
                setFilepreview(String(dataURL));

                let img = new Image()
                img.src = String(dataURL)

                img.onload = function () {
                    // let height = String(img.height).replace('px', '')
                    setImgHeight(img?.height)
                    // setResizeFactor(Math.round(img?.height / 600))
                    setPerfectImageSize(perfectImageResizer(img))

                    if (img.height > img.width) {
                        setImgSize("height")
                    } else if (img.height === img.width) {
                        setImgSize("center")
                    } else {
                        setImgSize("width")
                    }
                };
            };
            setFile(acceptedFiles);
        } else {
            swal({
                // button: "Okay",
                text: "Support only image type png or jpg.",
                icon: "warning",
            });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleChageFileUpload = (e: any) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function () {
                let dataURL = reader.result;
                setFilepreview(String(dataURL));

                let img = new Image()
                img.src = String(dataURL)

                img.onload = function () {
                    // let height = String(img.height).replace('px', '')
                    setImgHeight(img?.height)

                    if (img.height > img.width) {
                        setImgSize("height")
                    } else if (img.height === img.width) {
                        setImgSize("center")
                    } else {
                        setImgSize("width")
                    }
                };

            };
            setFile(e.target.files);
        }
    }

    // ----- On Submit ----- //

    const handleSubmitItem = async (event: React.FormEvent) => {
        setIsLoading(true)
        event.preventDefault();
        console.log(inputs, file)

        let formData = new FormData();
        // const payload: any = {};
        if (
            inputs.name &&
            inputs.description &&
            account &&
            file
        ) {
            formData.append("name", inputs.name);
            formData.append("description", inputs.description);
            formData.append("creator", account ? account : "");
            formData.append("owner", account ? account : "");
            formData.append("files", file[0]);

            await handleUploadItem(formData)

            // payload["name"] = inputs.name
            // payload["description"] = inputs.description
            // payload["creator"] = account ? account : ""
            // payload["owner"] = account ? account : ""

            // const reader = new FileReader();
            // reader.onloadend = function () {
            //     payload["file"] = reader.result
            //     handleUploadItem(payload)
            // }
            // reader.readAsDataURL(file[0])

            
        }
    };

    const handleUploadItem = async (payload: any) => {
        try {
            setMintStatus(true);
            let res = await POST("/creatework", payload);
            console.log(res);

            // const createWork = functions.httpsCallable('creatework')
            // // console.log(formData, payload)
            // const result = await createWork(payload)
            //     // return result
            // // console.log("Create Work Result", result)
            // const { data: res } = result;

            if (res.status === "success") {
                try {
                    const result = await handleMintItem(res.data.id);
                    console.log("Minting Result", result)
                    history.push("/detail/" + res.data.id)
                } catch (error) {
                    throw { error, message: "Mint Item Failed", payload: { id: res.data.id } }
                }
            } else {
                // TODO: Add Revert
                swal({
                    // button: "Okay",
                    text: "Unsuccess!",
                    icon: "warning",
                });
            }
        } catch (e) {
            console.log("ERROR: On Creating Work", e)
            // @ts-ignore
            swal({
                // button: "Okay",
                text: "Please complete all fields.",
                icon: "warning",
            });

            try {
                const revokePendingWork = functions.httpsCallable('revokePendingWork')
                const { data: result } = await revokePendingWork({ id: e.payload.id })
                console.log(result)
            } catch (error2) {
                console.error(error2)
            }
        } finally {
            setIsLoading(false)
            setMintStatus(false)
        }
    }

    const handleMintItem = async (_tokenURI: string) => {
        console.log("Minting", _tokenURI)
        console.log(contracts.NFTWORK)
        try {
            if (!account) { throw { message: "Account is not available to create a new work" } }
            const mintTokenTransaction = await contracts.NFTWORK.mint(
                account,
                _tokenURI,
                {
                    value: 1500000000000000,
                    gasLimit: 15000000,
                },
            );

            console.log("Mint Tx", mintTokenTransaction)
            const receipt = await mintTokenTransaction.wait().catch((e: any) => console.error(e))
            console.log("Receipt", receipt)
    
            let tokenId = receipt.events[0].args.tokenId.toString();
            const transactionHash = receipt.transactionHash;

            if (tokenId) {
                setMintStatus(true);
                const setTokenID = functions.httpsCallable('setTokenID')
                const { data: result } = await setTokenID({ id: _tokenURI, tokenID: tokenId, transactionHash: transactionHash })

                if (result.status === "success") {
                    swal({
                        // buttons: [true],
                        text: "Success",
                        icon: "success",
                    }).then(() => {
                        history.push(`/detail/${_tokenURI}`);
                    });
                }
            } else {
                swal({
                    // buttons: [true],
                    text: "Failed",
                    icon: "warning",
                });
            }
            setMintStatus(false);
        } catch (error) {
            console.log(error)
            if (!error.code) {
                swal({
                    // buttons: [true],
                    text: "Failed",
                    icon: "warning",
                });
            }

            throw error
        }
    };

    // Main Effect
    useEffect(() => {
        if (isConnectible) {
            setTimeout(() => {
                setIsLoading(false)
            }, 600)
        }
    }, [ isConnectible ])

    return (<>
        {
            isLoading && (
                <LoadingScreen isLoading={isLoading} />
            )
        }
        {
            account
            ? (<>
                {

                    <div className="body-container __create-work jimmyis-softcard" style={{ marginTop: "100px" }}>
                        <div className="_title">
                            Mint Your Work
                        </div>
                        <div className="body-wrapper __create-work" style={{ marginTop: "50px" }}>
                            <div className="body-wrapper-content __create-work">
                                <div
                                    {...getRootProps()}
                                    className={`upload drop-zone lg:w-1/2 scroll flex justify-center box-content ${filepreview !== "" ? "_active" : "" }`}
                                    // style={{ ...perfectImageSize }}
                                    style={{ ...perfectImageSize, transition: "all ease-in .3s" }}
                                    // className={`upload drop-zone ${imgSize === "height" ? `w-1/4 h-${imgHeight}` : imgSize === "center" ? `w-1/3 h-${imgHeight}` : `lg:w-1/2 h-96`} `}
                                >
                                    {filepreview === "" ? (
                                        <p>
                                            <span className="icon">
                                                <svg
                                                    className="inline-block"
                                                    width="180px"
                                                    height="160px"
                                                    viewBox="0 0 180 160"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    href="http://www.w3.org/1999/xlink"
                                                >
                                                    <g
                                                        id="Page-1"
                                                        stroke="none"
                                                        strokeWidth="1"
                                                        fill="none"
                                                        fillRule="evenodd"
                                                        opacity="0.100000001"
                                                    >
                                                        <g id="ic-upload" fill="#000000" fillRule="nonzero">
                                                            <circle
                                                                id="Oval"
                                                                cx="67.7142857"
                                                                cy="51.6"
                                                                r="12.3428571"
                                                            ></circle>
                                                            <path
                                                                d="M169.028571,97.0285714 C163.2,91.5428571 155.828571,87.9428571 147.771429,86.9142857 L147.771429,24.1714286 C147.771429,17.4857143 145.028571,11.4857143 140.742857,7.02857143 C136.285714,2.57142857 130.285714,0 123.6,0 L24.1714286,0 C17.4857143,0 11.4857143,2.74285714 7.02857143,7.02857143 C2.57142857,11.4857143 0,17.4857143 0,24.1714286 L0,103.2 L0,110.571429 L0,126.514286 C0,133.2 2.74285714,139.2 7.02857143,143.657143 C11.4857143,148.114286 17.4857143,150.685714 24.1714286,150.685714 L120.342857,150.685714 C126.685714,155.828571 134.571429,159.085714 143.314286,159.085714 C153.428571,159.085714 162.514286,154.971429 169.028571,148.457143 C175.542857,141.942857 179.657143,132.857143 179.657143,122.742857 C179.657143,112.628571 175.542857,103.542857 169.028571,97.0285714 Z M9.08571429,24.1714286 C9.08571429,20.0571429 10.8,16.2857143 13.5428571,13.7142857 C16.2857143,10.9714286 20.0571429,9.25714286 24.1714286,9.25714286 L123.6,9.25714286 C127.714286,9.25714286 131.485714,10.9714286 134.228571,13.7142857 C136.971429,16.4571429 138.685714,20.2285714 138.685714,24.3428571 L138.685714,77.8285714 L113.314286,52.4571429 C111.6,50.7428571 108.685714,50.5714286 106.8,52.4571429 L68.5714286,90.8571429 L42.6857143,64.8 C40.9714286,63.0857143 38.0571429,62.9142857 36.1714286,64.8 L9.08571429,92.2285714 L9.08571429,24.1714286 Z M24,141.942857 L24,141.6 C19.8857143,141.6 16.1142857,139.885714 13.3714286,137.142857 C10.8,134.4 9.08571429,130.628571 9.08571429,126.514286 L9.08571429,110.571429 L9.08571429,105.257143 L39.4285714,74.7428571 L65.3142857,100.628571 C67.0285714,102.342857 69.9428571,102.342857 71.8285714,100.628571 L110.057143,62.2285714 L135.085714,87.4285714 C134.571429,87.6 134.057143,87.7714286 133.542857,87.9428571 C132.857143,88.1142857 132.171429,88.2857143 131.314286,88.6285714 C130.628571,88.8 129.942857,89.1428571 129.257143,89.3142857 C128.742857,89.4857143 128.4,89.6571429 127.885714,90 C127.2,90.3428571 126.685714,90.5142857 126.171429,90.8571429 C125.314286,91.3714286 124.457143,91.8857143 123.6,92.4 C123.085714,92.7428571 122.742857,92.9142857 122.228571,93.2571429 C121.885714,93.4285714 121.714286,93.6 121.371429,93.7714286 C119.828571,94.8 118.457143,96 117.257143,97.3714286 C110.742857,103.885714 106.628571,112.971429 106.628571,123.085714 C106.628571,125.657143 106.971429,128.057143 107.485714,130.628571 C107.657143,131.314286 107.828571,131.828571 108,132.514286 C108.514286,134.228571 109.028571,135.942857 109.714286,137.657143 L109.714286,137.828571 C110.4,139.2 111.085714,140.742857 111.942857,141.942857 L24,141.942857 L24,141.942857 Z M162.342857,141.942857 C157.371429,146.914286 150.685714,149.828571 143.142857,149.828571 C135.942857,149.828571 129.257143,146.914286 124.457143,142.285714 C123.771429,141.6 123.085714,140.742857 122.4,140.057143 C121.885714,139.542857 121.371429,138.857143 120.857143,138.342857 C120.171429,137.485714 119.657143,136.457143 119.142857,135.428571 C118.8,134.742857 118.457143,134.228571 118.114286,133.542857 C117.771429,132.685714 117.428571,131.657143 117.257143,130.628571 C117.085714,129.942857 116.742857,129.085714 116.571429,128.4 C116.228571,126.685714 116.057143,124.8 116.057143,122.914286 C116.057143,115.371429 119.142857,108.685714 123.942857,103.714286 C128.742857,98.7428571 135.6,95.8285714 143.142857,95.8285714 C150.685714,95.8285714 157.371429,98.9142857 162.342857,103.714286 C167.314286,108.685714 170.228571,115.371429 170.228571,122.914286 C170.228571,130.285714 167.142857,136.971429 162.342857,141.942857 Z"
                                                                id="Shape"
                                                            ></path>
                                                            <path
                                                                d="M146.4,104.4 C146.057143,104.057143 145.542857,103.714286 144.857143,103.371429 C144.342857,103.2 143.828571,103.028571 143.314286,103.028571 C143.142857,103.028571 143.142857,103.028571 143.142857,103.028571 C142.971429,103.028571 142.971429,103.028571 142.971429,103.028571 C142.457143,103.028571 141.942857,103.2 141.428571,103.371429 C140.914286,103.542857 140.4,103.885714 139.885714,104.4 L129.257143,115.028571 C127.542857,116.742857 127.542857,119.657143 129.257143,121.542857 C130.971429,123.257143 133.885714,123.257143 135.771429,121.542857 L138.514286,118.8 L138.514286,137.657143 C138.514286,140.228571 140.571429,142.285714 143.142857,142.285714 C145.714286,142.285714 147.771429,140.228571 147.771429,137.657143 L147.771429,118.8 L150.514286,121.542857 C152.228571,123.257143 155.142857,123.257143 157.028571,121.542857 C158.742857,119.828571 158.742857,116.914286 157.028571,115.028571 L146.4,104.4 Z"
                                                                id="Path"
                                                            ></path>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </span>
                                            <span className="text">
                                                {file?.length > 0
                                                    ? "Your image has been uploaded."
                                                    : isDragActive
                                                        ? "Drop the image here."
                                                        : "Drag and drop image files to upload."}
                                            </span>
                                            Your image will be private until you publish them.
                                            <span className="text-descript">
                                                (1600×1200 or larger recommended,
                                                <span className="inline-block">up to 10MB each)</span>
                                            </span>
                                        </p>
                                    ) : (
                                        <div
                                            className="blur-fx"
                                            style={{
                                                backgroundImage: `url(${filepreview})`,
                                                // width: "100%",
                                                // height: "100%",
                                                // backgroundSize: "cover",
                                                backgroundSize: "100%",
                                                backgroundRepeat: "no-repeat",
                                                ...perfectImageSize
                                            }}
                                        />
                                    )}
                                    <input onChange={(e) => handleChageFileUpload(e)} className="file_upload" type="file" accept=".png,.jpg" />
                                </div>
                                <div className="input-zone">
                                    <div className="custom:input-feild">
                                        <h2>Give detail for your work</h2>
                                        <p>
                                            
                                        </p>
                                        <div className="form mb-6">
                                            <label className="form-label" htmlFor="validationCustom01">
                                                Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Add name"
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={inputs.name}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form">
                                            <label className="form-label" htmlFor="validationCustom01">
                                                Description<span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                onChange={handleInputChange}
                                                placeholder="Add description"
                                                id="description"
                                                name="description"
                                                value={inputs.description}
                                                className="form-textarea"
                                                aria-label="With textarea"
                                                spellCheck="false"
                                            ></textarea>
                                        </div>
                                        <br></br>
                                        <div className="btn">
                                            <div className="group">
                                                {account ? (
                                                    <a
                                                        onClick={handleSubmitItem}
                                                    >
                                                        <span>{mintStatus ? "In Process ..." : "Mint Your NFT"}</span>
                                                    </a>
                                                ) : (
                                                    <ConnectButton />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
            </>) : (<>
                <FallbackWalletNotConnect />
            </>)
        }
    </>)
}

function useFormFields<T>(initialState: T): [T, (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void] {
    const [inputs, setValues] = useState<T>(initialState);

    return [
        inputs,
        function (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
            setValues({
                ...inputs,
                [event.target.id]: event.target.value,
            });
        },
    ];
}
