import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import WrapperField from '~/components/common/WrapperField';
import InputDefault from '~/components/input/InputDefault';
import { className } from '~/utils/className';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import storage from '~/api/firebase/Firebase';
import InputTextarea from '~/components/input/InputTextarea';

const schema = Yup.object({
    name: Yup.string().required('Please enter your Collection Name!'),
    title: Yup.string().required('Please enter your Title!'),
    subTitle: Yup.string().required('Please enter your Sub Title!'),
});

type NewProductCollectionProps = {
    onSubmit: (values: any) => void;
    onCancel: () => void;
};

const NewProductCollection = ({ onSubmit, onCancel }: NewProductCollectionProps) => {
    const [image, setImage] = useState<any>();
    const [url, setUrl] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {
        handleSubmit,
        control,
        // setValue,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema), mode: 'onSubmit' });
    const resetForm = () => {
        reset({
            name: '',
        });
        setIsUploaded(false);
        setUploading(false);
        setIsSubmitted(false);
        setUrl('');
        setImage(null);
    };
    const onHandleSubmitNew = (values: any) => {
        const data = {
            ...values,
            media: {
                fileType: image.type,
                fileName: image.name,
                filePath: url,
            },
        };
        onSubmit(data);
        resetForm();
    };
    const handleChange = (e: any) => {
        const newImage = e.target.files[0];
        // newImage['id'] = Math.random();
        setImage(newImage);
        setIsUploaded(true);
    };
    const uploadFirebase = () => {
        setUploading(!uploading);
        const promises: Array<any> = [];
        //eslint-disable-next-line array-callback-return
        const imageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, image);
        promises.push(uploadTask);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Handle upload progress if needed
            },
            (error: any) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
                    setUrl(url);
                });
            },
        );
        Promise.all(promises)
            .then(() => {
                toast.success('Upload success', {
                    autoClose: 500,
                });
                setUploading(false);
                setIsUploaded(false);
                setIsSubmitted(!isSubmitted);
                const mediaInput = document.getElementById('media') as HTMLInputElement;
                mediaInput.value = '';
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        const arrErrors = Object.values(errors);
        if (arrErrors.length > 0) {
            if (arrErrors[0]?.message) {
                const message = arrErrors[0]?.message;
                toast.error(message.toString(), {
                    autoClose: 1000,
                    pauseOnHover: false,
                    draggable: true,
                    delay: 50,
                });
            }
        }
    }, [errors]);
    return (
        <>
            <div>
                <h1 className='font-bold text-3xl mb-7 text-center'>Create Collection</h1>
                <div className='w-full p-2 bg-white rounded-xl overflow-y-auto h-[450px]'>
                    <form onSubmit={handleSubmit(onHandleSubmitNew)}>
                        <div className='flex flex-col gap-4'>
                            <WrapperField>
                                <label htmlFor='' className='font-bold  flex text-left'>
                                    Collection Name<p className='text-red-700 ml-1'>*</p>:
                                </label>
                                <InputDefault
                                    placeholder='Enter Collection Name'
                                    control={control}
                                    name='name'
                                    className='col-span-3'
                                />
                            </WrapperField>
                            <WrapperField>
                                <label htmlFor='' className='font-bold flex text-left'>
                                    Title<p className='text-red-700 ml-1'>*</p>:
                                </label>
                                <InputDefault
                                    placeholder='Enter Title'
                                    control={control}
                                    name='title'
                                    className='col-span-3'
                                />
                            </WrapperField>
                            <WrapperField>
                                <label htmlFor='' className='font-bold flex text-left'>
                                    Subtitle<p className='text-red-700 ml-1'>*</p>:
                                </label>
                                <InputTextarea
                                    placeholder='Enter Subtitle'
                                    control={control}
                                    name='subTitle'
                                    className='col-span-3'
                                />
                            </WrapperField>
                            <div className='text-left flex items-center'>
                                <input
                                    name='media'
                                    id='media'
                                    type='file'
                                    onChange={handleChange}
                                    className='w-2/4 px-4 py-2 rounded-lg border border-c6'
                                />
                                <Button
                                    outline={false}
                                    type='button'
                                    disabled={!isUploaded}
                                    onClick={uploadFirebase}
                                    className={className(
                                        'ml-4 h-12 w-[130px] rounded-md text-white font-semibold bg-gradient-to-br from-orange-500 to-pink-500',
                                    )}
                                >
                                    {!uploading ? (
                                        'Upload'
                                    ) : (
                                        <div className='flex items-center justify-center'>
                                            <div className='w-7 h-7 bg-transparent border-[3px] border-t-[3px] border-t-transparent animate-spin border-white rounded-full'></div>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className='flex justify-center gap-4 p-5'>
                            <Button color='success' type='submit' disabled={!isSubmitted}>
                                Yes, I'm sure
                            </Button>
                            <Button color='failure' onClick={onCancel}>
                                No, cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NewProductCollection;
