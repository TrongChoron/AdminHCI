import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import DetailProduct from '~/screens/detail/DetailProduct';
import TogglePublic from '../toogle/TogglePublic';
import NewSubproduct from '~/screens/new/NewSubproduct';
import { className } from '~/utils/className';
import DetailSubProduct from '~/screens/detail/DetailSubProduct';
import { productApi } from '~/api/product.api';

type CardProductProps = {
    onHandleDelete: (id: string) => void;
    onHandleSubmitUpdate: (id: string, values: any) => void;
    onHandleNewSubproduct: (productId: string, values: any) => void;
    onHandleUpdateSubproduct: (productId: string, subProductId: string, values: any) => void;
    onDeleteSubProduct: (productId: string, subProductId: string) => void;
    handleSetPublic: (product: any) => void;
    product: any;
};

const CardProduct = ({
    onHandleDelete,
    onHandleSubmitUpdate,
    onHandleNewSubproduct,
    onHandleUpdateSubproduct,
    onDeleteSubProduct,
    handleSetPublic,
    product,
}: CardProductProps) => {
    const [modalDelete, setModalDelete] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [modalSubProduct, setModalSubProduct] = useState(false);
    const [modalUpdateSubProduct, setModalUpdateSubProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(product);
    const shortenText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
            return text; // Trả về đoạn văn bản gốc nếu nó đã ngắn hơn hoặc bằng maxLength
        }

        const shortened = text.substr(0, maxLength); // Cắt đoạn văn bản ban đầu thành maxLength ký tự
        return `${shortened}...`; // Thêm dấu "..." vào cuối đoạn văn bản ngắn
    };
    const onCloseSubproduct = () => {
        setModalSubProduct(!modalSubProduct);
    };
    const onSubmitSubproduct = (values: any) => {
        onHandleNewSubproduct(product.id, values);
        setModalSubProduct(!modalSubProduct);
    };
    const onCloseUpdateSubproduct = () => {
        setModalUpdateSubProduct(!modalUpdateSubProduct);
    };
    const onSubmitUpdateSubproduct = (subProductId: string, values: any) => {
        onHandleUpdateSubproduct(product.id, subProductId, values);
        setModalUpdateSubProduct(!modalUpdateSubProduct);
    };
    const onCloseUpdate = () => {
        setSelectedProduct(product);
        setModalUpdate(!modalUpdate);
    };
    const onSubmitUpdate = (id: string, values: any) => {
        onHandleSubmitUpdate(id, values);
        setModalUpdate(!modalUpdate);
    };
    const onDelete = () => {
        onHandleDelete(product.id);
        setModalDelete(!modalDelete);
    };
    const onCancelDelete = () => {
        setModalDelete(!modalDelete);
    };
    const handleDeleteSub = (subProductId: string) => {
        onDeleteSubProduct(product.id, subProductId);
        setModalUpdateSubProduct(!modalUpdateSubProduct);
    };
    const onHandleSetPublic = () => {
        handleSetPublic(selectedProduct);
    };
    return (
        <>
            <Modal
                show={modalSubProduct}
                size='7xl'
                position='center'
                popup={true}
                onClose={onCloseSubproduct}
            >
                <Modal.Header className='bg-white' />
                <Modal.Body className='bg-white'>
                    <NewSubproduct onSubmit={onSubmitSubproduct} onCancel={onCloseSubproduct} />
                </Modal.Body>
            </Modal>
            <Modal
                show={modalUpdate}
                size='7xl'
                position='center'
                popup={true}
                onClose={onCloseUpdate}
            >
                <Modal.Header className='bg-white' />
                <Modal.Body className='bg-white'>
                    <DetailProduct
                        onSubmit={onSubmitUpdate}
                        onCancel={onCloseUpdate}
                        product={selectedProduct}
                    />
                </Modal.Body>
            </Modal>
            <Modal
                show={modalDelete}
                size='xl'
                position='center'
                popup={true}
                onClose={onCancelDelete}
            >
                <Modal.Header className='bg-white' />
                <Modal.Body className='bg-white'>
                    <>
                        <div className='items-center text-center'>
                            <h1 className='text-2xl font-bold p-3'>Delete Product</h1>
                            <span>
                                <h1>Do you want delete user with product: {product.name}</h1> You
                                can't undo this action afterwards.
                            </span>

                            <div className='flex items-center justify-center gap-20 mt-10'>
                                <Button color='success' onClick={onDelete}>
                                    Yes
                                </Button>
                                <Button color='failure' onClick={onCancelDelete}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </>
                </Modal.Body>
            </Modal>
            <div className='w-[320px] h-[450px] shadow-xl bg-white m-2 rounded-2xl'>
                <div className='flex flex-col mt-3 px-2'>
                    <div className='ml-5'>
                        <p className='text-black font-semibold text-lg h-[52px] my-1'>
                            Product Name: {shortenText(product.name, 40)}
                        </p>
                        <p className='h-[72px] my-1'>
                            Description: {shortenText(product.description, 70)}
                        </p>
                        <p className='my-1'>Form: {product.form}</p>
                        <p className='my-1'>Material: {product.material}</p>
                        <p className='my-1'>Collection: {product.collection.name}</p>
                        <p className='my-1'>
                            Category: {shortenText(product.category.name, 15)} -{' '}
                            {product.category.gender.toUpperCase()}
                        </p>
                        <p className=''>Style: {product.style.name}</p>
                        <span className='flex items-center'>
                            <p>Subproduct:</p>
                            {product.items.length === 0 ? (
                                <></>
                            ) : (
                                product.items.map((sub: any, index: number) => (
                                    <div key={index}>
                                        <Modal
                                            show={modalUpdateSubProduct}
                                            size='7xl'
                                            position='center'
                                            popup={true}
                                            onClose={onCloseUpdateSubproduct}
                                        >
                                            <Modal.Header className='bg-white' />
                                            <Modal.Body className='bg-white'>
                                                <DetailSubProduct
                                                    onSubmit={onSubmitUpdateSubproduct}
                                                    onCancel={onCloseUpdateSubproduct}
                                                    subProduct={sub}
                                                    onDelete={handleDeleteSub}
                                                />
                                            </Modal.Body>
                                        </Modal>
                                        <div
                                            style={{ backgroundColor: sub.color.colorValue }}
                                            onClick={onCloseUpdateSubproduct}
                                            className={className(
                                                'h-[24px] w-[24px] mx-2 rounded-lg cursor-pointer',
                                                sub.color.colorValue === '#ffffff'
                                                    ? 'border border-gra'
                                                    : '',
                                            )}
                                        ></div>
                                    </div>
                                ))
                            )}
                            <button
                                className='px-2 rounded-lg ml-2 hover:bg-gray-c4 bg-success'
                                onClick={onCloseSubproduct}
                            >
                                +
                            </button>
                        </span>
                        <TogglePublic
                            product={selectedProduct}
                            handleSetPublic={onHandleSetPublic}
                        />
                    </div>
                </div>
                <div className='flex justify-center items-center py-4 mt-3 flex-col'>
                    <div className='flex'>
                        <Button
                            color='light'
                            className='mx-2'
                            outline={false}
                            onClick={onCloseUpdate}
                        >
                            Update
                        </Button>
                        <Button
                            outline={false}
                            color='failure'
                            className='mx-2'
                            onClick={onCancelDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardProduct;
