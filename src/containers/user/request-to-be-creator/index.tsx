import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label, TextField, UploadImage } from '../../../components/index';
import { UploadProfileImage } from 'components/uploadImage/uploadImage'
import { functions, firestore } from 'libs/firebase-sdk';
import { useDAppContext } from 'providers/dapp';
import { useHistory } from "react-router-dom"
import swal from 'sweetalert';
import { ICreator } from 'types';
import { BsThreeDots } from 'react-icons/bs'
import { safeAddress } from 'utils/contract';
import { LoadingScreen } from 'components/Loader'
import { FallbackWalletNotConnect } from 'components/Wallet'

const dataField = [
    { label: 'Name', name: 'name', placeholder: 'Please enter your name', type: 'text' },
    { label: 'Biography', name: 'bio', placeholder: 'Please describe yourself', type: 'text-area' },
    { label: 'Email', name: 'email', placeholder: 'Please enter your email', type: 'text' },
];

interface IUser {
    name: string
    bio: string
    file: string
    fileName: string,
    publicAddress: string
}
type IUserKey = keyof IUser;

const RequestToCreator = () => {

    const { account, isConnectible } = useDAppContext()
    const history = useHistory();

    const [ isLoading, setIsLoading ] = useState(true)
    const [ user, setUser ] = useState<ICreator | null>(null)
    const [ filepreview, setFilepreview ] = useState('');
    const [ file, setFile ] = useState('');

    const [ profileForm, setProfileForm ] = useState<IUser>({
        name: '',
        bio: '',
        file: '',
        fileName: '',
        publicAddress: safeAddress(account) || '',
    })

    // Main Effect
    useEffect(() => {
        if (isConnectible) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [ isConnectible ])

    useEffect(() => {
        if (account) {
            setProfileForm({...profileForm, publicAddress: safeAddress(account) })
            getUser()
        }
        return () => {
            setUser(null)
        }
    }, [ account ])

    const getUser = () => {
        firestore.collection('users').doc(account || '').get().then((doc) => {
            if (doc.exists) {
                setUser(doc.data() as ICreator)
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        setProfileForm({ ...profileForm, [name]: value })
    }

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if (profileForm.publicAddress === '') {
                swal({
                    // buttons: [true],
                    text: "please connect metamask before.",
                    icon: "warning",
                })
                return
            }
    
            const result = await callRequestToBeCreator({ data: { profileForm }, handers: { setIsLoading } }) 
    
            if (result.status === "success") {
                swal({
                    // buttons: [true],
                    text: "Request sent successfully.",
                    icon: "success",
                }).then(() => {
                    history.push(`/profile/${account}`);
                });
            } else {
                swal({
                    // buttons: [true],
                    text: "Send request fail, please try again",
                    icon: "error",
                });
            }
        } catch (e) {
            swal({
                // buttons: [true],
                text: "Something's wrong! " + e.message,
                icon: "warning",
            });
        } finally {
            setIsLoading(false)
        }
    }

    const onDrop = useCallback((acceptedFiles) => {
        let [file] = acceptedFiles;
        if (file) {
            setFilepreview(URL.createObjectURL(file))

            //read data from the blob objects(file)
            let reader = new FileReader();
            //reads the binary data and encodes it as base64 data url
            reader.readAsDataURL(file);
            //reads it finish with either success or failure
            reader.onloadend = () => {
                //reader.result is the result of the reading in base64 string
                setFile(reader.result as any)
                setProfileForm({ ...profileForm, file: reader.result as any, fileName: file.name })
            };
        }
    }, [ profileForm ]);

    const handleChangeFileUpload = (e: any) => {
        let [file] = e.target.files;
        if (file) {
            setFilepreview(URL.createObjectURL(file))

            //read data from the blob objects(file)
            let reader = new FileReader();
            //reads the binary data and encodes it as base64 data url
            reader.readAsDataURL(file);
            //reads it finish with either success or failure
            reader.onloadend = () => {
                //reader.result is the result of the reading in base64 string
                setFile(reader.result as any)
                setProfileForm({ ...profileForm, file: reader.result as any, fileName: file.name })
            };
        }
    };

    const { getRootProps, isDragActive } = useDropzone({ onDrop });

    return (<>
        <div className="page">
            <LoadingScreen isLoading={isLoading} />
            {
                account
                ? (<>
                    { user
                        ? (<>
                            { user.isApprovedCreator
                                ? (<>
                                    {
                                        history.push("/profile/" + account)
                                    }
                                    Redirect to profile
                                </>)
                                : (
                                    < FallbackRequestPending />
                                )
                            }
                        </>)
                        : (<>
                            <div className="max-w-screen-xl w-full mx-auto hero-body flex mt-0 md:my-8 jimmyis-softcard" style={{ marginTop: "100px" }} >
                                <div className="_title">
                                    Send Request to be a Creator
                                </div>
                                <div className="max-w-screen-xl w-4/5 mx-auto px-4 sm:px-6 lg:px-8 pt-2" style={{ marginTop: "50px" }}>
                                    {/* <Label title={'Request to be a creator'} /> */}
                                    <div className="md:flex md:flex-row justify-center">
                                        <UploadProfileImage filepreview={filepreview} file={file} isDragActive={isDragActive} getRootProps={getRootProps} handleChangeFileUpload={handleChangeFileUpload} />

                                        <div className="lg:w-1/2 md:px-10">
                                            { dataField.map((el, index) => {
                                                const value = profileForm[el.name as IUserKey]
                                                return (
                                                    <div className="mb-4">
                                                        <TextField label={el.label} onChange={handleInputChange} name={el.name} id={el.name} placeholder={el.placeholder} type={el.type} key={index} value={value} />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="lg:w-32 md:px-10 w-1/2 mx-auto">
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full flex-none bg-gray-900 hover:bg-gray-700 text-white textLg leading-8 font-semibold py-3 px-6 border border-transparent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200 mt-3"
                                        >
                                            Send Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>)
                    }
                </>
                ) : (<>
                    <FallbackWalletNotConnect />
                </>)
            }
        </div>
    </>)
}

const FallbackRequestPending = () => {
    const onClick = () => {}

    return (
        <div className="flex flex-col items-center p-10 pt-4 justify-center text-1xl w-screen" style={{ height: '60vh' }}>
            <div className="label border-opacity-20">
                <h2 className="title">Your request is pending... please wait</h2>
            </div>

            <div className="lg:w-32 mx-auto">
                <button
                    onClick={onClick}
                    className="w-full sm:w-auto inline-flex bg-gray-900 hover:bg-gray-700 text-white textLg leading-6 font-semibold py-3 pr-6 pl-3 border border-transparent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200 mx-auto"
                >
                    Send Request Again
                </button> 
            </div>
        </div>
    )
}

const callRequestToBeCreator = async ({ data, handlers }: any) => {
    const { profileForm } = data

    try {
        const requestToBeCreator = functions.httpsCallable('requestToBeCreator')
        const { data: result } = await requestToBeCreator(profileForm)
        return result

    } catch (e) {
        return e
    }
}

export default RequestToCreator
