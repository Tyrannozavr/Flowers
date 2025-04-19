import React, {useState, useEffect} from 'react';
import styles from './AssortmentPage.module.css';
import plussIcon from '../assets/pluss.svg';
import shopIcon from '../assets/shop.svg';
import {useQuery} from "react-query";
import {addCategory, fetchShops, getShopCategories} from "../api/shops.ts";
import {createCategory} from "../api/categories.ts";
import {createProduct, deleteProduct, fetchProducts, updateProduct} from "../api/products.ts";

interface Category {
    id: number;
    name: string;
    value: string;
    imageUrl?: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    ingredients: string;
    categoryId?: number;
    images: string[];
    availability: string;
}

interface NewProductForm {
    id?: string;
    name?: string;
    description?: string;
    composition?: string;
    category_id?: number;
    price?: string;
    images?: File[];
    inStock?: boolean;
}

interface NewCategoryForm {
    name?: string;
    imageUrl?: string;
}

export const AssortmentPage: React.FC = () => {
    const [isCreatingProduct, setIsCreatingProduct] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newProduct, setNewProduct] = useState<NewProductForm>({inStock: true});
    const [newCategory, setNewCategory] = useState<NewCategoryForm>({});
    const [selectedImages, setSelectedImages] = useState<(File | { url: string, name: string, isExisting: boolean })[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const fetchedProducts = await fetchProducts();
                setProducts(fetchedProducts);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products. Please try again later.");
            }
        };

        loadProducts();
    }, []);

    useEffect(() => {
        if (editingProduct) {
            setNewProduct({
                name: editingProduct.name,
                description: editingProduct.description,
                composition: editingProduct.ingredients,
                category_id: Number(editingProduct.categoryId),
                price: editingProduct.price.toString(),
                inStock: editingProduct.availability === 'AVAILABLE'
            });
            // Note: We don't set selectedImages here because we can't retrieve the File objects from URLs
        }
    }, [editingProduct]);

    const {
        data: shops,
    } = useQuery("shops", fetchShops, {
        retry: false,
        onSuccess: async (data) => {
            if (data.length > 0) {
                const shopId = data[0].id;
                try {
                    const categoriesData = await getShopCategories(shopId);
                    if (categoriesData.length > 0) {
                        setCategories(categoriesData);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    });
    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewCategory(prev => ({...prev, [name]: value}));
    };

    const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImages([e.target.files[0]]); // Для категории достаточно одного фото
        }
    };

    const handleCategorySave = async () => {
        if (!newCategory.name) {
            setError('Ошибка при сохранении. Укажите название категории');
            return;
        }

        // const category: Category = {
        //   id: Date.now().toString(),
        //   name: newCategory.name,
        //   value: selectedImages.length > 0 ? selectedImages[0].name : '',
        //   imageUrl: selectedImages.length > 0 ? URL.createObjectURL(selectedImages[0]) : '',
        // };

        const categoryData = {
            name: newCategory.name,
            value: selectedImages.length > 0 ? selectedImages[0].name : '',
            image: selectedImages.length > 0 ? selectedImages[0] : null,
        };

        try {
            const response = await createCategory(categoryData);

            if (response) {
                try {
                    if (!shops.length) return;
                    const responseSectionShop = await addCategory(shops[0].id, response.id);
                    if (responseSectionShop) {
                        console.log(responseSectionShop);
                        setCategories([
                            ...categories,
                            {
                                id: response.id,
                                name: response.name,
                                value: response.value,
                                imageUrl: response.imageUrl,
                            },
                        ]);
                        setNewCategory({});
                        setSelectedImages([]);
                        setIsCreatingCategory(false);
                        setError(null);
                    }
                } catch (errSh) {
                    setError('error');
                    console.log(errSh);
                }
            }
        } catch (err) {
            setError('Ошибка при сохранении категории');
            console.error(err);
        }
    };

    const handleCategoryDelete = () => {
        setIsCreatingCategory(false);
        setNewCategory({});
        setSelectedImages([]);
        setError(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        if (name === 'price') {
            const sanitizedValue = value.replace(/[^\d.,]/g, '');
            setNewProduct(prev => ({...prev, [name]: sanitizedValue}));
        } else if (name === 'category_id') {
            setNewProduct(prev => ({...prev, [name]: Number(value)}));
        } else {
            setNewProduct(prev => ({...prev, [name]: value}));
        }
    };

    const handleInStockToggle = () => {
        setNewProduct(prev => ({...prev, inStock: !prev.inStock}));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const totalImages = selectedImages.length + newFiles.length;

            if (totalImages > 5) {
                setError('Можно загрузить не более 5 фотографий');
                return;
            }

            setSelectedImages(prev => [...prev, ...newFiles]);
            setError(null);
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.composition || !newProduct.category_id) {
            setError('Ошибка при сохранении. Заполните название, цену, состав и выберите категорию');
            return;
        }

        const priceValue = parseFloat(newProduct.price.replace(',', '.'));
        if (isNaN(priceValue)) {
            setError('Ошибка при сохранении. Укажите корректную цену');
            return;
        }
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', priceValue.toString());
        formData.append('category_id', newProduct.category_id.toString());
        formData.append('availability', newProduct.inStock ? 'AVAILABLE' : 'HIDDEN');
        formData.append('description', newProduct.description || '');
        formData.append('ingredients', newProduct.composition || '');

        // Append images
        const newImages = selectedImages.filter(image => image instanceof File);
        newImages.forEach((image: File) => {
            formData.append(`images`, image, image.name);
        });

        // Append existing image URLs
        const existingImages = selectedImages
            .filter(image => typeof image === 'object' && 'isExisting' in image)
            .map(image => (image as { url: string }).url);
        formData.append('existing_images', JSON.stringify(existingImages));

        try {
            if (editingProduct) {
                console.log("Updating product", formData);
                await updateProduct({
                    productId: Number(editingProduct.id),
                    formData
                });
            } else {
                console.log("Creating new product", formData);
                await createProduct({
                    formData
                });
            }
            const updatedProducts = await fetchProducts();
            setProducts(updatedProducts);
            setIsCreatingProduct(false);
            setNewProduct({inStock: true});
            setSelectedImages([]);
            setEditingProduct(null);
            setError(null);
        } catch (err) {
            console.error("Failed to save product:", err);
            setError("Failed to save product. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (editingProduct) {
            try {
                await deleteProduct({productId: Number(editingProduct.id)});
                const updatedProducts = await fetchProducts();
                setProducts(updatedProducts);
                setIsCreatingProduct(false);
                setNewProduct({inStock: true});
                setSelectedImages([]);
                setEditingProduct(null);
                setError(null);
            } catch (err) {
                console.error("Failed to delete product:", err);
                setError("Failed to delete product. Please try again.");
            }
        } else {
            // This is the existing behavior for canceling product creation
            setIsCreatingProduct(false);
            setNewProduct({inStock: true});
            setSelectedImages([]);
            setEditingProduct(null);
            setError(null);
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            composition: product.ingredients,
            category_id: Number(product.categoryId),
            price: product.price.toString(),
            inStock: product.availability === 'AVAILABLE'
        });
        setSelectedImages(product.images.map(url => ({
            url,
            name: url.split('/').pop() || 'image',
            isExisting: true
        })));
        setIsCreatingProduct(true);
    };

    if (isCreatingCategory) {
        return (
            <div className={styles.container}>
                <h2 className={styles.pageTitle}>Создание категории</h2>
                <div className={styles.form}>
                    <h3 className={styles.formTitle}>Новая категория</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Название категории"
                        value={newCategory.name || ''}
                        onChange={handleCategoryInputChange}
                        className={styles.input}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryImageUpload}
                        style={{display: 'none'}}
                        id="categoryImageUpload"
                    />
                    {selectedImages.length > 0 && (
                        <div className={styles.previewImages}>
                            {selectedImages.map((image, index) => (
                                <div key={index} className={styles.previewImage}>
                                    <img src={image instanceof File ? URL.createObjectURL(image) : (image as { url: string }).url} alt={`Preview ${index}`}/>
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className={styles.removeImageButton}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={styles.buttonContainer}>
                        <label htmlFor="categoryImageUpload" className={styles.uploadButton}>
                            Загрузите фото
                        </label>
                        <div className={styles.actionButtons}>
                            <button onClick={handleCategorySave} className={styles.saveButton}>
                                Сохранить
                            </button>
                            <button onClick={handleCategoryDelete} className={styles.deleteButton}>
                                Удалить
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className={styles.errorMessage}>
                            <span className={styles.errorIcon}>×</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (isCreatingProduct) {
        return (
            <div className={styles.container}>
                <h2 className={styles.pageTitle}>{editingProduct ? "Редактирование товара" : "Создание товара"}</h2>
                <div className={styles.form}>
                    <h3 className={styles.formTitle}>{editingProduct ? "Редактировать товар" : "Новый товар"}</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Название"
                        value={newProduct.name || ''}
                        onChange={handleInputChange}
                        className={styles.input}
                    />
                    <textarea
                        name="description"
                        placeholder="Описание"
                        value={newProduct.description || ''}
                        onChange={handleInputChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        required={true}
                        name="composition"
                        placeholder="Состав"
                        value={newProduct.composition || ''}
                        onChange={handleInputChange}
                        className={styles.input}
                    />
                    <select
                        name="category_id"
                        value={newProduct.category_id?.toString() || ''}
                        onChange={handleInputChange}
                        className={styles.input}
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id.toString()}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="price"
                        placeholder="Цена"
                        value={newProduct.price || ''}
                        onChange={handleInputChange}
                        className={styles.input}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{display: 'none'}}
                        id="imageUpload"
                    />
                    {selectedImages.length > 0 && (
                        <div className={styles.previewImages}>
                            {selectedImages.map((image, index) => (
                                <div key={index} className={styles.previewImage}>
                                    <img src={image instanceof File ? URL.createObjectURL(image) : (image as { url: string }).url} alt={`Preview ${index}`}/>
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className={styles.removeImageButton}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={styles.buttonContainer}>
                        <button
                            onClick={handleInStockToggle}
                            className={styles.inStockButton} // Убираем динамическое добавление класса .active
                        >
                            {newProduct.inStock ? 'Товар в наличии' : 'Товар скрыт'}
                        </button>
                        <label htmlFor="imageUpload" className={styles.uploadButton}>
                            Загрузите до 5 фото
                        </label>
                        <div className={styles.actionButtons}>
                            <button onClick={handleSave} className={styles.saveButton}>
                                Сохранить
                            </button>
                            <button onClick={handleDelete} className={styles.deleteButton}>
                                Удалить
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className={styles.errorMessage}>
                            <span className={styles.errorIcon}>×</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Секция категорий */}
            <div className={styles.section}>
                <h2 className={styles.pageTitle}>Категории</h2>
                {categories.length === 0 ? (
                    <div className={styles.categoriesGrid}>
                        <button
                            onClick={() => setIsCreatingCategory(true)}
                            className={styles.categoryCard}
                        >
                            <div className={styles.hoverRectangle}></div>
                            <div className={styles.categoryImage}>
                                <img src={plussIcon} alt="Add category" className={styles.categoryIcon}/>
                            </div>
                            <p className={styles.categoryName}>
                                Добавить<br/>категорию
                            </p>
                        </button>
                    </div>
                ) : (
                    <div className={styles.categoriesGrid}>
                        {categories.map(category => (
                            <div key={category.id} className={styles.categoryCard}>
                                <div className={styles.hoverRectangle}></div>
                                <div className={styles.categoryImage}>
                                    {category.imageUrl ? (
                                        <img src={category.imageUrl} alt={category.name}/>
                                    ) : (
                                        <span className={styles.categoryPlaceholder}>img</span>
                                    )}
                                </div>
                                <p className={styles.categoryName}>{category.name}</p>
                            </div>
                        ))}
                        <button
                            onClick={() => setIsCreatingCategory(true)}
                            className={styles.categoryCard}
                        >
                            <div className={styles.hoverRectangle}></div>
                            <div className={styles.categoryImage}>
                                <img src={plussIcon} alt="Add category" className={styles.categoryIcon}/>
                            </div>
                            <p className={styles.categoryName}>
                                Добавить<br/>категорию
                            </p>
                        </button>
                    </div>

                )}
            </div>

            {/* Секция ассортимента */}
            <div className={styles.section}>
                <h2 className={styles.pageTitle}>Ассортимент</h2>
                {products.length === 0 ? (
                    <div className={styles.productsGrid}>
                        <div className={styles.productCard}>
                            <div className={styles.productImage}>
                                <div className={styles.productPlaceholder}>
                                    <img src={shopIcon} alt="Add product" className={styles.productIcon}/>
                                </div>
                            </div>
                            <div className={styles.productInfo}>
                                <button
                                    onClick={() => setIsCreatingProduct(true)}
                                    className={styles.addProductButton}
                                >
                                    + Добавить товар
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.productsGrid}>
                        {products.map(product => (
                            <div key={product.id} className={styles.productCard}>
                                <div className={styles.productImage}>
                                    {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0]} alt={product.name}/>
                                    ) : (
                                        <div className={styles.productPlaceholder}>
                                            <img src={shopIcon} alt="Product placeholder" className={styles.productIcon}/>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.productInfo}>
                                    <p className={styles.price}>{product.price} ₽</p>
                                    <p className={styles.name}>{product.name}</p>
                                    <button onClick={() => handleEditProduct(product)} className={styles.editButton}>
                                        Редактировать
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className={styles.productCard}>
                            <div className={styles.productImage}>
                                <div className={styles.productPlaceholder}>
                                    <img src={shopIcon} alt="Add product" className={styles.productIcon}/>
                                </div>
                            </div>
                            <div className={styles.productInfo}>
                                <button
                                    onClick={() => setIsCreatingProduct(true)}
                                    className={styles.addProductButton}
                                >
                                    + Добавить товар
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssortmentPage;