import { firestore, functions } from 'libs/firebase-sdk';
import { useDAppContext } from 'providers/dapp';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ICreator } from 'types';
import swal from 'sweetalert';
import { useHistory } from "react-router-dom"
import { Label, TextField } from '../../components/index';
import { UploadProfileImage } from '../../components/uploadImage/uploadImage'

interface IUser {
     name: string
     bio: string
     file: string
}

export default function EditProfile() {

     const { account } = useDAppContext()
     const [filepreview, setFilepreview] = useState('');
     const [file, setFile] = useState('');
     const history = useHistory();

     const [formCreator, setFormCreator] = useState<IUser & {
          fileName: string, publicAddress: string, twitter?: string, instagram?: string
     }>({
          name: '',
          bio: '',
          file: '',
          fileName: '',
          publicAddress: account?.toLowerCase() || '',
     })

     useEffect(() => {
          if (account) {
               getUser()
          }
     }, [ account ])

     const getUser = () => {
          console.log(account)
          firestore.collection('users').doc(account || '').get().then((doc) => {
               if (doc.exists) {
                    const user = doc.data() as ICreator & { twitter?: string, instagram?: string }
                    setFormCreator({
                         ...formCreator,
                         name: user?.name || '',
                         bio: user?.bio || '',
                         publicAddress: user?.publicAddress || '',
                         twitter: user?.twitter || '',
                         instagram: user?.instagram || '',
                    })
                    setFilepreview(user?.images.thumbnail_128 || '')
               } else {
                    console.log("No such document!");
               }
          }).catch((error) => {
               console.log("Error getting document:", error);
          });
     }

     function handleInputChange(e: any) {
          const { name, value } = e.currentTarget
          setFormCreator({ ...formCreator, [name]: value })
     }

     async function edit() {
          console.log('edit')
          console.log('formCreator', formCreator)

          try {
               const updateProfile = functions.httpsCallable('updateProfile')
               const { data: result } = await updateProfile({ ...formCreator, publicAddress: account })

               if (result.status === "success") {
                    swal({
                         // buttons: [true],
                         text: "update profile success.",
                         icon: "success",
                    }).then(() => {
                         history.push(`/profile/${account}`);
                    });
               } else {
                    swal({
                         // buttons: [true],
                         text: "Something's wrong!",
                         icon: "error",
                    });
               }
          } catch (error) {
               swal({
                    // buttons: [true],
                    text: "Something's wrong! " + error.message,
                    icon: "error",
               });
               console.log(error)
          }
     }

     // ----- On Drag and Drop Image  ----- //

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
                    setFormCreator({ ...formCreator, file: reader.result as any, fileName: file.name })
               };
          }
     }, [ formCreator ]);

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
                    setFormCreator({ ...formCreator, file: reader.result as any, fileName: file.name })
               };
          }
     };

     const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

     return (
          <div className="body-container __create-work">
               <div className="body-wrapper __create-work">
                    <Label title={'Edit Profile'} />
                    <div className="md:flex md:flex-row justify-center">
                         <UploadProfileImage filepreview={filepreview} file={file} isDragActive={isDragActive} getRootProps={getRootProps} handleChangeFileUpload={handleChangeFileUpload} />

                         <div className="lg:w-1/2 md:px-10">
                              <TextField label="Name" onChange={handleInputChange} name="name" id="name" placeholder="Enter Name" type="text" value={formCreator.name} />
                              <TextField label="Bio" onChange={handleInputChange} name="bio" id="bio" placeholder="Enter Bio" type="text-area" value={formCreator.bio} />
                              <TextField label="Twiter" onChange={handleInputChange} name="twitter" id="twitter" placeholder="Enter Twitter" type="text" value={formCreator.twitter} />
                              <TextField label="Instagram" onChange={handleInputChange} name="instagram" id="instagram" placeholder="Enter Instagram" type="text" value={formCreator.instagram} />
                              <button
                                   onClick={edit}
                                   className="w-full flex-none bg-gray-900 hover:bg-gray-700 text-white textLg leading-6 font-semibold py-3 px-6 border border-transparent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200 mt-3"
                              >
                                   Save
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
}
